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
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import { useState, useRef, useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TestTaken() {
  const [open, setOpen] = useState(false);
  const [rangeLabel, setRangeLabel] = useState("Last 7 days");
  const [showModal, setShowModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Chart data for 7 days
  const data7Days = {
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

  // Chart data for 30 days
  const data30Days = {
    labels: [
      "1 May", "2 May", "3 May", "4 May", "5 May", "6 May", "7 May", "8 May",
      "9 May", "10 May", "11 May", "12 May", "13 May", "14 May", "15 May",
      "16 May", "17 May", "18 May", "19 May", "20 May", "21 May", "22 May",
      "23 May", "24 May", "25 May", "26 May", "27 May", "28 May", "29 May", "30 May"
    ],
    datasets: [
      {
        label: "",
        data: [
          25, 60, 50, 30, 50, 55, 40, 35, 45, 60, 55, 30, 25, 40, 50,
          35, 45, 55, 40, 30, 50, 45, 35, 60, 55, 40, 30, 45, 50, 35
        ],
        backgroundColor: Array(29).fill("#CAE1FF").concat("#308BF9"),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          title: function(tooltipItems) {
            // Show the date (label) in tooltip
            return tooltipItems[0].label;
          },
          label: function(context) {
            // Show the value in tooltip
            return `Tests: ${context.parsed.y}`;
          }
        }
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
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const modalOptions = {
    ...options,
    scales: {
      ...options.scales,
      x: {
        ...options.scales.x,
        ticks: {
          maxTicksLimit: 10,
        }
      }
    }
  };

  const handleRangeChange = (opt) => {
    if (opt === "Last 1 Month") {
      setShowModal(true);
    }
    setRangeLabel(opt);
    setOpen(false);
  };

  return (
    <>
      <div className="flex md:flex-row items-center flex-col w-full gap-12 bg-[#F5F7FA] p-[9px] rounded-[15px]">
        <div className="flex w-full md:w-1/2 p-[18px] self-stretch bg-white rounded-[12px]">
          <div className="flex flex-col w-1/2 justify-center items-center border-r border-r-[#D9D9D9]">
            <div className="w-fit flex flex-col">
              <span className="text-[#308BF9] bg-[#E4F0FF] text-[30px] py-2 px-5 rounded-t-[10px] text-center">
               {new Date().getDate()}
              </span>
              <span className="flex justify-center bg-[#308BF9] rounded-bl-[10px] rounded-br-[10px] p-2 text-[12px] text-white tracking-wider">
                {new Date().toLocaleString('default', { month: 'short' }).toUpperCase()}
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
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-[5px] cursor-pointer focus:outline-none"
                aria-haspopup="menu"
                aria-expanded={open ? "true" : "false"}
              >
                <p className="text-[#535359] font-medium text-[12px] tracking-[-0.02em]">
                  {rangeLabel}
                </p>
                <IoIosArrowDown className={`text-[#535359] transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-40 rounded-md border border-[#E5E7EB] bg-white shadow-lg z-20"
                >
                  <ul className="py-1 text-sm text-[#535359]">
                    {["Last 7 days", "Last 1 Month"].map((opt) => (
                      <li key={opt}>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleRangeChange(opt)}
                          className={`w-full text-left px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                            rangeLabel === opt ? "bg-gray-50" : ""
                          }`}
                        >
                          {opt}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="max-w-[318px] max-h-[200px]">
            <Bar data={data7Days} options={options} />
          </div>
        </div>
      </div>

      {/* Modal for 30 days view */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#252525]">
                Test Taken - Last 30 Days
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
              >
                <IoIosClose size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="h-96">
                <Bar data={data30Days} options={modalOptions} />
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer px-4 py-2 bg-[#308BF9] text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}