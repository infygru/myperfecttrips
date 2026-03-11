"use client";

import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isBefore, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MiniCalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  minDate?: Date;
}

export default function MiniCalendar({ selected, onSelect, minDate }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  // Keep calendar page in sync if parent changes date
  useEffect(() => {
    if (selected) setCurrentMonth(selected);
  }, [selected]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4 px-1">
      <button 
        type="button" 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevMonth(); }} 
        className="p-1.5 rounded-md hover:bg-stone-100 text-stone-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-[13px] font-bold text-brand-950 uppercase tracking-widest font-serif">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <button 
        type="button" 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextMonth(); }} 
        className="p-1.5 rounded-md hover:bg-stone-100 text-stone-600 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(new Date());
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-[10px] font-bold text-stone-400 w-8 h-8 flex items-center justify-center uppercase">
          {format(addDays(startDate, i), "EEEEE")}
        </div>
      );
    }
    return <div className="flex mb-1 w-full justify-between">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const isDisabled = minDate ? isBefore(startOfDay(cloneDay), startOfDay(minDate)) : false;
        const isSelected = selected ? isSameDay(cloneDay, selected) : false;
        const isCurrentMonth = isSameMonth(cloneDay, monthStart);
        const isToday = isSameDay(cloneDay, new Date());

        days.push(
          <div key={day.toString()} className="flex items-center justify-center w-8 h-8">
            <button
              type="button"
              disabled={isDisabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDisabled) onSelect(cloneDay);
              }}
              className={`w-7 h-7 flex items-center justify-center text-[13px] rounded-full transition-all duration-200
                ${!isCurrentMonth ? "text-stone-300" : "text-brand-950"}
                ${isDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-stone-100 cursor-pointer"}
                ${isSelected 
                    ? "!bg-brand-900 !text-white font-bold shadow-md scale-105" 
                    : isToday 
                        ? "bg-stone-100 text-brand-900 font-bold" 
                        : "font-medium"
                }
              `}
            >
              {formattedDate}
            </button>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="flex w-full justify-between mt-1" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="space-y-0 pb-1">{rows}</div>;
  };

  return (
    <div className="bg-white w-[230px]" onClick={(e) => e.stopPropagation()}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
