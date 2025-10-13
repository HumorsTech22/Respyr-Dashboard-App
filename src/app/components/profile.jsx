
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