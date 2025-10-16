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
import { useSelector } from "react-redux";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Gender() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScoreDropdownOpen, setIsScoreDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Good");
  const [selectedScore, setSelectedScore] = useState("Sugar Score");

  // Get datewise data from Redux store
  const datewiseData = useSelector((state) => state.datewise.data);
  const isDatewiseLoading = useSelector((state) => state.datewise.loading);
  const datewiseError = useSelector((state) => state.datewise.error);

  // Optional: if you store lastUpdated in Redux slice, we’ll read it
  const lastUpdatedRedux = useSelector((s) => s?.datewise?.lastUpdated);

  // --- Last synced: dynamic "x min ago" ---
  const [lastSyncedAt, setLastSyncedAt] = useState(lastUpdatedRedux || null);

  useEffect(() => {
    if (lastUpdatedRedux) setLastSyncedAt(lastUpdatedRedux);
  }, [lastUpdatedRedux]);

  // Fallback: treat any datewise data change as a sync moment
  useEffect(() => {
    if (datewiseData) setLastSyncedAt(Date.now());
  }, [datewiseData]);

  // Tick every minute so label updates live
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
  // --- End Last synced helper ---

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

  // Function to get score value based on selected score type
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

  // Function to categorize score into Good, Fair, Poor
  const getScoreCategory = (score) => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    return "Poor";
  };

  // Process gender and age data from Redux based on selected score and category
  const { maleCounts, femaleCounts, totalPatients } = useMemo(() => {
    if (!datewiseData?.data) {
      return { maleCounts: [0, 0, 0, 0, 0], femaleCounts: [0, 0, 0, 0, 0], totalPatients: 0 };
    }

    const maleCounts = [0, 0, 0, 0, 0]; // For each age group
    const femaleCounts = [0, 0, 0, 0, 0]; // For each age group
    let totalPatients = 0;

    datewiseData.data.forEach(({ personal, record }) => {
      if (personal?.gender && personal?.age && record) {
        const scoreValue = getScoreValue(record, selectedScore);
        const scoreCategory = getScoreCategory(scoreValue);

        // Only count if the score category matches the selected option
        if (scoreCategory === selectedOption) {
          const age = parseInt(personal.age);
          const gender = personal.gender.toLowerCase();

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

  // Calculate max value for chart scaling
  const maxChartValue = useMemo(() => {
    const allValues = [...maleCounts, ...femaleCounts];
    const max = Math.max(...allValues);
    return max === 0 ? 10 : Math.ceil(max / 5) * 5 + 5; // Round up to nearest 5 plus buffer
  }, [maleCounts, femaleCounts]);

  const maleData = {
    labels: ageGroups,
    datasets: [
      {
        label: "Male",
        data: maleCounts,
        backgroundColor: "#FF8E6F",
      },
    ],
  };

  const femaleData = {
    labels: ageGroups,
    datasets: [
      {
        label: "Female",
        data: femaleCounts,
        backgroundColor: "#9100FF",
      },
    ],
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
        ticks: {
          display: true,
          stepSize: Math.ceil(maxChartValue / 5),
          callback: function (value) {
            return value;
          },
        },
        grid: {
          display: true,
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `Male: ${context.parsed.x}`;
          },
        },
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
        ticks: {
          stepSize: Math.ceil(maxChartValue / 5),
          display: true,
          callback: function (value) {
            return value;
          },
        },
        grid: {
          display: true,
          drawBorder: false,
          borderDash: [1, 4],
          borderDashOffset: 5,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
          borderDash: [1, 4],
          borderDashOffset: 5,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `Female: ${context.parsed.x}`;
          },
        },
      },
    },
  };

  // Calculate totals
  const totalMales = maleCounts.reduce((sum, count) => sum + count, 0);
  const totalFemales = femaleCounts.reduce((sum, count) => sum + count, 0);

  // Loading
  if (isDatewiseLoading) {
    return (
      <div className="w-full rounded-[15px] p-5 border border-[#D9D9D9]">
        <div className="flex justify-center items-center h-40">
          <p className="text-[#535359]">Loading gender analytics...</p>
        </div>
      </div>
    );
  }

  // Error
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

            {/* Score Dropdown Menu */}
            {isScoreDropdownOpen && (
              <div className="absolute whitespace-nowrap top-full left-0 right-0 mt-1 bg-white border border-[#C7C6CE] rounded-[10px] shadow-lg z-20 min-w-[226px]">
                {scoreOptions.map((score) => (
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

          {/* Quality Dropdown (Good, Fair, Poor) */}
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

            {/* Quality Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#C7C6CE] rounded-[10px] shadow-lg z-10">
                {options.map((option) => (
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

      {/* Rest of your existing code remains the same */}
      <div className="flex gap-[5px] w-full md:bg-[#F5F7FA] rounded-[25px] mt-6 p-4">
        <div className="hidden md:flex flex-col md:w-full w-2/3 gap-[40px] md:gap-0 justify-between p-4 bg-white rounded-[25px]">
          <p className="text-[#A1A1A1] font-normal text-[12px] tracking-[-0.02em]">
            Last synced {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <div className="flex flex-col">
            <span className="font-normal text-[30px] text-[#252525] tracking-[-0.02em]">75</span>
            <span className="font-normal text-[#252525] text-[15px] tracking-[-0.02em]">
              Patients <br /> Onboarded
            </span>
          </div>
        </div>

        <div className="hidden md:flex flex-col w-full justify-between p-4 rounded-r-[25px]">
          <p className="text-[#A1A1A1] font-normal text-[12px] tracking-[-0.02em]">
            {/* ← replaced only the inner text */}
            Last synced {timeAgo}
          </p>
          <p className="w-full h-[10px] bg-white mt-10 mb-4 rounded-[18px]">
            <span className="block w-2/3 rounded-l-[18px] h-[10px] bg-[#3FAF58]"> </span>
          </p>
          <div className="flex flex-col items-start">
            <span className="font-normal text-[30px] text-[#252525] tracking-[-0.02em]">
              750/1000
            </span>
            <span className="font-normal text-[#252525] text-[15px] tracking-[-0.02em]">
              Total <br /> Test Taken
            </span>
          </div>
        </div>
      </div>

      <div className="md:hidden w-full justify-between p-2 rounded-[15px] bg-[linear-gradient(90deg,_#99C7FF_0%,_#5FA8FF_100%)]">
        <div className="flex flex-col gap-3 w-[245px] p-3 rounded-[10px] bg-[#E0EEFF]">
          <p className="text-[#A1A1A1] font-normal text-[12px] tracking-[-0.02em]">
            {/* ← replaced only the inner text */}
            Last synced {timeAgo}
          </p>
          <div className="flex flex-col items-start">
            <span className="font-normal text-[30px] text-[#252525] tracking-[-0.02em]">75</span>
            <span className="font-normal leading-[15px] text-[#252525] text-[15px] tracking-[-0.02em]">
              Employees
            </span>
            <span className="font-normal text-[#252525] text-[15px] tracking-[-0.02em]">
              Onboarded
            </span>
          </div>
          <div className="flex justify-between">
            <p className="font-normal text-[15px] text-[#5B5B5B] tracking-[-0.04em]">Total Employees</p>
            <Image src="/assets/icons/Vector (11).svg" alt="vector" width={35} height={23} />
          </div>
        </div>
      </div>
    </>
  );
}
