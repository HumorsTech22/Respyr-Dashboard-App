"use client"

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div className=" sticky top-0 hidden lg:flex flex-col items-center justify-between  w-65 h-screen bg-[#FFFFFF] shadow-[4px_0_10px_rgba(0,0,0,0.25)] ">
      <div className="flex flex-col justify-center items-center gap-[54px] w-full  mt-[25px]">
        <Link 
        href="/dashboard"
        className="flex  items-center gap-[5.28px]">
          <Image
            src="/assets/icons/logo.png"
            width={87.72}
            height={18}
            alt="logo"
          />
          <p className="bg-[#308BF9] text-white rounded-full font-semibold text-sm px-2 py-[2px] w-fit ">
            CLINIC
          </p>
        </Link>

        <nav className="flex flex-col items-center w-full">
          <Link
            href="/dashboard"
            className={`flex gap-3 items-center pl-[50px] py-[13px] w-full hover:bg-gray-50 transition-colors ${
              isActive("/dashboard") 
                ? "bg-[#E4F0FF] text-[#308BF9]" 
                : "text-[#5B5B5B]"
            }`}
          >
            <Image
              src="/assets/icons/Group (2).svg"
              alt="Dashboard icon"
              width={20}
              height={20}
              className="cursor-pointer"
              style={{
                filter: isActive("/dashboard") 
                  ? "invert(44%) sepia(91%) saturate(1558%) hue-rotate(195deg) brightness(98%) contrast(97%)" 
                  : "invert(63%) sepia(0%) saturate(0%) hue-rotate(188deg) brightness(93%) contrast(89%)"
              }}
            />
            <span className="text-[15px] cursor-pointer font-normal tracking-[-0.04em]">
              Dashboard
            </span>
          </Link>

          <Link
            href="/testhistory"
            className={`flex gap-3 items-center pl-[50px] py-[13px] w-full hover:bg-gray-50 transition-colors ${
              isActive("/testhistory") 
                ? "bg-[#E4F0FF] text-[#308BF9]" 
                : "text-[#5B5B5B]"
            }`}
          >
            <Image
              src="/assets/icons/Vector (9).svg"
              alt="Test History icon"
              width={20}
              height={20}
              className="cursor-pointer"
              style={{
                filter: isActive("/testhistory") 
                  ? "invert(44%) sepia(91%) saturate(1558%) hue-rotate(195deg) brightness(98%) contrast(97%)" 
                  : "invert(63%) sepia(0%) saturate(0%) hue-rotate(188deg) brightness(93%) contrast(89%)"
              }}
            />
            <span className="text-[15px] cursor-pointer font-normal tracking-[-0.04em]">
              Test History
            </span>
          </Link>

          <Link
            href="/subjects"
            className={`flex gap-3 items-center pl-[50px] py-[13px] w-full hover:bg-gray-50 transition-colors ${
              isActive("/subjects") 
                ? "bg-[#E4F0FF] text-[#308BF9]" 
                : "text-[#5B5B5B]"
            }`}
          >
            <Image
              src="/assets/icons/Vector (9).svg"
              alt="Subjects icon"
              width={20}
              height={20}
              className="cursor-pointer"
              style={{
                filter: isActive("/subjects") 
                  ? "invert(44%) sepia(91%) saturate(1558%) hue-rotate(195deg) brightness(98%) contrast(97%)" 
                  : "invert(63%) sepia(0%) saturate(0%) hue-rotate(188deg) brightness(93%) contrast(89%)"
              }}
            />
            <span className="text-[15px] cursor-pointer font-normal tracking-[-0.04em]">
              Subjects
            </span>
          </Link>

               <Link
            href="/purchasedhistory"
            className={`flex gap-3 items-center pl-[50px] py-[13px] w-full hover:bg-gray-50 transition-colors ${
              isActive("/purchasedhistory") 
                ? "bg-[#E4F0FF] text-[#308BF9]" 
                : "text-[#5B5B5B]"
            }`}
          >
            <Image
              src="/assets/icons/Vector (9).svg"
              alt="Subjects icon"
              width={20}
              height={20}
              className="cursor-pointer"
              style={{
                filter: isActive("/purchasedhistory") 
                  ? "invert(44%) sepia(91%) saturate(1558%) hue-rotate(195deg) brightness(98%) contrast(97%)" 
                  : "invert(63%) sepia(0%) saturate(0%) hue-rotate(188deg) brightness(93%) contrast(89%)"
              }}
            />
            <span className="text-[15px] cursor-pointer font-normal tracking-[-0.04em]">
             Purchased History
            </span>
          </Link>
        </nav>
      </div>
    </div>
  );
}