"use client";

import Image from "next/image";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState, useMemo, useRef, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TestAnalytics() {
  const [selectedScoreType, setSelectedScoreType] = useState("sugar_score");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // ✅ Static data instead of API
  const testData = [
    {
      name: "John Doe",
      date_time: "2025-09-25T10:30:00",
      sugar_score: 85,
      liver_score: 72,
      respiratory_score: 90,
      gut_score: 65,
    },
    {
      name: "Alice Smith",
      date_time: "2025-09-26T12:45:00",
      sugar_score: 55,
      liver_score: 62,
      respiratory_score: 58,
      gut_score: 70,
    },
    {
      name: "Michael Johnson",
      date_time: "2025-09-26T15:10:00",
      sugar_score: 95,
      liver_score: 88,
      respiratory_score: 92,
      gut_score: 85,
    },
    {
      name: "Sophia Williams",
      date_time: "2025-09-27T09:15:00",
      sugar_score: 62,
      liver_score: 60,
      respiratory_score: 65,
      gut_score: 58,
    },
    {
      name: "Respyr",
      date_time: "2025-09-27T09:15:00",
      sugar_score: 42,
      liver_score: 30,
      respiratory_score: 25,
      gut_score: 18,
    },

    {
      name: "Humors",
      date_time: "2025-09-27T09:15:00",
      sugar_score: 12,
      liver_score: 70,
      respiratory_score: 25,
      gut_score: 88,
    },
  ];

  // Format date
  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  // Get color
  const getColorForScore = (score) => {
    if (score >= 80) return "#3FAF58"; // Good
    if (score >= 60) return "#FFC412"; // Fair
    return "#EA5455"; // Poor
  };

  // Average score
  const calculateAverageScore = (patient) => {
    const scores = [
      patient.sugar_score,
      patient.liver_score,
      patient.respiratory_score,
      patient.gut_score,
    ];
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return Math.round(sum / scores.length);
  };

  // Chart counts
  const calculateChartData = () => {
    if (!testData.length) return { good: 0, fair: 0, poor: 0 };

    const counts = testData.reduce(
      (acc, item) => {
        const score =
          selectedScoreType === "average"
            ? calculateAverageScore(item)
            : item[selectedScoreType];
        if (score >= 80) acc.good++;
        else if (score >= 60) acc.fair++;
        else acc.poor++;
        return acc;
      },
      { good: 0, fair: 0, poor: 0 }
    );

    return counts;
  };

  const chartCounts = calculateChartData();
  const totalPatients = testData.length;

  // Chart data
  const chartData = {
    datasets: [
      {
        data: [chartCounts.good, chartCounts.fair, chartCounts.poor],
        backgroundColor: ["#3FAF58", "#FFC412", "#EA5455"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      cutout: "60%",
      plugins: {
        legend: { position: "bottom" },
        tooltip: { enabled: false },
        customCenterText: {
          total: totalPatients,
          date: new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            })
            .replace(/\//g, "-"),
        },
      },
    }),
    [totalPatients]
  );

  // Custom plugin
  const customPlugin = {
    id: "customCenterText",
    afterDraw: (chart) => {
      const { width, height, ctx } = chart;
      const { total, date } = chart.options.plugins.customCenterText;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = "14px Arial";
      ctx.fillStyle = "#5B5B5B";
      ctx.fillText(date, width / 2, height / 2 - 30);

      ctx.font = "600 30px Poppins";
      ctx.fillStyle = "#5B5B5B";
      ctx.fillText(`${total}`, width / 2, height / 2);

      ctx.font = "12px Poppins";
      ctx.fillStyle = "#5B5B5B";
      ctx.fillText("patients", width / 2, height / 2 + 20);
      ctx.fillText("taken test", width / 2, height / 2 + 38);

      ctx.restore();
    },
  };

  const scoreTypes = [
    { label: "Sugar Score", value: "sugar_score" },
    { label: "Liver Score", value: "liver_score" },
    { label: "Respiratory Score", value: "respiratory_score" },
    { label: "Gut Score", value: "gut_score" },
    { label: "Average Score", value: "average" },
  ];


  const handleScoreTypeSelect = (value) => {
    setSelectedScoreType(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex lg:flex-row flex-col p-5 border border-[#D9D9D9] rounded-[15px]">
      <div className="flex flex-col mx-auto justify-center md:w-1/3 lg:w-1/2 w-full gap-5">
        <p className="text-[20px] text-[#252525] font-normal tracking-[-0.04em] sm:block hidden">
          Test Analytics
        </p>
        <p className="text-[20px] text-[#252525] font-normal tracking-[-0.04em] sm:hidden block">
          Employees Test Analytics
        </p>

        <div className="flex flex-col justify-center items-center">
          <p className="text-[#535359] mb-2.5 items-center font-normal text-[12px] tracking-[-0.04em]">
            Select score to view analytics
          </p>
          <div ref={dropdownRef} className="relative">
            {/* Trigger */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="cursor-pointer flex items-center gap-[5px] px-10 py-5 border border-[#C7C6CE] rounded-[10px] focus:outline-none"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <span className="font-medium text-[15px] tracking-[-0.02em] text-[#535359]">
                {scoreTypes.find((t) => t.value === selectedScoreType)?.label || "Select Score"}
              </span>
              <IoIosArrowDown className={`text-[#535359] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Menu */}
            {isDropdownOpen && (
              <ul
                role="listbox"
                className="absolute z-50 mt-2 w-full min-w-[200px] max-h-60 overflow-auto rounded-[10px] border border-[#E5E7EB] bg-white shadow-lg"
              >
                {scoreTypes.map(({ label, value }) => {
                  const active = value === selectedScoreType;
                  return (
                    <li
                      key={value}
                      role="option"
                      aria-selected={active}
                      onClick={() => handleScoreTypeSelect(value)}
                      className={`cursor-pointer px-4 py-2 text-[14px] ${active ? "bg-[#E4F0FF] text-[#308BF9] font-medium" : "text-[#535359] hover:bg-[#F3F4F6]"
                        }`}
                    >
                      {label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

  <div className="flex justify-center items-center">
        <div className="relative w-full max-w-[min(100%,325px)] aspect-square">
          <Doughnut
            data={chartData}
            options={chartOptions}
            plugins={[customPlugin]}
            style={{ padding: "40px" }}
          />
          <div className="absolute top-[40%] left-[7%] text-[#535359] font-semibold text-[15px]  flex items-center justify-center w-[50px] h-[50px] bg-white rounded-full shadow-[0px_4px_22.7px_0px_#00000026]">
            12
          </div>
          <div className="absolute top-[40%] right-[7%]  text-[#535359] font-semibold text-[15px]  flex items-center justify-center w-[50px] h-[50px] bg-white rounded-full shadow-[0px_4px_22.7px_0px_#00000026]">
            12
          </div>
          
        </div>
      </div>
      </div>

      <div className="lg:w-1/2 md:w-2/3 w-full lg:border-l border-l-[#D9D9D9] flex flex-col gap-[42px] md:p-5">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <span className="w-[15px] h-[15px] rounded-[13px] bg-[#3FAF58]"></span>
            <p className="text-[#535359] font-medium text-[12px] tracking-[-0.02em]">
              Good
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <span className="w-[15px] h-[15px] rounded-[13px] bg-[#FFC412]"></span>
            <p className="text-[#535359] font-medium text-[12px] tracking-[-0.02em]">
              Fair
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <span className="w-[15px] h-[15px] rounded-[13px] bg-[#EA5455]"></span>
            <p className="text-[#535359] font-medium text-[12px] tracking-[-0.02em]">
              Poor
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <p className="font-normal text-[15px] text-[#252525] tracking-[-0.04em]">
            Test log
          </p>
          <p className="flex items-center font-normal text-[15px] text-[#308BF9] tracking-[-0.04em] cursor-pointer">
            See All
            <IoIosArrowForward className="text-[#308BF9]" />
          </p>
        </div>

        <div className="flex flex-col gap-[25px]">
          <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
            {testData.map((log, index) => (
              <div
                key={index}
                className="flex gap-5 items-center justify-between mb-[25px] cursor-pointer"
              >
                <div className=" flex items-center gap-5">
                  <Image
                    src="/assets/img/Group 2216.svg"
                    width={40}
                    height={40}
                    alt="User avatar"
                  />
                  <div className="flex flex-col">
                    <p className="text-[#535359] text-[15px] font-semibold tracking-[-0.02em]">
                      {log.name}
                    </p>
                    <p className="text-[#5B5B5B] text-[12px] font-normal tracking-[-0.02em]">
                      {formatDate(log.date_time)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-[5px] items-center">
                  <span
                    className="w-[15px] h-[15px] rounded-[13px]"
                    style={{
                      backgroundColor: getColorForScore(
                        selectedScoreType === "average"
                          ? calculateAverageScore(log)
                          : log[selectedScoreType]
                      ),
                    }}
                  ></span>
                  <p className="text-[#535359] font-medium text-[15px] tracking-[-0.02em]">
                    {calculateAverageScore(log)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}