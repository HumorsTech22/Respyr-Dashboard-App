
// "use client"
// import React from 'react'
// import Image from 'next/image'
// import { IoIosArrowRoundBack } from "react-icons/io";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export const Profile = () => {
//     const router = useRouter();
//  const rehydrated = useSelector((s) => s.subject?._persist?.rehydrated);
//   const currentSubject = useSelector((s) => s.subject?.currentSubject);


//   // ---------- Helpers ----------
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
//   };

//   const formatNumber = (num, digits = 1) =>
//     typeof num === "number" && isFinite(num) ? Number(num.toFixed(digits)) : null;

//   // BMI: weight_kg / (height_m^2)
//   const getBMI = (height_cm, weight_kg) => {
//     const h = Number(height_cm);
//     const w = Number(weight_kg);
//     if (!h || !w) return null;
//     const m = h / 100;
//     if (m <= 0) return null;
//     return w / (m * m);
//   };

//   const getBMICategory = (bmi) => {
//     if (bmi == null) return { label: "N/A", color: "#535359" };
//     if (bmi < 18.5) return { label: "underweight", color: "#1e90ff" };
//     if (bmi < 25)   return { label: "normal",      color: "#3FAF58" };
//     if (bmi < 30)   return { label: "overweight",  color: "#ff8c00" };
//     return { label: "obese", color: "#d62828" };
//   };

//   // BMR: Mifflin–St Jeor
//   // men: 10w + 6.25h - 5a + 5
//   // women: 10w + 6.25h - 5a - 161
//   const getBMR = (gender, height_cm, weight_kg, ageYears) => {
//     const h = Number(height_cm);
//     const w = Number(weight_kg);
//     const a = Number(ageYears);
//     if (!h || !w || !a) return null;

//     const g = String(gender || "").toLowerCase().trim();
//     const isMale = ["male", "m", "man", "boy"].includes(g);
//     const isFemale = ["female", "f", "woman", "girl"].includes(g);

//     if (!isMale && !isFemale) return null; // unknown gender

//     const base = (10 * w) + (6.25 * h) - (5 * a);
//     return isMale ? base + 5 : base - 161;
//   };

//   // ---------- Derived values ----------
//   const height = currentSubject?.height_cm;
//   const weight = currentSubject?.weight_kg;
//   const age = currentSubject?.age;
//   const gender = currentSubject?.gender;

//   const bmiRaw = getBMI(height, weight);
//   const bmi = formatNumber(bmiRaw, 1);
//   const bmiCat = getBMICategory(bmiRaw);

//   const bmrRaw = getBMR(gender, height, weight, age);
//   const bmr = typeof bmrRaw === "number" ? Math.round(bmrRaw) : null;


//     if (!rehydrated) {
//     return (
//       <div className="rounded-[20px] p-6 shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white">
//         <div className="h-5 w-24 bg-gray-200 rounded mb-6" />
//         <div className="h-8 w-40 bg-gray-200 rounded mb-3" />
//         <div className="h-4 w-56 bg-gray-200 rounded" />
//       </div>
//     );
//   }


//   if (!currentSubject) {
//     return (
//       <div className='flex flex-col gap-10 rounded-[20px] pl-5 pr-[30px] pt-[35px] pb-[60px] shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white'>
//         <div className='flex items-center gap-[7px] cursor-pointer' onClick={() => router.back()}>
//           <IoIosArrowRoundBack className='w-[33px] h-[32px]' />
//           <span className='text-[#535359] text-[15px]'>Go Back</span>
//         </div>
//         <div className="text-center py-8">
//           <p className="text-[#535359]">No subject data available</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className='flex flex-col gap-10 rounded-[20px] pl-5 pr-[30px] pt-[35px] pb-[60px] shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white'>
//       {/* Back Button */}
//       <Link
//         href="#"
//         onClick={(e) => { e.preventDefault(); router.back(); }}
//         className='flex items-center gap-[7px] cursor-pointer'
//       >
//         <IoIosArrowRoundBack className='w-[33px] h-[32px]' />
//         <span className='text-[#535359] text-[15px] tracking-[-0.6px]'>Go Back</span>
//       </Link>

//       {/* Profile Header */}
//       <div className='flex flex-col gap-5'>
//         <Image src="/assets/img/Group 2216.svg" width={80} height={80} alt="User avatar" />
//         <div className='flex flex-col gap-4'>
//           <span className='text-[#252525] text-[30px] leading-[110%] tracking-[-0.6px]'>
//             {currentSubject.name || 'Unknown Name'}
//           </span>
//           <div className='flex gap-2.5 items-center'>
//             <span className='text-[#252525] text-[15px] tracking-[0.3px]'>
//               {age ? `${age} years` : 'Age not available'}
//             </span>
//             <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none" aria-hidden="true">
//               <circle cx="2" cy="2" r="2" fill="#252525" />
//             </svg>
//             <span className='text-[#252525] text-[15px] tracking-[0.3px] capitalize'>
//               {gender || 'Gender not available'}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Profile Details */}
//       <div className='flex flex-col gap-5'>
//         <div className='flex justify-between items-center'>
//           <span className='text-[#252525] tracking-[-0.24px]'>Height</span>
//           <span className='text-[#535359] text-[12px] tracking-[-0.24px]'>
//             {height ? `${height} cm` : 'N/A'}
//           </span>
//         </div>

//         <div className='flex justify-between items-center'>
//           <span className='text-[#252525] tracking-[-0.24px]'>Weight</span>
//           <span className='text-[#535359] text-[12px] tracking-[-0.24px]'>
//             {weight ? `${weight} kg` : 'N/A'}
//           </span>
//         </div>

//         <div className='flex justify-between items-center'>
//           <span className='text-[#252525] tracking-[-0.24px]'>BMI</span>
//           <div className='flex flex-col gap-[5px] items-end'>
//             <span className='text-[#535359] text-[12px] tracking-[-0.24px]'>
//               {bmi != null ? `${bmi} kg/m²` : 'N/A'}
//             </span>
//             <span
//               className='text-[10px] tracking-[-0.2px] capitalize'
//               style={{ color: bmiCat.color }}
//             >
//               {bmiCat.label}
//             </span>
//           </div>
//         </div>

//         <div className='flex justify-between items-center'>
//           <span className='text-[#252525] tracking-[-0.24px]'>BMR</span>
//           <span className='text-[#535359] text-[12px] tracking-[-0.24px]'>
//             {bmr != null ? bmr.toLocaleString() + ' Cal' : 'N/A'}
//           </span>
//         </div>

//         {currentSubject.dttm && (
//           <div className='flex justify-between items-center'>
//             <span className='text-[#252525] tracking-[-0.24px]'>Created On</span>
//             <span className='text-[#535359] text-[12px] tracking-[-0.24px]'>
//               {formatDate(currentSubject.dttm)}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };















// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { IoIosArrowRoundBack } from "react-icons/io";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { subjectTable } from "../services/authService";

// export const Profile = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const subjectId = searchParams.get("subject_id");
//   const [subjectData, setSubjectData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//   useEffect(() => {
//     const fetchSubjectData = async () => {
//       if (!subjectId) {
//         setError("No subject ID provided");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await subjectTable();
        
//         if (response.success && response.data) {
//           // Filter data based on subjectId
//           const filteredSubject = response.data.find(
//             (subject) => subject.subject_id === subjectId
//           );
          
//           if (filteredSubject) {
//             setSubjectData(filteredSubject);
//           } else {
//             setError("Subject not found");
//           }
//         } else {
//           setError("Failed to fetch subjects");
//         }
//       } catch (err) {
//         console.error("Error fetching subject data:", err);
//         setError(err.message || "An error occurred while fetching data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubjectData();
//   }, [subjectId]);

//   // Calculate BMI
//   const calculateBMI = (height, weight) => {
//     if (!height || !weight) return null;
//     const heightInMeters = height / 100;
//     return (weight / (heightInMeters * heightInMeters)).toFixed(1);
//   };

//   // Get BMI category
//   const getBMICategory = (bmi) => {
//     if (!bmi) return "";
//     if (bmi < 18.5) return "underweight";
//     if (bmi >= 18.5 && bmi < 25) return "normal";
//     if (bmi >= 25 && bmi < 30) return "overweight";
//     return "obese";
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col gap-10 rounded-[20px] pl-5 pr-[30px] pt-[35px] pb-[60px] shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white">
//         <div className="flex justify-center items-center h-40">
//           <span className="text-[#535359]">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col gap-10 rounded-[20px] pl-5 pr-[30px] pt-[35px] pb-[60px] shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white">
//         <div className="flex justify-center items-center h-40">
//           <span className="text-red-500">Error: {error}</span>
//         </div>
//       </div>
//     );
//   }

//   if (!subjectData) {
//     return (
//       <div className="flex flex-col gap-10 rounded-[20px] pl-5 pr-[30px] pt-[35px] pb-[60px] shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white">
//         <div className="flex justify-center items-center h-40">
//           <span className="text-[#535359]">No subject data found</span>
//         </div>
//       </div>
//     );
//   }

//   const bmi = calculateBMI(subjectData.height_cm, subjectData.weight_kg);
//   const bmiCategory = getBMICategory(bmi);
//   const bmiColor = bmiCategory === "normal" ? "#3FAF58" : "#FF6B6B";

//   return (
//     <div className="flex flex-col gap-10 rounded-[20px] pl-5 pr-[30px] pt-[35px] pb-[60px] shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white">
//       {/* Back Button */}
//       <Link href="#" className="flex items-center gap-[7px] cursor-pointer"
//        onClick={(e) => {
//         e.preventDefault();
//         router.back(); 
//       }}
//       >
//         <IoIosArrowRoundBack className="w-[33px] h-[32px]" />
//         <span className="text-[#535359] text-[15px] tracking-[-0.6px]">
//           Go Back
//         </span>
//       </Link>

//       {/* Profile Header */}
//       <div className="flex flex-col gap-5">
//         <Image
//           src="/assets/img/Group 2216.svg"
//           width={80}
//           height={80}
//           alt="User avatar"
//         />
//         <div className="flex flex-col gap-4">
//           <span className="text-[#252525] text-[30px] leading-[110%] tracking-[-0.6px]">
//             {subjectData.name || "User Name"}
//           </span>
//           <div className="flex gap-2.5 items-center">
//             <span className="text-[#252525] text-[15px] tracking-[0.3px]">
//               {subjectData.age ? `${subjectData.age} years` : "25 years"}
//             </span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="4"
//               height="4"
//               viewBox="0 0 4 4"
//               fill="none"
//               aria-hidden="true"
//             >
//               <circle cx="2" cy="2" r="2" fill="#252525" />
//             </svg>
//             <span className="text-[#252525] text-[15px] tracking-[0.3px] capitalize">
//               {subjectData.gender || "male"}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Profile Details */}
//       <div className="flex flex-col gap-5">
//         <div className="flex justify-between items-center">
//           <span className="text-[#252525] tracking-[-0.24px]">Height</span>
//           <span className="text-[#535359] text-[12px] tracking-[-0.24px]">
//             {subjectData.height_cm ? `${subjectData.height_cm} cm` : "170 cm"}
//           </span>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-[#252525] tracking-[-0.24px]">Weight</span>
//           <span className="text-[#535359] text-[12px] tracking-[-0.24px]">
//             {subjectData.weight_kg ? `${subjectData.weight_kg} kg` : "65 kg"}
//           </span>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-[#252525] tracking-[-0.24px]">BMI</span>
//           <div className="flex flex-col gap-[5px] items-end">
//             <span className="text-[#535359] text-[12px] tracking-[-0.24px]">
//               {bmi ? `${bmi} kg/m²` : "22.5 kg/m²"}
//             </span>
//             {bmiCategory && (
//               <span
//                 className="text-[10px] tracking-[-0.2px] capitalize"
//                 style={{ color: bmiColor }}
//               >
//                 {bmiCategory}
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-[#252525] tracking-[-0.24px]">BMR</span>
//           <span className="text-[#535359] text-[12px] tracking-[-0.24px]">
//             1580 Cal
//           </span>
//         </div>

//         <div className="flex justify-between items-center">
//           <span className="text-[#252525] tracking-[-0.24px]">Created On</span>
//           <span className="text-[#535359] text-[12px] tracking-[-0.24px]">
//             {subjectData.dttm ? formatDate(subjectData.dttm) : "September 25, 2025"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };








"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchClinicalScores } from "../services/profileService";
import { useDispatch, useSelector } from "react-redux";
import { setPersonalData, setRecordsData, setProfileLoading, setProfileError } from "../lib/store/slices/profileSlice";

export const Profile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // Get data from Redux store
  const { personal, records, loading, error } = useSelector((state) => state.profile);

  const clinicId = searchParams.get("clinic_id");  
  const subjectId = searchParams.get("subject_id"); 

  // Helper functions for calculations
  const calculateBMI = (heightCm, weightKg) => {
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);
    if (!h || !w || h === 0) return null;
    const heightInMeters = h / 100;
    return (w / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateBMR = (gender, weightKg, heightCm, age, bmi) => {
    const weight = parseFloat(weightKg);
    const height = parseFloat(heightCm);
    const ageNum = parseFloat(age);
    
    // Check if we have all required data
    if (!weight || !height || !ageNum || !gender) return null;

    // Mifflin-St Jeor Equation (most accurate for BMR)
    if (gender.toLowerCase() === 'male') {
      return (10 * weight + 6.25 * height - 5 * ageNum + 5).toFixed(0);
    } else if (gender.toLowerCase() === 'female') {
      return (10 * weight + 6.25 * height - 5 * ageNum - 161).toFixed(0);
    }
    
    return null;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { category: "underweight", color: "#FF6B6B" };
    if (bmiNum < 25) return { category: "normal", color: "#3FAF58" };
    if (bmiNum < 30) return { category: "overweight", color: "#FFA726" };
    return { category: "obese", color: "#FF6B6B" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
    const ok = !isNaN(date.getTime());
    return ok
      ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : dateString;
  };

  // Memoized calculations
  const bmi = useMemo(() => 
    calculateBMI(personal?.height_cm, personal?.weight_kg), 
    [personal?.height_cm, personal?.weight_kg]
  );

  const bmr = useMemo(() => 
    calculateBMR(
      personal?.gender, 
      personal?.weight_kg, 
      personal?.height_cm, 
      personal?.age, 
      bmi
    ), 
    [personal?.gender, personal?.weight_kg, personal?.height_cm, personal?.age, bmi]
  );

  const bmiInfo = useMemo(() => 
    getBMICategory(bmi), 
    [bmi]
  );

  const latestRecord = useMemo(() => {
    if (!records || records.length === 0) return null;
    const sorted = [...records].sort((a, b) => {
      const ta = parseInt(a.timestamp || "0", 10);
      const tb = parseInt(b.timestamp || "0", 10);
      if (tb !== ta) return tb - ta;
      const da = new Date(a.dttm.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
      const db = new Date(b.dttm.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3"));
      return db - da;
    });
    return sorted[0];
  }, [records]);

  const respFvc = useMemo(() => {
    if (!latestRecord?.respiratory_fvc_json) return null;
    try {
      return JSON.parse(latestRecord.respiratory_fvc_json);
    } catch {
      return null;
    }
  }, [latestRecord]);

  useEffect(() => {
    let mounted = true;

    const go = async () => {
      try {
        if (!clinicId || !subjectId) {
          throw new Error("Missing clinic_id or subject_id in URL");
        }
        dispatch(setProfileLoading(true));
        const data = await fetchClinicalScores(clinicId, subjectId);

        if (mounted) {
          if (data?.success) {
            dispatch(setPersonalData(data.personal || null));
            dispatch(setRecordsData(Array.isArray(data.records) ? data.records : []));
          } else {
            throw new Error(data?.message || "Failed to fetch profile");
          }
        }
      } catch (e) {
        if (mounted) dispatch(setProfileError(e.message || "Something went wrong"));
      } finally {
        if (mounted) dispatch(setProfileLoading(false));
      }
    };

    go();
    return () => {
      mounted = false;
    };
  }, [clinicId, subjectId, dispatch]);

  return (
    <div className="flex flex-col gap-10 rounded-[20px] pl-5 pr-[30px] pt-[35px] pb-[60px] shadow-[0_0_10px_5px_rgba(0,0,0,0.05)] bg-white">
      {/* Back Button */}
      <Link
        href="#"
        className="flex items-center gap-[7px] cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          router.back();
        }}
      >
        <IoIosArrowRoundBack className="w-[33px] h-[32px]" />
        <span className="text-[#535359] text-[15px] tracking-[-0.6px]">Go Back</span>
      </Link>

      {/* Loading / Error */}
      {loading && (
        <div className="text-sm text-[#535359]">Loading profile…</div>
      )}
      {!loading && error && (
        <div className="text-sm text-red-500">Error: {error}</div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Profile Header */}
          <div className="flex flex-col gap-5">
            <Image
              src="/assets/img/Group 2216.svg"
              width={80}
              height={80}
              alt="User avatar"
            />
            <div className="flex flex-col gap-4">
              <span className="text-[#252525] text-[30px] leading-[110%] tracking-[-0.6px]">
                {personal?.name || "—"}
              </span>
              <div className="flex gap-2.5 items-center">
                <span className="text-[#252525] text-[15px] tracking-[0.3px]">
                  {personal?.age ? `${personal.age} years` : "—"}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" viewBox="0 0 4 4" fill="none" aria-hidden="true">
                  <circle cx="2" cy="2" r="2" fill="#252525" />
                </svg>
                <span className="text-[#252525] text-[15px] tracking-[0.3px] capitalize">
                  {personal?.gender || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span className="text-[#252525] tracking-[-0.24px]">Height</span>
              <span className="text-[#535359] text-[12px] tracking-[-0.24px]">
                {personal?.height_cm ? `${personal.height_cm} cm` : "—"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#252525] tracking-[-0.24px]">Weight</span>
              <span className="text-[#535359] text-[12px] tracking-[-0.24px]">
                {personal?.weight_kg ? `${personal.weight_kg} kg` : "—"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#252525] tracking-[-0.24px]">BMI</span>
              <div className="flex flex-col gap-[5px] items-end">
                <span className="text-[#535359] text-[12px] tracking-[-0.24px]">
                  {bmi ? `${bmi} kg/m²` : "—"}
                </span>
                {bmiInfo && (
                  <span 
                    className="text-[10px] tracking-[-0.2px] capitalize" 
                    style={{ color: bmiInfo.color }}
                  >
                    {bmiInfo.category}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#252525] tracking-[-0.24px]">BMR</span>
              <div className="flex flex-col gap-[5px] items-end">
                <span className="text-[#535359] text-[12px] tracking-[-0.24px]">
                  {bmr ? `${bmr} Cal` : "—"}
                </span>
               
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#252525] tracking-[-0.24px]">Created On</span>
              <span className="text-[#535359] text-[12px] tracking-[-0.24px]">
                {personal?.subject_dttm ? formatDate(personal.subject_dttm) : "—"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};