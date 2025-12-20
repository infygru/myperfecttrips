import { FileText, Plane, Users, Music } from 'lucide-react';

const FEATURES = [
  {
    id: 1,
    title: "Schengen Visa",
    description: "Daily appointments available for Spain, France & Italy. 99% success rate.",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "Flight Booking",
    description: "Global flight ticketing with competitive corporate rates.",
    icon: Plane,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
  },
  {
    id: 3,
    title: "MICE",
    description: "Meetings, Incentives, Conferences, and Exhibitions management.",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    title: "Event Management",
    description: "Comprehensive planning for destination weddings and corporate events.",
    icon: Music,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
  },
];

// CHANGED: Removed 'default'. Now it is a Named Export.
export function WhyChooseUs() {
  return (
    <section className="py-24 bg-slate-950 text-white">
      <div className="container mx-auto px-4">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <span className="text-blue-400 font-bold tracking-widest text-sm uppercase">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 text-white">Travel Made Simple</h2>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => (
            <div 
              key={feature.id} 
              className="bg-slate-900/50 border border-white/10 p-8 rounded-3xl hover:bg-slate-900 transition-colors duration-300 group"
            >
              
              {/* ICON CONTAINER */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-white group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>

              {/* TEXT CONTENT */}
              <h3 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}