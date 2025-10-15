// components/CalendarDropdown.jsx
"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarDropdown({ selectedDate, onDateSelect }) {
  const [showCalendar, setShowCalendar] = useState(false);

  // Safely handle any date format (Date object, ISO string, or undefined)
  const getDateValue = () => {
    try {
      if (!selectedDate) return new Date();
      
      // If it's already a valid Date object
      if (selectedDate instanceof Date && !isNaN(selectedDate)) {
        return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      }
      
      // If it's a string (ISO string), parse it
      if (typeof selectedDate === 'string') {
        const parsedDate = new Date(selectedDate);
        if (!isNaN(parsedDate)) {
          return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
        }
      }
      
      // Fallback to current date
      return new Date();
    } catch (error) {
      console.error("Error parsing date:", error);
      return new Date();
    }
  };

  const date = getDateValue();

  const handleDateChange = (newDate) => {
    // Ensure we have a valid Date instance
    const d = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    onDateSelect?.(d);
    setShowCalendar(false);
  };

  const formatDate = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="relative">
      <button
        onClick={() => setShowCalendar((s) => !s)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{formatDate(date)}</span>
      </button>

      {showCalendar && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowCalendar(false)} />
          <div className="absolute right-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="border-0"
              tileClassName={({ date: tileDate, view }) =>
                view === "month" && tileDate.toDateString() === date.toDateString()
                  ? "bg-blue-500 text-white rounded-full"
                  : "hover:bg-gray-100 rounded-full"
              }
              navigationLabel={({ date, view }) =>
                view === "month" ? `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}` : ""
              }
            />

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Selected:{" "}
                {date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}