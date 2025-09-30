"use client"; 
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
import { IoIosArrowDown } from "react-icons/io";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TestTaken() {
  // Chart data
  const data = {
    labels: ["1 May", "2 May", "3 May", "4 May", "5 May", "6 May"],
    datasets: [
      {
        label: "",
        data: [25, 60, 50, 30, 50, 55],
        backgroundColor: [
          "#CAE1FF",
          "#CAE1FF",
          "#CAE1FF",
          "#CAE1FF",
          "#CAE1FF",
          "#308BF9"
        ],
      
      },
    ],
  };



  const options = {
    responsive: true,
      
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        min: 0,
        max: 60,
        grid: {
          display: false,
          drawBorder: false,
        },
        border: {
          display: false, 
        },
        title: {
          display: true,
          text: "Number of tests",
          font: {
            size: 12,
            weight: "normal",
          },
          color: "#A1A1A1",
        },
        ticks: {
          autoSkip: false,
          stepSize: 10,
          callback: function (value) {
            const customTicks = [0, 20, 30, 50, 60];
            return customTicks.includes(value) ? value : "";
          },
        },
      },
    },
  };
  

  return (
    <div className="flex md:flex-row  items-center  flex-col w-full gap-12 bg-[#F5F7FA] p-[9px] rounded-[15px]">
  
  <div className="flex w-full md:w-1/2 p-[18px] self-stretch bg-white rounded-[12px]">
    <div className="flex flex-col w-1/2 justify-center items-center border-r border-r-[#D9D9D9]">
      <div className="w-fit flex flex-col">
        <span className="text-[#308BF9] bg-[#E4F0FF] text-[30px] py-2 px-5 rounded-t-[10px] text-center">
          2
        </span>
        <span className="bg-[#308BF9] rounded-bl-[10px] text-center rounded-br-[10px] p-2 text-[12px] text-white tracking-wider">
          MAY
        </span>
      </div>
    </div>

    <div className="w-1/2 flex justify-center items-center">
      <div className="flex flex-col justify-center items-center self-stretch">
        <p className="text-[#252525] font-normal text-[30px]">34</p>
        <p className="text-[#252525] text-[15px] font-normal tracking-[-0.04em]">
          test taken
        </p>
      </div>
    </div>
  </div>

  
  <div className="w-full md:w-1/2 flex flex-col gap-5">
    <div className="flex gap-2.5 ml-5 items-center">
      <p className="text-[#5B5B5B] font-normal text-[15px] tracking-[-0.04em]">
        Test Taken
      </p>
      <div className="flex gap-[5px]">
        <p className="text-[#535359] font-medium text-[12px] tracking-[-0.02em]">
          One week
        </p>
        <IoIosArrowDown className="text-[#535359]" />
      </div>
    </div>
    <div className="max-w-[318px] max-h-[200px]">
      <Bar data={data} options={options} />
    </div>
  </div>
</div>

);
}