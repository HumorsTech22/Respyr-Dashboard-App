"use client";
import Image from "next/image";
import React from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Gender() {
  const ageGroups = ["18–24 yrs", "25–32 yrs", "33–40 yrs", "40–50 yrs", "50< yrs"];


  const maleData = {
    labels: ageGroups,
    datasets: [
      {
        label: "Male",
        data: [10, 10, 15, 5, 8],
        backgroundColor: "#FF8E6F",

      },
    ],
  };


  const femaleData = {
    labels: ageGroups,
    datasets: [
      {
        label: "Female",
        data: [8, 8, 13, 3, 15],
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
        max: 15,
        reverse: true,
        position: 'top',
        ticks: {
          display: true,
          stepSize: 5
        },
        grid: {
          display: true,
          drawBorder: false,
        },
        border: {
          display: false
        }
      },
      y: {
        ticks: {
          display: false
        },
        grid: {
          display: false,
        },
        border: {
          display: false
        }
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
  };


  const femaleOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 15,
        position: 'top',
        ticks: {
          stepSize: 5,
          display: true
        },
        grid: {
          display: true,
          drawBorder: false,
          borderDash: [1, 4],
          borderDashOffset: 5
        },
        border: {
          display: false
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
          borderDash: [1, 4],
          borderDashOffset: 5
        },
        ticks: {
          display: false
        },
        border: {
          display: false
        }
      },
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };



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


        <div className="flex gap-5 mt-4">
          <div className="flex gap-[5px] p-[25px] items-center border border-[#C7C6CE] rounded-[10px]">
            <p className="font-medium text-[15px] text-[#535359] tracking-[-0.04em] whitespace-nowrap hidden md:block">
              Glucose Metabolism Score
            </p>
            <p className="font-medium text-[15px] text-[#535359] tracking-[-0.04em] whitespace-nowrap md:hidden">
              Respiratory Score
            </p>
            <IoIosArrowDown className="text-[#535359]" />
          </div>

          <div className="flex gap-[5px] p-[25px] items-center border border-[#C7C6CE] rounded-[10px]">
            <p className="text-[#3FAF58] font-medium tracking-[-0.02em]">Good</p>
            <IoIosArrowDown className="text-[#535359]" />
          </div>
        </div>


        <div className="mt-4 p-2 flex items-center justify-center border-b border-b-gray-300">

          <div style={{ width: "136px", height: "200px" }}>   
            <Bar data={maleData} options={maleOptions} />
          </div>


          <div className="mt-1" style={{ width: "80px", fontSize: "12px" }}>
            {ageGroups.map((age, i) => (
              <div className=" font-normal text-[12px] tracking-[-0.02em] text-[#535359] " key={i} style={{ height: "38px", display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }}>
                {age}
              </div>
            ))}
          </div>



          <div style={{ width: "136px", height: "200px" }}>
            <Bar data={femaleData} options={femaleOptions} />
          </div>
        </div>
        <div className="flex  items-center justify-center mt-5 gap-10">
          <div className="flex  gap-2 items-center">
            <p className="h-5 w-5 bg-[#FF8E6F] rounded-[5px]"></p>
            <p className="font-medium text-[12px] tracking-[-0.02em] text-[#535359]">Male</p>
          </div>
          <div className="flex  gap-2 items-center">
            <p className="h-5 w-5 bg-[#9100FF] rounded-[5px]"></p>
            <p className="font-medium text-[12px] tracking-[-0.02em] text-[#535359]">Female</p>
          </div>
        </div>
      </div>


      <div className="flex gap-[5px] w-full  md:bg-[#F5F7FA]  rounded-[25px] mt-6 p-4">

        <div className=" hidden md:flex flex-col md:w-full w-2/3 gap-[40px] md:gap-0 justify-between p-4 bg-white rounded-[25px]">
          <p className="text-[#A1A1A1] font-normal text-[12px] tracking-[-0.02em]">
            Last synced 12 min ago
          </p>
          <div className="flex flex-col ">
            <span className="font-normal text-[30px] text-[#252525] tracking-[-0.02em]">
              75
            </span>
            <span className="font-normal text-[#252525] text-[15px] tracking-[-0.02em]">
              Patients <br /> Onboarded
            </span>
          </div>
        </div>


        <div className=" hidden md:flex flex-col  w-full justify-between p-4 rounded-r-[25px]">
          <p className="text-[#A1A1A1] font-normal text-[12px] tracking-[-0.02em]">
            Last synced 12 min ago
          </p>
          <p className=" w-full h-[10px] bg-white mt-10 mb-4 rounded-[18px]">
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
      <div className="md:hidden  w-full justify-between p-2 rounded-[15px] bg-[linear-gradient(90deg,_#99C7FF_0%,_#5FA8FF_100%)]
">
        <div className="flex flex-col gap-3 w-[245px] p-3 rounded-[10px] bg-[#E0EEFF]">
          <p className="text-[#A1A1A1] font-normal text-[12px] tracking-[-0.02em]">
            Last synced 12 min ago
          </p>

          <div className="flex flex-col items-start">
            <span className="font-normal text-[30px] text-[#252525] tracking-[-0.02em]">
              75
            </span>
            <span className="font-normal leading-[15px]   text-[#252525] text-[15px] tracking-[-0.02em]">
              Employees
            </span>
            <span className="font-normal text-[#252525] text-[15px] tracking-[-0.02em]">
              Onboarded
            </span>
          </div>
          <div className="flex justify-between">
            <p className="font-normal text-[15px] text-[#5B5B5B] tracking-[-0.04em]">Total Employees</p>
            <Image
              src="/assets/icons/Vector (11).svg"
              alt="vector"
              width={35}
              height={23}
            />
          </div>
        </div>
      </div>
    </>
  );
}
