"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import directus from "@/lib/directus/client";
import { createItem } from "@directus/sdk";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Welcome to MyPerfectTrips. I am your personal travel concierge. How may I assist with your travel plans today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    // Simulated Professional Travel Agent Logic
    setTimeout(async () => {
      let botResponse = "";
      const lowerMsg = userMsg.toLowerCase();

      // Professional logic branch
      if (lowerMsg.includes("visa") || lowerMsg.includes("schengen")) {
        botResponse = "Processing visa applications, especially for the Schengen area, requires precise documentation. Are you looking for a specific destination like Spain or France, or do you just need an appointment slot?";
      } else if (lowerMsg.includes("corporate") || lowerMsg.includes("business") || lowerMsg.includes("mice")) {
        botResponse = "For corporate travel and MICE, we provide dedicated account management and policy compliance. Approximately how many travelers would this be for?";
      } else if (lowerMsg.includes("holiday") || lowerMsg.includes("package") || lowerMsg.includes("trip")) {
        botResponse = "That sounds wonderful. To help our consultants curate the perfect itinerary, could you tell me your preferred travel window and the destination you're dreaming of?";
      } else {
        botResponse = "I've noted your request. To provide you with a detailed quote and expert advice, may I have your name and contact number? One of our senior consultants will reach out to discuss your requirements.";
      }

      setMessages(prev => [...prev, { role: "bot", text: botResponse }]);
      setIsTyping(false);

      // Log to Enquiries as before
      try {
        await directus.request(createItem("Enquiries", {
          message: `Consultant Chat: ${userMsg}`,
          first_name: "Chat",
          last_name: "Lead"
        }));
      } catch (err) { /* Silent fail */ }
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Updated Header: Just MyPerfectTrips */}
          <div className="bg-[#0f172a] p-6 text-white flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border border-white/10">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">MyPerfectTrips</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em]">Live Concierge</span>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed ${
                  m.role === "user" 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm font-medium"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about visas, flights, or packages..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-600/50"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}