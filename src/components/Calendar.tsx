'use client';

import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isAfter,
} from 'date-fns';
import { ja } from 'date-fns/locale';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  availableDates: Set<string>;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function Calendar({
  selectedDate,
  onDateSelect,
  availableDates,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const today = new Date();

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-surface-100 text-surface-600 transition-colors"
          aria-label="前の月"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-surface-800">
          {format(currentMonth, 'yyyy年 M月', { locale: ja })}
        </h2>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-surface-100 text-surface-600 transition-colors"
          aria-label="次の月"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-1 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-surface-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const isFuture = isAfter(day, today);
          const hasData = availableDates.has(dateStr);
          const dayOfWeek = day.getDay();

          return (
            <button
              key={dateStr}
              onClick={() => !isFuture && onDateSelect(day)}
              disabled={isFuture}
              className={`
                calendar-day relative aspect-square flex items-center justify-center
                rounded-lg text-sm font-medium
                ${!isCurrentMonth ? 'text-surface-300' : ''}
                ${isCurrentMonth && !isSelected ? 'text-surface-700' : ''}
                ${isCurrentMonth && dayOfWeek === 0 && !isSelected ? 'text-red-500' : ''}
                ${isCurrentMonth && dayOfWeek === 6 && !isSelected ? 'text-blue-500' : ''}
                ${isSelected ? 'selected bg-primary-500 text-white shadow-md' : ''}
                ${isToday && !isSelected ? 'ring-2 ring-primary-300 ring-inset' : ''}
                ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                ${hasData ? 'has-data' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-surface-100 flex items-center gap-4 text-xs text-surface-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary-500" />
          <span>データあり</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded border-2 border-primary-300 inline-block" />
          <span>今日</span>
        </div>
      </div>
    </div>
  );
}
