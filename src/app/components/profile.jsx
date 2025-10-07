
"use client"
import React from 'react'
import Image from 'next/image'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Profile = () => {
    const router = useRouter();
 const rehydrated = useSelector((s) => s.subject?._persist?.rehydrated);
  const currentSubject = useSelector((s) => s.subject?.currentSubject);


  // ---------- Helpers ----------
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatNumber = (num, digits = 1) =>
    typeof num === "number" && isFinite(num) ? Number(num.toFixed(digits)) : null;

  // BMI: weight_kg / (height_m^2)
  const getBMI = (height_cm, weight_kg) => {
    const h = Number(height_cm);
    const w = Number(weight_kg);
    if (!h || !w) return null;
    const m = h / 100;
    if (m <= 0) return null;
    return w / (m * m);
  };

  const getBMICategory = (bmi) => {
    if (bmi == null) return { label: "N/A", color: "#535359" };
    if (bmi < 18.5) return { label: "underweight", color: "#1e90ff" };
    if (bmi < 25)   return { label: "normal",      color: "#3FAF58" };
    if (bmi < 30)   return { label: "overweight",  color: "#ff8c00" };
    return { label: "obese", color: "#d62828" };
  };

  // BMR: Mifflin–St Jeor
  // men: 10w + 6.25h - 5a + 5
  // women: 10w + 6.25h - 5a - 161
  const getBMR = (gender, height_cm, weight_kg, ageYears) => {
    const h = Number(height_cm);
    const w = Number(weight_kg);
    const a = Number(ageYears);
    if (!h || !w || !a) return null;

    const g = String(gender || "").toLowerCase().trim();
    const isMale = ["male", "m", "man", "boy"].includes(g);
    const isFemale = ["female", "f", "woman", "girl"].includes(g);

    if (!isMale && !isFemale) return null; // unknown gender

    const base = (10 * w) + (6.25 * h) - (5 * a);
    return isMale ? base + 5 : base - 161;
  };

  // ---------- Derived values ----------
  const height = currentSubject?.height_cm;
  const weight = currentSubject?.weight_kg;
  const age = currentSubject?.age;
  const gender = currentSubject?.gender;

  const bmiRaw = getBMI(height, weight);
  const bmi = formatNumber(bmiRaw, 1);
  const bmiCat = getBMICategory(bmiRaw);

  const bmrRaw = getBMR(gender, height, weight, age);
  const bmr = typeof bmrRaw === "number" ? Math.round(bmrRaw) : null;


    if (!rehydrated) {
    return (
      <div className="rounded-[20px] p-6 shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white">
        <div className="h-5 w-24 bg-gray-200 rounded mb-6" />
        <div className="h-8 w-40 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-56 bg-gray-200 rounded" />
      </div>
    );
  }


  if (!currentSubject) {
    return (
      <div className='flex flex-col gap-10 rounded-[20px] pl-5 pr-[30px] pt-[35px] pb-[60px] shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white'>
        <div className='flex items-center gap-[7px] cursor-pointer' onClick={() => router.back()}>
          <IoIosArrowRoundBack className='w-[33px] h-[32px]' />
          <span className='text-[#535359] text-[15px]'>Go Back</span>
        </div>
        <div className="text-center py-8">
          <p className="text-[#535359]">No subject data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-10 rounded-[20px] pl-5 pr-[30px] pt-[35px] pb-[60px] shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white'>
      {/* Back Button */}
      <Link
        href="#"
        onClick={(e) => { e.preventDefault(); router.back(); }}
        className='flex items-center gap-[7px] cursor-pointer'
      >
        <IoIosArrowRoundBack className='w-[33px] h-[32px]' />
        <span className='text-[#535359] text-[15px] tracking-[-0.6px]'>Go Back</span>
      </Link>

      {/* Profile Header */}
      <div className='flex flex-col gap-5'>
        <Image src="/assets/img/Group 2216.svg" width={80} height={80} alt="User avatar" />
        <div className='flex flex-col gap-4'>
          <span className='text-[#252525] text-[30px] leading-[110%] tracking-[-0.6px]'>
            {currentSubject.name || 'Unknown Name'}
          </span>
          <div className='flex gap-2.5 items-center'>
            <span className='text-[#252525] text-[15px] tracking-[0.3px]'>
              {age ? `${age} years` : 'Age not available'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none" aria-hidden="true">
              <circle cx="2" cy="2" r="2" fill="#252525" />
            </svg>
            <span className='text-[#252525] text-[15px] tracking-[0.3px] capitalize'>
              {gender || 'Gender not available'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className='flex flex-col gap-5'>
        <div className='flex justify-between items-center'>
          <span className='text-[#252525] tracking-[-0.24px]'>Height</span>
          <span className='text-[#535359] text-[12px] tracking-[-0.24px]'>
            {height ? `${height} cm` : 'N/A'}
          </span>
        </div>

        <div className='flex justify-between items-center'>
          <span className='text-[#252525] tracking-[-0.24px]'>Weight</span>
          <span className='text-[#535359] text-[12px] tracking-[-0.24px]'>
            {weight ? `${weight} kg` : 'N/A'}
          </span>
        </div>

        <div className='flex justify-between items-center'>
          <span className='text-[#252525] tracking-[-0.24px]'>BMI</span>
          <div className='flex flex-col gap-[5px] items-end'>
            <span className='text-[#535359] text-[12px] tracking-[-0.24px]'>
              {bmi != null ? `${bmi} kg/m²` : 'N/A'}
            </span>
            <span
              className='text-[10px] tracking-[-0.2px] capitalize'
              style={{ color: bmiCat.color }}
            >
              {bmiCat.label}
            </span>
          </div>
        </div>

        <div className='flex justify-between items-center'>
          <span className='text-[#252525] tracking-[-0.24px]'>BMR</span>
          <span className='text-[#535359] text-[12px] tracking-[-0.24px]'>
            {bmr != null ? bmr.toLocaleString() + ' Cal' : 'N/A'}
          </span>
        </div>

        {currentSubject.dttm && (
          <div className='flex justify-between items-center'>
            <span className='text-[#252525] tracking-[-0.24px]'>Created On</span>
            <span className='text-[#535359] text-[12px] tracking-[-0.24px]'>
              {formatDate(currentSubject.dttm)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
