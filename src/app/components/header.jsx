"use client"
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { SlCalender } from "react-icons/sl";
import { toast } from "sonner";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Set today's date as default
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
  });

  const dropdownRef = useRef(null);
  const calendarRef = useRef(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path is /dashboard
  const isDashboardPage = pathname === '/dashboard';

  const initialQ = searchParams.get("q") || "";
  const [value, setValue] = useState(initialQ);
  const [debounced, setDebounced] = useState(initialQ);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), 300);
    return () => clearTimeout(id);
  }, [value]);

  useEffect(() => {
    // update URL when debounced value changes
    const params = new URLSearchParams(searchParams.toString());
    if (debounced) params.set("q", debounced);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- dropdown outside click ----
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
      setIsCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((s) => !s);
  const toggleCalendar = () => setIsCalendarOpen((s) => !s);

  const handleSignOut = () => {
    sessionStorage.clear();
    // Close dropdown
    setIsDropdownOpen(false);
    toast.success("You have been signed out successfully!");
    // Redirect to login page
    router.push("/");
  };



  // Calendar functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (date) => {
    const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    setSelectedDate(formattedDate);
    setIsCalendarOpen(false);
  };

  const Calendar = () => {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const navigateMonth = (direction) => {
      setCurrentDate(new Date(currentYear, currentMonth + direction, 1));
    };

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = today.toDateString() === date.toDateString();
      const isSelected = selectedDate === `${day} ${date.toLocaleString('default', { month: 'short' })} ${currentYear}`;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition-colors ${isToday && isSelected
              ? 'bg-blue-600 text-white'
              : isToday
                ? 'bg-blue-100 text-blue-600 border border-blue-300'
                : isSelected
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
            }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-64">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="font-semibold text-gray-800">
            {currentDate.toLocaleString('default', { month: 'long' })} {currentYear}
          </div>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>

        {/* Selected date display */}
        <div className="mt-4 p-2 bg-blue-50 rounded text-sm text-blue-700 text-center">
          Selected: {selectedDate}
        </div>
      </div>
    );
  };

  return (
    <div className="md:static sticky -top-21 z-50 md:px-10 flex md:flex-row flex-col gap-y-[15px] bg-white justify-between items-center py-7">
      <div className="flex items-center justify-between w-full md:w-auto">
        {/* left chunk (menu/logo etc) */}
        {/* <div className="md:hidden">
          <Image src={"/assets/img/carimage.svg"} height={29} width={29} alt="carlogo" />
        </div> */}

        {/* Calendar - Only show on dashboard page */}
        {isDashboardPage && (
          <div className="relative" ref={calendarRef}>
            <button
              onClick={toggleCalendar}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Using SlCalender icon instead of Image */}
              <SlCalender className="text-gray-600 text-lg" />
              <span className="text-gray-700 text-sm font-medium">
                {selectedDate}
              </span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isCalendarOpen && (
              <div className="absolute right-0 mt-2 z-50">
                <Calendar />
              </div>
            )}
          </div>
        )}

      </div>

      <div className="flex items-center justify-start gap-4">
        {/* SEARCH */}
        <div className="flex items-center text-[#87BDFF] gap-[10px] shadow-[inset_0_0_10px_rgba(48,139,249,0.15)] px-[20px] py-[15px] rounded-[10px] md:w-[344px] w-full">
          <Image src="/assets/icons/Group (1).svg" alt="search" width={20} height={20} />
          <input
            className="font-semibold text-[16px] tracking-[-0.04em] text-[#87BDFF] w-full bg-transparent outline-none"
            placeholder="search 'Rajnikanth'"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setValue(""); // quick clear
            }}
            aria-label="Search subjects"
          />
        </div>
      </div>

    {/* Profile Dropdown */}
<div
  className="relative hidden md:block"
  ref={dropdownRef}
  onMouseEnter={() => setIsDropdownOpen(true)}
  onMouseLeave={() => setIsDropdownOpen(false)}
>
  <Image
    src="/assets/icons/Group 2215.svg"
    alt="profile"
    width={40}
    height={40}
    className="cursor-pointer"
    // keep click optional; not needed since it's hidden on mobile
    onClick={() => setIsDropdownOpen((s) => !s)}
  />

  <div
    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 transition-all duration-150 ${
      isDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1"
    }`}
  >
    <a
      href="/profile"
      onClick={() => setIsDropdownOpen(false)}
      className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
    >
      Profile
    </a>
    <button
      onClick={handleSignOut}
      className="cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
    >
      Sign Out
    </button>
  </div>
</div>

    </div>
  );
};

export default Header;