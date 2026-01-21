
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, eachDayOfInterval, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCalendarProps {
    selected?: Date | null;
    onSelect: (date: Date) => void;
    minDate?: Date;
    className?: string;
    onClose?: () => void;
}

export default function SimpleCalendar({ selected, onSelect, minDate, className = "", onClose }: SimpleCalendarProps) {
    // Initialize with selected date or today, ensuring we don't start with an invalid date if selected is null
    const [currentMonth, setCurrentMonth] = useState(() => selected || new Date());

    // Prevent back-navigation if the previous month is entirely before minDate
    const isPrevDisabled = minDate && isBefore(endOfMonth(subMonths(currentMonth, 1)), startOfDay(minDate));

    const onNextMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const onPrevMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isPrevDisabled) {
            setCurrentMonth(subMonths(currentMonth, 1));
        }
    };

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Group days into weeks for table rows
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    allDays.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return (
        <div className={`bg-white p-4 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 w-[300px] select-none ${className} font-sans`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4 px-2">
                <button
                    type="button"
                    onClick={onPrevMonth}
                    disabled={!!isPrevDisabled}
                    className={`p-1.5 rounded-full transition-colors ${isPrevDisabled ? "text-slate-200 cursor-not-allowed" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-slate-800 font-bold text-[15px]">
                    {format(currentMonth, "MMMM yyyy")}
                </span>
                <button
                    type="button"
                    onClick={onNextMonth}
                    className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Calendar Table */}
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {daysOfWeek.map((day) => (
                            <th key={day} className="text-center text-[11px] font-semibold text-slate-400 pb-2 w-[40px]">
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week, wIndex) => (
                        <tr key={wIndex}>
                            {week.map((dateItem, dIndex) => {
                                const isDisabled = minDate && isBefore(dateItem, startOfDay(minDate));
                                const isSelected = selected && isSameDay(dateItem, selected);
                                const isCurrentMonth = isSameMonth(dateItem, monthStart);
                                const isToday = isSameDay(dateItem, new Date());

                                return (
                                    <td key={dIndex} className="p-0 text-center py-0.5">
                                        <button
                                            type="button"
                                            disabled={!!isDisabled}
                                            className={`
                                        w-9 h-9 flex items-center justify-center rounded-full text-[13px] font-medium transition-all mx-auto
                                        ${!isCurrentMonth ? "text-slate-300 opacity-0 pointer-events-none" : "text-slate-700"}
                                        ${isDisabled ? "text-slate-300 opacity-50 cursor-not-allowed" : "hover:bg-blue-50 hover:text-brand-blue"}
                                        ${isSelected ? "bg-brand-blue text-white hover:bg-brand-blue hover:text-white shadow-sm" : ""}
                                        ${isToday && !isSelected ? "text-brand-blue font-bold border border-blue-100" : ""}
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
                                        </button>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
