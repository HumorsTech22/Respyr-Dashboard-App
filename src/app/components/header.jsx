"use client"
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((s) => !s);
  const handleSignOut = () => {
    console.log("Sign Out clicked");
    setIsDropdownOpen(false);
  };

  return (
    <div className="md:static sticky -top-21 z-50 md:px-10 flex md:flex-row flex-col gap-y-[15px] bg-white justify-between items-center py-7">
      <div className="flex items-center justify-between w-full md:w-auto">
        {/* left chunk (menu/logo etc) */}
        <div className="md:hidden">
          <Image src={"/assets/img/carimage.svg"} height={29} width={29} alt="carlogo" />
        </div>
      </div>

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

      {/* Profile Dropdown */}
      <div className="relative hidden md:block" ref={dropdownRef}>
        <Image
          src="/assets/icons/Group 2215.svg"
          alt="profile"
          width={40}
          height={40}
          className="cursor-pointer"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <a
              href="/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Profile
            </a>
            <button
              onClick={handleSignOut}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
