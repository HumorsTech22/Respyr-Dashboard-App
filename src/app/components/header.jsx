// components/Header.jsx
"use client";

import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { subjectTable } from "../services/authService";
import CalendarDropdown from "./CalendarDropdown";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedDate, fetchDatewiseThunk } from "../lib/store/datewiseSlice";

const Header = ({
  enableSubjects = true,
  enableDatewise = true,
} = {}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allSubjects, setAllSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  const dropdownRef = useRef(null);
  const searchResultsRef = useRef(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardPage = pathname === "/dashboard";

  const initialQ = searchParams.get("q") || "";
  const [value, setValue] = useState(initialQ);
  const [debounced, setDebounced] = useState(initialQ);

  // ===== Redux datewise state =====
  const dispatch = useDispatch();
  const { selectedDate, loading: isDatewiseLoading, error: datewiseError } = useSelector(
    (s) => s.datewise
  );

  // ---- helpers ----
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // ---- user info from token (once) ----
  useEffect(() => {
    const accessToken = typeof window !== "undefined" ? sessionStorage.getItem("access_token") : null;
    if (accessToken) {
      const decoded = decodeToken(accessToken);
      if (decoded?.data) {
        setUserInfo({
          clinicId: decoded.data.clinic_id,
          clinicName: decoded.data.clinic_name,
        });
      }
    }
  }, []);

  // ---- load subjects (guarded) ----
  useEffect(() => {
    if (!(enableSubjects && isDashboardPage)) {
      // Not allowed or not on dashboard: ensure UI is idle and no calls are made
      setAllSubjects([]);
      setIsLoadingSubjects(false);
      return;
    }

    let alive = true;
    (async () => {
      try {
        setIsLoadingSubjects(true);
        const response = await subjectTable(); // -> fetch_subjects.php
        if (alive && response?.success && Array.isArray(response?.data)) {
          setAllSubjects(response.data);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to load subjects");
      } finally {
        if (alive) setIsLoadingSubjects(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [enableSubjects, isDashboardPage]);

  // ---- debounce search input ----
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), 300);
    return () => clearTimeout(id);
  }, [value]);

  // ---- client-side search ----
  useEffect(() => {
    if (!isDashboardPage || !enableSubjects) {
      setSearchResults([]);
      return;
    }

    if (debounced.trim() === "") {
      setSearchResults([]);
      // keep URL clean
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      return;
    }

    setIsSearching(true);
    const filtered = allSubjects.filter((subject) =>
      (subject?.name || "").toLowerCase().includes(debounced.toLowerCase())
    );
    setSearchResults(filtered);
    setIsSearching(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set("q", debounced);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, allSubjects, enableSubjects, isDashboardPage]);

  // ---- outside click handling ----
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (searchResultsRef.current && !searchResultsRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- datewise fetch (guarded) ----
  useEffect(() => {
    if (!(enableDatewise && isDashboardPage)) return;
    dispatch(fetchDatewiseThunk(selectedDate)); // -> fetch_data_by_date.php
  }, [dispatch, selectedDate, enableDatewise, isDashboardPage]);

  // ---- handlers ----
  const toggleDropdown = () => setIsDropdownOpen((s) => !s);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
    }
    setUserInfo(null);
    setIsDropdownOpen(false);
    toast.success("You have been signed out successfully!");
    router.push("/");
  };

  const handleSearchResultClick = (subject) => {
    setSearchResults([]);
    const clinicId = userInfo?.clinicId;
    if (!clinicId) {
      toast.error("Clinic information not found");
      return;
    }
    const queryString = new URLSearchParams({
      subject_id: subject.subject_id,
      clinic_id: clinicId,
    }).toString();
    router.push(`/subjectprofile?${queryString}`);
  };

  const clearSearch = () => {
    setValue("");
    setSearchResults([]);
  };

  const handleDateSelect = (date) => {
    // strip time to avoid TZ issues
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    dispatch(setSelectedDate(d.toISOString()));
  };

  // Convert ISO string back to Date safely
  const selectedDateObj = (() => {
    try {
      return selectedDate ? new Date(selectedDate) : new Date();
    } catch {
      return new Date();
    }
  })();


  return (
    <div className="md:static sticky -top-21 z-50 flex md:flex-row flex-col gap-y-[15px] bg-white justify-between items-center py-7">
      {/* Left: Calendar (only on dashboard) */}
      <div className="flex items-center justify-between w-full md:w-auto ">
        {isDashboardPage && (
          <CalendarDropdown selectedDate={selectedDateObj} onDateSelect={handleDateSelect} />
        )}
      </div>

      {/* Middle: Search (shown only if subjects feature is enabled & on dashboard) */}
      {isDashboardPage && enableSubjects && (
        <div className="flex items-center justify-start gap-4 relative">
          <div className="relative" ref={searchResultsRef}>
            <div className="flex items-center text-[#87BDFF] gap-[10px] shadow-[inset_0_0_10px_rgba(48,139,249,0.15)] px-[20px] py-[15px] rounded-[10px] md:w-[344px] w-full">
              <Image src="/assets/icons/Group (1).svg" alt="search" width={20} height={20} />
              <input
                className="font-semibold text-[16px] tracking-[-0.04em] text-[#87BDFF] w-full bg-transparent outline-none"
                placeholder={isLoadingSubjects ? "Loading subjects..." : "Search subjects by name"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") clearSearch();
                  if (e.key === "Enter" && searchResults.length > 0) {
                    handleSearchResultClick(searchResults[0]);
                  }
                }}
                disabled={isLoadingSubjects}
                aria-label="Search subjects"
              />

              {isLoadingSubjects && (
                <div className="ml-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}

              {isSearching && !isLoadingSubjects && (
                <div className="ml-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                </div>
              )}

              {value && !isLoadingSubjects && (
                <button
                  onClick={clearSearch}
                  className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                  Found {searchResults.length} subject{searchResults.length !== 1 ? "s" : ""}
                </div>
                {searchResults.map((subject) => (
                  <div
                    key={subject.subject_id}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    onClick={() => handleSearchResultClick(subject)}
                  >
                    <div className="font-medium text-gray-900">{subject.name}</div>
                  </div>
                ))}
              </div>
            )}

            {debounced && searchResults.length === 0 && !isSearching && !isLoadingSubjects && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-4 text-center text-gray-500">
                No subjects found for "{debounced}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right: Profile dropdown */}
      <div
        className="relative hidden md:block bg-[#F5F7FA] rounded-[10px]"
        ref={dropdownRef}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        {userInfo ? (
          <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors" onClick={toggleDropdown}>
            <div className="flex gap-3 text-right">
              <Image
                src="/assets/icons/Group 2215.svg"
                alt="profile"
                width={40}
                height={40}
                className="cursor-pointer"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{userInfo.clinicName}</div>
                <div className="text-xs text-gray-500">{userInfo.clinicId}</div>
              </div>
            </div>
          </div>
        ) : (
          <Image
            src="/assets/icons/Group 2215.svg"
            alt="profile"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        )}

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
