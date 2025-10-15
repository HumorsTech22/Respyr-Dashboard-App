// "use client";

// import Image from "next/image";
// import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { useState, useMemo, useRef, useEffect } from "react";
// import Link from "next/link";
// import { useSelector } from "react-redux";

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function TestAnalytics() {
//   const [selectedScoreType, setSelectedScoreType] = useState("sugar_score");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

// const datewiseData = useSelector((state) => state.datewise.data);
// console.log("datewiseData18:-", datewiseData);
// const isDatewiseLoading = useSelector((state) => state.datewise.loading);
// console.log("isDatewiseLoading20:-", isDatewiseLoading);
// const datewiseError = useSelector((state) => state.datewise.error);
// console.log("datewiseError22:-", datewiseError);


//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // ✅ Static data instead of API
//   const testData = [
//     {
//       name: "John Doe",
//       date_time: "2025-09-25T10:30:00",
//       sugar_score: 85,
//       liver_score: 72,
//       respiratory_score: 90,
//       gut_score: 65,
//     },
//     {
//       name: "Alice Smith",
//       date_time: "2025-09-26T12:45:00",
//       sugar_score: 55,
//       liver_score: 62,
//       respiratory_score: 58,
//       gut_score: 70,
//     },
//     {
//       name: "Michael Johnson",
//       date_time: "2025-09-26T15:10:00",
//       sugar_score: 95,
//       liver_score: 88,
//       respiratory_score: 92,
//       gut_score: 85,
//     },
//     {
//       name: "Sophia Williams",
//       date_time: "2025-09-27T09:15:00",
//       sugar_score: 62,
//       liver_score: 60,
//       respiratory_score: 65,
//       gut_score: 58,
//     },
//     {
//       name: "Respyr",
//       date_time: "2025-09-27T09:15:00",
//       sugar_score: 42,
//       liver_score: 30,
//       respiratory_score: 25,
//       gut_score: 18,
//     },
//     {
//       name: "Humors",
//       date_time: "2025-09-27T09:15:00",
//       sugar_score: 12,
//       liver_score: 70,
//       respiratory_score: 25,
//       gut_score: 88,
//     },
//   ];

//   // Format date
//   const formatDate = (dateTime) => {
//     const date = new Date(dateTime);
//     const options = {
//       month: "short",
//       day: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     };
//     return date.toLocaleString("en-US", options);
//   };

//   // Get color
//   const getColorForScore = (score) => {
//     if (score >= 80) return "#3FAF58"; // Good
//     if (score >= 60) return "#FFC412"; // Fair
//     return "#EA5455"; // Poor
//   };

//   // Average score
//   const calculateAverageScore = (patient) => {
//     const scores = [
//       patient.sugar_score,
//       patient.liver_score,
//       patient.respiratory_score,
//       patient.gut_score,
//     ];
//     const sum = scores.reduce((acc, score) => acc + score, 0);
//     return Math.round(sum / scores.length);
//   };

//   // Chart counts
//   const calculateChartData = () => {
//     if (!testData.length) return { good: 0, fair: 0, poor: 0 };

//     const counts = testData.reduce(
//       (acc, item) => {
//         const score =
//           selectedScoreType === "average"
//             ? calculateAverageScore(item)
//             : item[selectedScoreType];
//         if (score >= 80) acc.good++;
//         else if (score >= 60) acc.fair++;
//         else acc.poor++;
//         return acc;
//       },
//       { good: 0, fair: 0, poor: 0 }
//     );

//     return counts;
//   };

//   const chartCounts = calculateChartData();
//   const totalPatients = testData.length;

//   // Calculate badge positions on the outer edge of the doughnut
//   const getBadgePositions = () => {
//     const total = chartCounts.good + chartCounts.fair + chartCounts.poor;
//     if (total === 0) {
//       return {
//         good: { left: "50%", top: "10%" },
//         fair: { left: "90%", top: "75%" },
//         poor: { left: "50%", top: "90%" }
//       };
//     }

//     // Calculate angles for each segment
//     const goodPercentage = chartCounts.good / total;
//     const fairPercentage = chartCounts.fair / total;
//     const poorPercentage = chartCounts.poor / total;

//     // Start angle (starting from top -90 degrees)
//     const startAngle = -90;

//     // Calculate middle points of each segment (in degrees)
//     const goodMiddle = startAngle + (goodPercentage * 360) / 2;
//     const fairMiddle = startAngle + goodPercentage * 360 + (fairPercentage * 360) / 2;
//     const poorMiddle = startAngle + goodPercentage * 360 + fairPercentage * 360 + (poorPercentage * 360) / 2;

//     // Convert angles to positions on the outer edge (85% from center)
//     const radius = 35;
//     const goodPosition = getPositionOnCircle(goodMiddle, radius);
//     const fairPosition = getPositionOnCircle(fairMiddle, radius);
//     const poorPosition = getPositionOnCircle(poorMiddle, radius);

//     return {
//       good: goodPosition,
//       fair: fairPosition,
//       poor: poorPosition,
//     };
//   };

//   const getPositionOnCircle = (angle, radius) => {
//     const rad = (angle * Math.PI) / 180;
//     const x = 50 + radius * Math.cos(rad);
//     const y = 50 + radius * Math.sin(rad);
//     return { left: `${x}%`, top: `${y}%` };
//   };

//   const badgePositions = getBadgePositions();

//   // Chart data
//   const chartData = {
//     datasets: [
//       {
//         data: [chartCounts.good, chartCounts.fair, chartCounts.poor],
//         backgroundColor: ["#3FAF58", "#FFC412", "#EA5455"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Chart options
//   const chartOptions = useMemo(
//     () => ({
//       responsive: true,
//       cutout: "60%",
//       plugins: {
//         legend: { position: "bottom" },
//         tooltip: { enabled: false },
//         customCenterText: {
//           total: totalPatients,
//           date: new Date()
//             .toLocaleDateString("en-GB", {
//               day: "2-digit",
//               month: "short",
//               year: "2-digit",
//             })
//             .replace(/\//g, "-"),
//         },
//       },
//     }),
//     [totalPatients]
//   );

//   // Custom plugin
//   const customPlugin = {
//     id: "customCenterText",
//     afterDraw: (chart) => {
//       const { width, height, ctx } = chart;
//       const { total, date } = chart.options.plugins.customCenterText;

//       ctx.save();
//       ctx.textAlign = "center";
//       ctx.textBaseline = "middle";

//       ctx.font = "14px Arial";
//       ctx.fillStyle = "#5B5B5B";
//       ctx.fillText(date, width / 2, height / 2 - 30);

//       ctx.font = "600 30px Poppins";
//       ctx.fillStyle = "#5B5B5B";
//       ctx.fillText(`${total}`, width / 2, height / 2);

//       ctx.font = "12px Poppins";
//       ctx.fillStyle = "#5B5B5B";
//       ctx.fillText("patients", width / 2, height / 2 + 20);
//       ctx.fillText("taken test", width / 2, height / 2 + 38);

//       ctx.restore();
//     },
//   };

//   const scoreTypes = [
//     { label: "Sugar Score", value: "sugar_score" },
//     { label: "Liver Score", value: "liver_score" },
//     { label: "Respiratory Score", value: "respiratory_score" },
//     { label: "Gut Score", value: "gut_score" },
//   ];

//   const handleScoreTypeSelect = (value) => {
//     setSelectedScoreType(value);
//     setIsDropdownOpen(false);
//   };

//   return (
//     <div className="flex lg:flex-row flex-col p-5 border border-[#D9D9D9] rounded-[15px]">
//       <div className="flex flex-col mx-auto justify-center md:w-1/3 lg:w-1/2 w-full gap-5">
//         <p className="text-[20px] text-[#252525] font-normal tracking-[-0.04em] sm:block hidden">
//           Test Analytics
//         </p>
//         <p className="text-[20px] text-[#252525] font-normal tracking-[-0.04em] sm:hidden block">
//           Employees Test Analytics
//         </p>

//         <div className="flex flex-col justify-center items-center">
//           <p className="text-[#535359] mb-2.5 items-center font-normal text-[12px] tracking-[-0.04em]">
//             Select score to view analytics
//           </p>
//           <div ref={dropdownRef} className="relative">
//             {/* Trigger */}
//             <button
//               type="button"
//               onClick={() => setIsDropdownOpen((v) => !v)}
//               className="cursor-pointer flex items-center gap-[5px] px-10 py-5 border border-[#C7C6CE] rounded-[10px] focus:outline-none"
//               aria-haspopup="listbox"
//               aria-expanded={isDropdownOpen}
//             >
//               <span className="font-medium text-[15px] tracking-[-0.02em] text-[#535359]">
//                 {scoreTypes.find((t) => t.value === selectedScoreType)?.label || "Select Score"}
//               </span>
//               <IoIosArrowDown className={`text-[#535359] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
//             </button>

//             {/* Menu */}
//             {isDropdownOpen && (
//               <ul
//                 role="listbox"
//                 className="absolute z-50 mt-2 w-full min-w-[200px] max-h-60 overflow-auto rounded-[10px] border border-[#E5E7EB] bg-white shadow-lg"
//               >
//                 {scoreTypes.map(({ label, value }) => {
//                   const active = value === selectedScoreType;
//                   return (
//                     <li
//                       key={value}
//                       role="option"
//                       aria-selected={active}
//                       onClick={() => handleScoreTypeSelect(value)}
//                       className={`cursor-pointer px-4 py-2 text-[14px] ${active ? "bg-[#E4F0FF] text-[#308BF9] font-medium" : "text-[#535359] hover:bg-[#F3F4F6]"
//                         }`}
//                     >
//                       {label}
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>
//         </div>

//         <div className="flex justify-center items-center">
//           <div className="relative w-full max-w-[min(100%,325px)] aspect-square">
//             <Doughnut
//               data={chartData}
//               options={chartOptions}
//               plugins={[customPlugin]}
//               style={{ padding: "40px" }}
//             />

//             {/* Good Count Badge */}
//             <div
//               className="absolute text-[#535359] font-semibold text-[15px] flex items-center justify-center w-[50px] h-[50px] bg-white rounded-full shadow-[0px_4px_22.7px_0px_#00000026] transform -translate-x-1/2 -translate-y-1/2"
//               style={{
//                 border: `2px solid #3FAF58`,
//                 left: badgePositions.good.left,
//                 top: badgePositions.good.top
//               }}
//             >
//               {chartCounts.good}
//             </div> 

//             {/* Fair Count Badge */}
//            <div
//               className="absolute text-[#535359] font-semibold text-[15px] flex items-center justify-center w-[50px] h-[50px] bg-white rounded-full shadow-[0px_4px_22.7px_0px_#00000026] transform -translate-x-1/2 -translate-y-1/2"
//               style={{
//                 border: `2px solid #FFC412`,
//                 left: badgePositions.fair.left,
//                 top: badgePositions.fair.top
//               }}
//             >
//               {chartCounts.fair}
//             </div> 

//             {/* Poor Count Badge */}
//           <div
//               className="absolute text-[#535359] font-semibold text-[15px] flex items-center justify-center w-[50px] h-[50px] bg-white rounded-full shadow-[0px_4px_22.7px_0px_#00000026] transform -translate-x-1/2 -translate-y-1/2"
//               style={{
//                 border: `2px solid #EA5455`,
//                 left: badgePositions.poor.left,
//                 top: badgePositions.poor.top
//               }}
//             >
//               {chartCounts.poor}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="lg:w-1/2 md:w-2/3 w-full lg:border-l border-l-[#D9D9D9] flex flex-col gap-[42px] md:p-5">
//         <div className="flex justify-between">
//           <div className="flex gap-2 items-center">
//             <span className="w-[15px] h-[15px] rounded-[13px] bg-[#3FAF58]"></span>
//             <p className="text-[#535359] font-medium text-[12px] tracking-[-0.02em]">
//               Good
//             </p>
//           </div>

//           <div className="flex gap-2 items-center">
//             <span className="w-[15px] h-[15px] rounded-[13px] bg-[#FFC412]"></span>
//             <p className="text-[#535359] font-medium text-[12px] tracking-[-0.02em]">
//               Fair
//             </p>
//           </div>

//           <div className="flex gap-2 items-center">
//             <span className="w-[15px] h-[15px] rounded-[13px] bg-[#EA5455]"></span>
//             <p className="text-[#535359] font-medium text-[12px] tracking-[-0.02em]">
//               Poor
//             </p>
//           </div>
//         </div>

//         <div className="flex justify-between">
//           <p className="font-normal text-[15px] text-[#252525] tracking-[-0.04em]">
//             Test log
//           </p>
//           <Link 
//           href="/testhistory"
//           className="flex items-center font-normal text-[15px] text-[#308BF9] tracking-[-0.04em] cursor-pointer">
//             See All
//             <IoIosArrowForward className="text-[#308BF9]" />
//           </Link>
//         </div>

//         <div className="flex flex-col gap-[25px]">
//           <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
//             {testData.map((log, index) => (
//               <Link
//                 href="/subjectprofile"
//                 key={index}
//                 className="flex gap-5 items-center justify-between mb-[25px] cursor-pointer"
//               >
//                 <div className=" flex items-center gap-5">
//                   <Image
//                     src="/assets/img/Group 2216.svg"
//                     width={40}
//                     height={40}
//                     alt="User avatar"
//                   />
//                   <div className="flex flex-col">
//                     <p className="text-[#535359] text-[15px] font-semibold tracking-[-0.02em]">
//                       {log.name}
//                     </p>
//                     <p className="text-[#5B5B5B] text-[12px] font-normal tracking-[-0.02em]">
//                       {formatDate(log.date_time)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex gap-[5px] items-center">
//                   <span
//                     className="w-[15px] h-[15px] rounded-[13px]"
//                     style={{
//                       backgroundColor: getColorForScore(
//                         selectedScoreType === "average"
//                           ? calculateAverageScore(log)
//                           : log[selectedScoreType]
//                       ),
//                     }}
//                   ></span>
//                   <p className="text-[#535359] font-medium text-[15px] tracking-[-0.02em]">
//                     {selectedScoreType === "average"
//                       ? calculateAverageScore(log)
//                       : log[selectedScoreType]
//                     }%
//                   </p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

















"use client";

import Image from "next/image";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TestAnalytics() { 
  const [selectedScoreType, setSelectedScoreType] = useState("sugar_score");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const datewiseData = useSelector((state) => state.datewise.data);
  const isDatewiseLoading = useSelector((state) => state.datewise.loading);
  const datewiseError = useSelector((state) => state.datewise.error);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

// === MAPPED DATA FROM API ===
const testData = useMemo(() => {
  const rows = datewiseData?.data || [];
  return rows.map(({ personal = {}, record = {} }) => {
    let respScore = null,
      fev1 = null,
      fvc = null;
    try {
      const r = JSON.parse(record.respiratory_fvc_json || "{}");
      respScore =
        typeof r?.["Respiratory Score(%)"]?.["Respiratory Score(%)"] ===
          "number"
          ? Math.round(r["Respiratory Score(%)"]["Respiratory Score(%)"])
          : null;
      fev1 = r?.["Respyr_Measured"]?.["FEV1(L)"] ?? null;
      fvc = r?.["Respyr_Measured"]?.["FVC(L)"] ?? null;
    } catch (_e) { }

    return {
      name: personal?.name ?? "-",
      date_time: personal?.subject_dttm ?? "",
      sugar_score: Number(record?.Db_Score ?? 0),
      liver_score: Number(record?.liver_score ?? 0),
      gut_score: Number(record?.Gut_Score_per ?? 0),
      respiratory_score: respScore ?? 0,
      fev1,
      fvc,
      // Add the biomarker values
      acetone_ppm: record?.acetone_ppm ? Number(record.acetone_ppm) : null,
      ethanol_ppm: record?.ethnol_ppm ? Number(record.ethnol_ppm) : null,
      hydrogen_ppm: record?.h2_ppm ? Number(record.h2_ppm) : null,
      // ADD THESE FIELDS for navigation
      login_id: personal?.login_id || record?.login_id,
      profile_id: personal?.profile_id || record?.profile_id,
    };
  });
}, [datewiseData]);

  console.log("testData505:-", testData);

  // Format date
  const formatDate = (dateTime) => {
    if (!dateTime) return "-";
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
    if (score >= 80) return "#3FAF58";
    if (score >= 60) return "#FFC412";
    return "#EA5455";
  };

  const calculateAverageScore = (patient) => {
    const scores = [
      Number(patient.sugar_score || 0),
      Number(patient.liver_score || 0),
      Number(patient.respiratory_score || 0),
      Number(patient.gut_score || 0),
    ];
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / scores.length);
  };

  const calculateChartData = () => {
    if (!testData.length) return { good: 0, fair: 0, poor: 0 };
    return testData.reduce(
      (acc, item) => {
        const score =
          selectedScoreType === "average"
            ? calculateAverageScore(item)
            : Number(item[selectedScoreType] || 0);
        if (score >= 80) acc.good++;
        else if (score >= 60) acc.fair++;
        else acc.poor++;
        return acc;
      },
      { good: 0, fair: 0, poor: 0 }
    );
  };

  const chartCounts = calculateChartData();
  console.log("chartCounts589:-", chartCounts);
  const totalPatients = testData.length;

  const getPositionOnCircle = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    const x = 50 + radius * Math.cos(rad);
    const y = 50 + radius * Math.sin(rad);
    return { left: `${x}%`, top: `${y}%` };
  };

  const getBadgePositions = () => {
    const total = chartCounts.good + chartCounts.fair + chartCounts.poor;
    if (total === 0) {
      return {
        good: { left: "50%", top: "10%" },
        fair: { left: "90%", top: "75%" },
        poor: { left: "50%", top: "90%" },
      };
    }
    const goodPct = chartCounts.good / total;
    const fairPct = chartCounts.fair / total;
    const poorPct = chartCounts.poor / total;
    const start = -90;
    const goodMid = start + (goodPct * 360) / 2;
    const fairMid = start + goodPct * 360 + (fairPct * 360) / 2;
    const poorMid =
      start + goodPct * 360 + fairPct * 360 + (poorPct * 360) / 2;
    const radius = 35;
    return {
      good: getPositionOnCircle(goodMid, radius),
      fair: getPositionOnCircle(fairMid, radius),
      poor: getPositionOnCircle(poorMid, radius),
    };
  };

  const badgePositions = getBadgePositions();

  const chartData = {
    datasets: [
      {
        data: [chartCounts.good, chartCounts.fair, chartCounts.poor],
        backgroundColor: ["#3FAF58", "#FFC412", "#EA5455"],
        borderWidth: 1,
      },
    ],
  };

  // const chartOptions = useMemo(
  //   () => ({
  //     responsive: true,
  //     cutout: "60%",
  //     plugins: {
  //       legend: { position: "bottom" },
  //       tooltip: { enabled: false },
  //       customCenterText: {
  //         total: totalPatients,
  //         date: new Date()
  //           .toLocaleDateString("en-GB", {
  //             day: "2-digit",
  //             month: "short",
  //             year: "2-digit",
  //           })
  //           .replace(/\//g, "-"),
  //       },
  //     },
  //   }),
  //   [totalPatients]
  // );


  const chartOptions = useMemo(
  () => ({
    responsive: true,
    cutout: "60%",
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: false },
      customCenterText: {
        total: totalPatients,
        date: datewiseData?.date 
          ? new Date(datewiseData.date.replace(/\//g, '-'))
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })
          : new Date()
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })
              .replace(/\//g, "-"),
      },
    },
  }),
  [totalPatients, datewiseData?.date] 
);

  
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
      ctx.fillText(`${total}`, width / 2, height / 2);
      ctx.font = "12px Poppins";
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
  ];

  const handleScoreTypeSelect = (value) => {
    setSelectedScoreType(value);
    setIsDropdownOpen(false);
  };

  // Function to get biomarker value and label based on selected score type
  const getBiomarkerInfo = (log) => {
    switch (selectedScoreType) {
      case "sugar_score":
        return {
          label: "Acetone",
          value: log.acetone_ppm,
          unit: "ppm"
        };
      case "liver_score":
        return {
          label: "Ethanol",
          value: log.ethanol_ppm,
          unit: "ppm"
        };
      case "gut_score":
        return {
          label: "H2",
          value: log.hydrogen_ppm,
          unit: "ppm"
        };
      case "respiratory_score":
        return {
          label: "Lung Function",
          value: null, 
          unit: ""
        };
      default:
        return {
          label: "",
          value: null,
          unit: ""
        };
    }
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

        {/* Dropdown */}
        <div className="flex flex-col justify-center items-center">
          <p className="text-[#535359] mb-2.5 text-[12px]">Select score to view analytics</p>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="cursor-pointer flex items-center gap-[5px] px-10 py-5 border border-[#C7C6CE] rounded-[10px]"
            >
              <span className="font-medium text-[15px] text-[#535359]">
                {scoreTypes.find((t) => t.value === selectedScoreType)?.label}
              </span>
              <IoIosArrowDown
                className={`text-[#535359] transition-transform ${isDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isDropdownOpen && (
              <ul className="absolute z-50 mt-2 w-full min-w-[200px] max-h-60 overflow-auto rounded-[10px] border border-[#E5E7EB] bg-white shadow-lg">
                {scoreTypes.map(({ label, value }) => {
                  const active = value === selectedScoreType;
                  return (
                    <li
                      key={value}
                      onClick={() => handleScoreTypeSelect(value)}
                      className={`cursor-pointer px-4 py-2 text-[14px] ${active
                          ? "bg-[#E4F0FF] text-[#308BF9] font-medium"
                          : "text-[#535359] hover:bg-[#F3F4F6]"
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

        {/* Chart */}
        <div className="flex justify-center items-center">
          <div className="relative w-full max-w-[min(100%,325px)] aspect-square">
            {totalPatients === 0 ? (
              <div className="flex flex-col items-center justify-center w-full h-full text-center">
                <div className="text-[#252525] text-[18px] font-medium mb-2">
                  No Data Found
                </div>
              </div>
            ) : (
              <>
                <Doughnut
                  data={chartData}
                  options={chartOptions}
                  plugins={[customPlugin]}
                  style={{ padding: "40px" }}
                />

                {/* Badges */}

                {["good", "fair", "poor"].map((key) => (
  chartCounts[key] > 0 && (
    <div
      key={key}
      className="absolute text-[#535359] font-semibold text-[15px] flex items-center justify-center w-[50px] h-[50px] bg-white rounded-full shadow-[0px_4px_22.7px_0px_#00000026] transform -translate-x-1/2 -translate-y-1/2"
      style={{
        border: `2px solid ${
          key === "good"
            ? "#3FAF58"
            : key === "fair"
            ? "#FFC412"
            : "#EA5455"
        }`,
        left: badgePositions[key].left,
        top: badgePositions[key].top,
      }}
    >
      {chartCounts[key]}
    </div>
  )
))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="lg:w-1/2 md:w-2/3 w-full lg:border-l border-l-[#D9D9D9] flex flex-col gap-[42px] md:p-5">
        <div className="flex justify-between">
          <p className="font-normal text-[18px] text-[#252525]">Test log</p>
          <Link
            href="/testhistory"
            className="flex items-center text-[#308BF9] text-[15px]"
          >
            See All <IoIosArrowForward className="text-[#308BF9]" />
          </Link>
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {isDatewiseLoading ? (
            <p className="text-center text-[#252525] text-[18px]">Loading...</p>
          ) : testData.length === 0 ? (
            <p className="text-center text-[#252525] text-[18px]">No Data Found</p>
          ) : (
            testData.map((log, index) => {
              const biomarker = getBiomarkerInfo(log);

              return (
              
                <Link
  href={{
    pathname: "/subjectprofile",
    query: {
      subject_id: log.profile_id,
      clinic_id: log.login_id
    }
  }}
  key={index}
  className="flex gap-5 items-center justify-between mb-[25px] cursor-pointer"
>
  <div className="flex items-center gap-5">
    <Image
      src="/assets/img/Group 2216.svg"
      width={40}
      height={40}
      alt="User avatar"
    />
    <div className="flex flex-col">
      <p className="text-[#535359] text-[15px] font-semibold">
        {log.name}
      </p>
      <p className="text-[#5B5B5B] text-[12px]">
        {formatDate(log.date_time)}
      </p>
    </div>
  </div>

  <div className="flex flex-col items-end gap-1">
    {/* Score section */}
    <div className="flex gap-[5px] items-center">
      <span
        className="w-[15px] h-[15px] rounded-[13px]"
        style={{
          backgroundColor: getColorForScore(
            selectedScoreType === "average"
              ? calculateAverageScore(log)
              : Number(log[selectedScoreType] || 0)
          ),
        }}
      ></span>
      <p className="text-[#535359] font-medium text-[15px]">
        {selectedScoreType === "average"
          ? calculateAverageScore(log)
          : Number(log[selectedScoreType] || 0)}
        %
      </p>
    </div>

    {/* Biomarker values and FEV1/FVC - NOW AT THE BOTTOM */}
    {/* Show biomarker value for sugar, liver, and gut scores */}
    {["sugar_score", "liver_score", "gut_score"].includes(selectedScoreType) &&
      biomarker.value != null && (
        <p className="text-[#5B5B5B] text-[12px]">
          {`${biomarker.label}: ${biomarker.value.toFixed(2)} ${biomarker.unit}`}
        </p>
      )}

    {/* Show FEV1/FVC for respiratory score */}
    {selectedScoreType === "respiratory_score" &&
      (log.fev1 != null || log.fvc != null) && (
        <p className="text-[#5B5B5B] text-[12px]">
          {`FEV1: ${log.fev1 ?? "-"} L  •  FVC: ${log.fvc ?? "-"} L`}
        </p>
      )}
  </div>
</Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}