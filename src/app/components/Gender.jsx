"use client";
import Image from "next/image";
import React, { useState, useMemo, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import { fetchClinicStats } from "../lib/store/slices/statsSlice";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Gender() {
  const dispatch = useDispatch();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScoreDropdownOpen, setIsScoreDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Good");
  const [selectedScore, setSelectedScore] = useState("Sugar Score");

  // Get datewise data from Redux store
  const datewiseData = useSelector((state) => state.datewise?.data);
  const isDatewiseLoading = useSelector((state) => state.datewise?.loading);
  const datewiseError = useSelector((state) => state.datewise?.error);
  const lastUpdatedRedux = useSelector((state) => state.datewise?.lastUpdated);

  // Get stats from Redux store
  const stats = useSelector((state) => state.stats.data);
  const statsLoading = useSelector((state) => state.stats.loading);
  const statsError = useSelector((state) => state.stats.error);
  const statsLastUpdated = useSelector((state) => state.stats.lastUpdated);

  // --- Last synced: dynamic "x min ago" ---
  const [lastSyncedAt, setLastSyncedAt] = useState(statsLastUpdated || lastUpdatedRedux || null);

  useEffect(() => {
    const mostRecent = statsLastUpdated || lastUpdatedRedux;
    if (mostRecent) setLastSyncedAt(mostRecent);
  }, [statsLastUpdated, lastUpdatedRedux]);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const timeAgo = useMemo(() => formatTimeAgo(lastSyncedAt, now), [lastSyncedAt, now]);

  function formatTimeAgo(ts, nowMs) {
    if (!ts) return "Just now";
    const base = typeof ts === "number" ? ts : new Date(ts).getTime();
    const diff = Math.max(0, nowMs - base);
    const s = Math.floor(diff / 1000);
    if (s < 60) return "Just now";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} min ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hr${h > 1 ? "s" : ""} ago`;
    const d = Math.floor(h / 24);
    return `${d} day${d > 1 ? "s" : ""} ago`;
  }

  const ageGroups = ["18–24 yrs", "25–32 yrs", "33–40 yrs", "40–50 yrs", "50< yrs"];
  const options = ["Good", "Fair", "Poor"];
  const scoreOptions = ["Sugar Score", "Liver Score", "Gut Score", "Respiratory Score"];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleScoreSelect = (score) => {
    setSelectedScore(score);
    setIsScoreDropdownOpen(false);
  };

  const getScoreValue = (record, scoreType) => {
    switch (scoreType) {
      case "Sugar Score":
        return Number(record?.Db_Score || 0);
      case "Liver Score":
        return Number(record?.liver_score || 0);
      case "Gut Score":
        return Number(record?.Gut_Score_per || 0);
      case "Respiratory Score":
        try {
          const respiratoryData = JSON.parse(record?.respiratory_fvc_json || "{}");
          return typeof respiratoryData?.["Respiratory Score(%)"]?.["Respiratory Score(%)"] === "number"
            ? Math.round(respiratoryData["Respiratory Score(%)"]["Respiratory Score(%)"])
            : 0;
        } catch {
          return 0;
        }
      default:
        return 0;
    }
  };

  const getScoreCategory = (score) => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    return "Poor";
  };

  const { maleCounts, femaleCounts, totalPatients } = useMemo(() => {
    if (!datewiseData?.data) {
      return { maleCounts: [0, 0, 0, 0, 0], femaleCounts: [0, 0, 0, 0, 0], totalPatients: 0 };
    }

    const maleCounts = [0, 0, 0, 0, 0];
    const femaleCounts = [0, 0, 0, 0, 0];
    let totalPatients = 0;

    datewiseData.data.forEach(({ personal, record }) => {
      if (personal?.gender && personal?.age && record) {
        const scoreValue = getScoreValue(record, selectedScore);
        const scoreCategory = getScoreCategory(scoreValue);

        if (scoreCategory === selectedOption) {
          const age = parseInt(personal.age);
          const gender = (personal.gender || "").toLowerCase();

          let ageGroupIndex = -1;
          if (age >= 18 && age <= 24) ageGroupIndex = 0;
          else if (age >= 25 && age <= 32) ageGroupIndex = 1;
          else if (age >= 33 && age <= 40) ageGroupIndex = 2;
          else if (age >= 41 && age <= 50) ageGroupIndex = 3;
          else if (age > 50) ageGroupIndex = 4;

          if (ageGroupIndex !== -1) {
            if (gender === "male") {
              maleCounts[ageGroupIndex]++;
              totalPatients++;
            } else if (gender === "female") {
              femaleCounts[ageGroupIndex]++;
              totalPatients++;
            }
          }
        }
      }
    });

    return { maleCounts, femaleCounts, totalPatients };
  }, [datewiseData, selectedScore, selectedOption]);

  const maxChartValue = useMemo(() => {
    const allValues = [...maleCounts, ...femaleCounts];
    const max = Math.max(...allValues);
    return max === 0 ? 10 : Math.ceil(max / 5) * 5 + 5;
  }, [maleCounts, femaleCounts]);

  const maleData = {
    labels: ageGroups,
    datasets: [{ label: "Male", data: maleCounts, backgroundColor: "#FF8E6F" }],
  };

  const femaleData = {
    labels: ageGroups,
    datasets: [{ label: "Female", data: femaleCounts, backgroundColor: "#9100FF" }],
  };

  const maleOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: maxChartValue,
        reverse: true,
        position: "top",
        ticks: { display: true, stepSize: Math.ceil(maxChartValue / 5) },
        grid: { display: true, drawBorder: false },
        border: { display: false },
      },
      y: {
        ticks: { display: false },
        grid: { display: false },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: { label: (ctx) => `Male: ${ctx.parsed.x}` },
      },
    },
  };

  const femaleOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: maxChartValue,
        position: "top",
        ticks: { stepSize: Math.ceil(maxChartValue / 5), display: true },
        grid: { display: true, drawBorder: false, borderDash: [1, 4], borderDashOffset: 5 },
        border: { display: false },
      },
      y: {
        grid: { display: false, drawBorder: false, borderDash: [1, 4], borderDashOffset: 5 },
        ticks: { display: false },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: { label: (ctx) => `Female: ${ctx.parsed.x}` },
      },
    },
  };

  const totalMales = maleCounts.reduce((s, c) => s + c, 0);
  const totalFemales = femaleCounts.reduce((s, c) => s + c, 0);

  // Load stats using Redux
  useEffect(() => {
    if (!stats && !statsLoading) {
      dispatch(fetchClinicStats());
    }
  }, [dispatch, stats, statsLoading]);

  // Coerced, clamped values for safe UI
  const subjectCount = Number(stats?.subject_count ?? 0);
  const totalTests = Number(stats?.total_tests ?? 0);
  const testUsed = Number(stats?.test_used ?? 0);
  const percentRaw = Number(stats?.percentage ?? 0);
  const percent = Number.isFinite(percentRaw) ? Math.min(100, Math.max(0, percentRaw)) : 0;

  const barColor = percent >= 90 ? "#EA5455" : "#3FAF58";

  // Loading
  if (isDatewiseLoading) {
    return (
      <div className="w-full rounded-[15px] p-5 border border-[#D9D9D9]">
        <div className="flex justify-center items-center h-40">
          <p className="text-[#535359] text-[18px]">Loading gender analytics...</p>
        </div>
      </div>
    );
  }

  // Error (datewise)
  if (datewiseError) {
    return (
      <div className="w-full rounded-[15px] p-5 border border-[#D9D9D9]">
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">Error: {datewiseError}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full rounded-[15px] p-5 border border-[#D9D9D9]">
        <div className="flex flex-col items-center">
          <p className="font-normal text-[20px] text-[#252525] tracking-[-0.04em] whitespace-nowrap">
            Gender & Age Wise Score Analytics
          </p>
          <p className="font-normal text-[12px] text-[#535359] tracking-[-0.04em]">
            Select score & score range to view analytics
          </p>
        </div>

        <div className="flex gap-5 mt-4 justify-center">
          {/* Score Type Dropdown */}
          <div className="relative">
            <div
              className="flex gap-[5px] p-[25px] items-center border border-[#C7C6CE] rounded-[10px] cursor-pointer"
              onClick={() => setIsScoreDropdownOpen(!isScoreDropdownOpen)}
            >
              <p className="font-medium text-[15px] text-[#535359] tracking-[-0.04em] whitespace-nowrap hidden md:block">
                {selectedScore}
              </p>
              <p className="font-medium text-[15px] text-[#535359] tracking-[-0.04em] whitespace-nowrap md:hidden">
                {selectedScore}
              </p>
              <IoIosArrowDown className="text-[#535359]" />
            </div>

            {isScoreDropdownOpen && (
              <div className="absolute whitespace-nowrap top-full left-0 right-0 mt-1 bg-white border border-[#C7C6CE] rounded-[10px] shadow-lg z-20 min-w-[226px]">
                {["Sugar Score", "Liver Score", "Gut Score", "Respiratory Score"].map((score) => (
                  <div
                    key={score}
                    className={`p-3 cursor-pointer hover:bg-gray-50 first:rounded-t-[10px] last:rounded-b-[10px] ${
                      selectedScore === score ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleScoreSelect(score)}
                  >
                    <p className="font-medium text-[15px] text-[#535359] tracking-[-0.04em]">
                      {score}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quality Dropdown */}
          <div className="relative">
            <div
              className="flex gap-[5px] p-[25px] items-center border border-[#C7C6CE] rounded-[10px] cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <p
                className={`font-medium tracking-[-0.02em] ${
                  selectedOption === "Good"
                    ? "text-[#3FAF58]"
                    : selectedOption === "Fair"
                    ? "text-[#f59e0b]"
                    : "text-[#ef4444]"
                }`}
              >
                {selectedOption}
              </p>
              <IoIosArrowDown className="text-[#535359]" />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#C7C6CE] rounded-[10px] shadow-lg z-10">
                {["Good", "Fair", "Poor"].map((option) => (
                  <div
                    key={option}
                    className={`p-3 cursor-pointer hover:bg-gray-50 first:rounded-t-[10px] last:rounded-b-[10px] ${
                      selectedOption === option ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <p
                      className={`font-medium tracking-[-0.02em] ${
                        option === "Good"
                          ? "text-[#3FAF58]"
                          : option === "Fair"
                          ? "text-[#f59e0b]"
                          : "text-[#ef4444]"
                      }`}
                    >
                      {option}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 p-2 flex items-center justify-center border-b border-b-gray-300">
          <div style={{ width: "136px", height: "200px" }}>
            <Bar data={maleData} options={maleOptions} />
          </div>

          <div className="mt-1" style={{ width: "80px", fontSize: "12px" }}>
            {ageGroups.map((age, i) => (
              <div
                className="font-normal text-[12px] tracking-[-0.02em] text-[#53559]"
                key={i}
                style={{
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {age}
              </div>
            ))}
          </div>

          <div style={{ width: "136px", height: "200px" }}>
            <Bar data={femaleData} options={femaleOptions} />
          </div>
        </div>

        <div className="flex items-center justify-center mt-5 gap-10">
          <div className="flex gap-2 items-center">
            <p className="h-5 w-5 bg-[#FF8E6F] rounded-[5px]"></p>
            <p className="font-medium text-[12px] tracking-[-0.02em] text-[#535359]">
              Male ({totalMales})
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="h-5 w-5 bg-[#9100FF] rounded-[5px]"></p>
            <p className="font-medium text-[12px] tracking-[-0.02em] text-[#535359]">
              Female ({totalFemales})
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards (wired to Redux) */}
      <div className="flex gap-[5px] w-full md:bg-[#F5F7FA] rounded-[25px] mt-6 p-4">
        {/* Left card */}
        <div className="hidden md:flex flex-col md:w/full w-2/3 gap-[40px] md:gap-0 justify-between p-4 bg-white rounded-[25px]">
          <p className="text-[#A1A1A1] font-normal text-[12px] tracking-[-0.02em]">
            Last synced {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <div className="flex flex-col">
            <span className="font-normal text-[30px] text-[#252525] tracking-[-0.02em]">
              {statsLoading ? "…" : subjectCount}
            </span>
            <span className="font-normal text-[#252525] text-[15px] tracking-[-0.02em]">
              Patients <br /> Onboarded
            </span>
          </div>
        </div>

        {/* Right card */}
        <div className="hidden md:flex flex-col w-full justify-between p-4 rounded-r-[25px]">
          <p className="text-[#A1A1A1] font-normal text-[12px] tracking-[-0.02em]">
            Last synced {timeAgo}
          </p>

          <p className="w-full h-[10px] bg-white mt-10 mb-4 rounded-[18px]" aria-hidden="true">
            <span
              className="block h-[10px] rounded-l-[18px] transition-[width,background-color] duration-300"
              style={{
                width: `${percent}%`,
                backgroundColor: barColor,
                borderTopRightRadius: percent >= 100 ? "18px" : 0,
                borderBottomRightRadius: percent >= 100 ? "18px" : 0,
              }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label="Tests used percentage"
            />
          </p>

          <div className="flex flex-col items-start">
            <span className="font-normal text-[30px] text-[#252525] tracking-[-0.02em]">
              {statsLoading ? "…/…" : `${testUsed}/${totalTests}`}
            </span>
            <span className="font-normal text-[#252525] text-[15px] tracking-[-0.02em]">
              Total <br /> Test Taken
            </span>
          </div>

          {/* Show error if stats failed */}
          {statsError && (
            <p className="mt-2 text-xs text-red-500">Failed to load totals: {statsError}</p>
          )}
        </div>
      </div>

      {/* Mobile compact card (uses same stats) */}
      <div className="md:hidden w-full justify-between p-2 rounded-[15px] bg-[linear-gradient(90deg,_#99C7FF_0%,_#5FA8FF_100%)]">
        <div className="flex flex-col gap-3 w-[245px] p-3 rounded-[10px] bg-[#E0EEFF]">
          <p className="text-[#A1A1A1] font-normal text-[12px] tracking-[-0.02em]">
            Last synced {timeAgo}
          </p>
          <div className="flex flex-col items-start">
            <span className="font-normal text-[30px] text-[#252525] tracking-[-0.02em]">
              {statsLoading ? "…" : subjectCount}
            </span>
            <span className="font-normal leading-[15px] text-[#252525] text-[15px] tracking-[-0.02em]">
              Employees
            </span>
            <span className="font-normal text-[#252525] text-[15px] tracking-[-0.02em]">
              Onboarded
            </span>
          </div>

          <div className="w-full h-[8px] rounded-[10px] bg-white">
            <div
              className="h-[8px] rounded-[10px]"
              style={{ width: `${percent}%`, backgroundColor: barColor }}
            />
          </div>

          <div className="flex justify-between">
            <p className="font-normal text-[15px] text-[#5B5B5B] tracking-[-0.04em]">
              Used: {statsLoading ? "…" : testUsed}/{statsLoading ? "…" : totalTests}
            </p>
            <Image src="/assets/icons/Vector (11).svg" alt="vector" width={35} height={23} />
          </div>

          {statsError && (
            <p className="mt-1 text-xs text-red-500">Failed to load totals: {statsError}</p>
          )}
        </div>
      </div>
    </>
  );
}