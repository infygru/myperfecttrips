
import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    eachDayOfInterval,
    isBefore,
    startOfDay,
    isAfter
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DualMonthCalendarProps {
    selected?: Date | null;
    onSelect: (date: Date) => void;
    minDate?: Date;
    className?: string;
    onClose?: () => void;
}

export default function DualMonthCalendar({ selected, onSelect, minDate, className = "", onClose }: DualMonthCalendarProps) {
    const [viewDate, setViewDate] = useState(selected || new Date());

    const onNextMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setViewDate(addMonths(viewDate, 1));
    };

    const onPrevMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Don't allow going back past today's month if minDate is set
        const prevMonth = subMonths(viewDate, 1);
        if (minDate && isAfter(startOfMonth(minDate), endOfMonth(prevMonth))) return;
        setViewDate(prevMonth);
    };

    const renderMonth = (monthDate: Date) => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        return (
            <div className="w-[300px]">
                <div className="text-center font-bold text-slate-800 mb-4">
                    {format(monthDate, "MMMM yyyy")}
                </div>
                <div className="grid grid-cols-7 mb-2">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((dateItem, i) => {
                        const isDisabled = minDate && isBefore(dateItem, startOfDay(minDate));
                        const isSelected = selected && isSameDay(dateItem, selected);
                        const isCurrentMonth = isSameMonth(dateItem, monthStart);
                        const isToday = isSameDay(dateItem, new Date());

                        return (
                            <div
                                key={i}
                                className={`
                                aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all relative
                                ${!isCurrentMonth ? "invisible" : ""}
                                ${isDisabled ? "text-slate-200 cursor-not-allowed" : "cursor-pointer hover:bg-blue-50 hover:text-brand-blue"}
                                ${isSelected ? "bg-brand-blue text-white shadow-md hover:bg-brand-blue hover:text-white" : "text-slate-700"}
                                ${isToday && !isSelected ? "text-brand-blue font-bold" : ""}
                            `}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isDisabled && isCurrentMonth) {
                                        onSelect(dateItem);
                                        if (onClose) onClose();
                                    }
                                }}
                            >
                                {format(dateItem, "d")}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 flex gap-8 select-none ${className} animate-in fade-in zoom-in-95 duration-200`}>
            {/* Navigation - Absolute to span both */}
            <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
                <button
                    type="button"
                    onClick={onPrevMonth}
                    className="pointer-events-auto p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm bg-white border border-slate-100"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={onNextMonth}
                    className="pointer-events-auto p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm bg-white border border-slate-100"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {renderMonth(viewDate)}
            <div className="hidden md:block w-px bg-slate-100 mx-2"></div>
            <div className="hidden md:block">
                {renderMonth(addMonths(viewDate, 1))}
            </div>
        </div>
    );
}
