"use client"
import { CircleUser, MapPin, Menu, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { TiLocation } from "react-icons/ti";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    console.log('Sign Out clicked');
    setIsDropdownOpen(false);
  };

  return (
    <div className='md:static sticky -top-21 z-50 md:px-10 flex md:flex-row flex-col gap-y-[15px] bg-white justify-between items-center py-7'>
      <div className='flex items-center justify-between w-full md:w-auto'>
        <Menu className='md:hidden text-black' />
        <div className='flex items-center gap-[10px]'>
          {/* Your existing location code */}
        </div>
        <div className='md:hidden'>
          <Image src={'/assets/img/carimage.svg'} height={29} width={29} alt='carlogo' />
        </div>
      </div>

      <div className='flex items-center text-[#87BDFF] gap-[10px] shadow-[inset_0_0_10px_rgba(48,139,249,0.15)] px-[20px] py-[15px] rounded-[10px] md:w-[344px] w-full'>
        <Image
          src="/assets/icons/Group (1).svg"
          alt='group'
          width={20}
          height={20}
        />
        <input
          className='font-semibold text-[16px] tracking-[-0.04em] text-[#87BDFF] w-full bg-transparent outline-none'
          placeholder="search 'Rajnikanth'"
        />
      </div>

      {/* Profile Dropdown */}
      <div className="relative hidden md:block" ref={dropdownRef}>
        <Image
          src="/assets/icons/Group 2215.svg"
          alt='profile'
          width={40}
          height={40}
          className='cursor-pointer'
          onClick={toggleDropdown}
        />
        
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <Link
              href="/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Profile
            </Link>
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
  )
}

export default Header