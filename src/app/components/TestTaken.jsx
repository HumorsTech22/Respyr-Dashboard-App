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
import { useSelector } from "react-redux";
import { fetchTestCountData } from "../services/authService"

export default function TestTaken({ selectedDate }) {
  const [open, setOpen] = useState(false);
  const [rangeLabel, setRangeLabel] = useState("Last 1 Week");
  const [showModal, setShowModal] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);

  // Get date from Redux store
  const { data: datewiseData, loading: reduxLoading, error } = useSelector((state) => state.datewise);
  const reduxSelectedDate = useSelector((state) => state.datewise.selectedDate);

  // Store the data in variables
  const reduxData = datewiseData;
  const isLoading = reduxLoading;
  const hasError = error;

  // Use Redux date instead of prop
  const displayDate = reduxSelectedDate 
    ? new Date(reduxSelectedDate) 
    : new Date();

  const testCount = reduxData?.count ?? 0;

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

  // Fetch test count data from API - refetch when Redux date changes
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        const response = await fetchTestCountData();
        
        if (response.success && response.daily_counts) {
          // Process the API data for chart
          processChartData(response.daily_counts);
        }
      } catch (error) {
        console.error("Error fetching test count data:", error);
        // Fallback to mock data if API fails
        setChartData(generateLast7DaysMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [reduxSelectedDate]); // Add reduxSelectedDate as dependency

  // Process API data for chart display - Last 7 days from current date
  const processChartData = (dailyCounts) => {
    const today = new Date();
    const last7Days = [];
    
    // Generate last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // Find data for this date or set to 0 if not found
      const dayData = dailyCounts.find(item => item.date === dateString);
      last7Days.push({
        date: dateString,
        count: dayData ? dayData.count : 0
      });
    }
    
    const labels = last7Days.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    });
    
    const data = last7Days.map(item => item.count);
    
    // Create background colors - last bar (today) blue, others light blue
    const backgroundColors = last7Days.map((_, index) => 
      index === last7Days.length - 1 ? "#308BF9" : "#CAE1FF"
    );

    const processedData = {
      labels,
      datasets: [
        {
          label: "",
          data,
          backgroundColor: backgroundColors,
        },
      ],
    };

    setChartData(processedData);
  };

  // Process data for 30 days modal - Last 30 days from current date
  const process30DaysData = (dailyCounts) => {
    const today = new Date();
    const last30Days = [];
    
    // Generate last 30 days including today
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // Find data for this date or set to 0 if not found
      const dayData = dailyCounts.find(item => item.date === dateString);
      last30Days.push({
        date: dateString,
        count: dayData ? dayData.count : 0
      });
    }
    
    const labels = last30Days.map(item => {
      const date = new Date(item.date);
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    });
    
    const data = last30Days.map(item => item.count);
    
    // Create background colors - last bar (today) blue, others light blue
    const backgroundColors = last30Days.map((_, index) => 
      index === last30Days.length - 1 ? "#308BF9" : "#CAE1FF"
    );

    return {
      labels,
      datasets: [
        {
          label: "",
          data,
          backgroundColor: backgroundColors,
        },
      ],
    };
  };

  // Generate mock data for last 7 days (fallback)
  const generateLast7DaysMockData = () => {
    const today = new Date();
    const labels = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(`${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`);
      // Random data between 20-60 for mock
      data.push(Math.floor(Math.random() * 41) + 20);
    }
    
    const backgroundColors = labels.map((_, index) => 
      index === labels.length - 1 ? "#308BF9" : "#CAE1FF"
    );

    return {
      labels,
      datasets: [
        {
          label: "",
          data,
          backgroundColor: backgroundColors,
        },
      ],
    };
  };

  // Generate mock data for last 30 days (fallback)
  const generateLast30DaysMockData = () => {
    const today = new Date();
    const labels = [];
    const data = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(`${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`);
      // Random data between 10-80 for mock
      data.push(Math.floor(Math.random() * 71) + 10);
    }
    
    const backgroundColors = labels.map((_, index) => 
      index === labels.length - 1 ? "#308BF9" : "#CAE1FF"
    );

    return {
      labels,
      datasets: [
        {
          label: "",
          data,
          backgroundColor: backgroundColors,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    // Disable animations
    animation: {
      duration: 0 // Disable all animations
    },
    transitions: {
      active: {
        animation: {
          duration: 0
        }
      }
    },
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
          title: function (tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function (context) {
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
    // Additional options to ensure no animations
    hover: {
      animationDuration: 0
    },
    responsiveAnimationDuration: 0
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
      },
      y: {
        ...options.scales.y,
        max: 100, // Increase max for 30 days view as numbers might be higher
      }
    }
  };

  const handleRangeChange = async (opt) => {
    if (opt === "Last 1 Month") {
      try {
        const response = await fetchTestCountData();
        if (response.success && response.daily_counts) {
          const modalData = process30DaysData(response.daily_counts);
          setChartData(modalData);
        }
      } catch (error) {
        console.error("Error fetching 30 days data:", error);
        // Fallback to mock data
        setChartData(generateLast30DaysMockData());
      }
      setShowModal(true);
    } else {
      // For 1 week view, use the already processed data
      try {
        const response = await fetchTestCountData();
        if (response.success && response.daily_counts) {
          processChartData(response.daily_counts);
        }
      } catch (error) {
        console.error("Error refreshing week data:", error);
        setChartData(generateLast7DaysMockData());
      }
    }
    setRangeLabel(opt);
    setOpen(false);
  };

  // Add this function to handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    // Reset to weekly data and range label
    setRangeLabel("Last 1 Week");
    // Refresh the weekly chart data
    fetchWeeklyData();
  };

  // Function to fetch weekly data
  const fetchWeeklyData = async () => {
    try {
      const response = await fetchTestCountData();
      if (response.success && response.daily_counts) {
        processChartData(response.daily_counts);
      }
    } catch (error) {
      console.error("Error refreshing week data:", error);
      setChartData(generateLast7DaysMockData());
    }
  };

  return (
    <>
      <div className="flex md:flex-row items-center flex-col w-full gap-12 bg-[#F5F7FA] p-[9px] rounded-[15px]">
        <div className="flex w-full md:w-1/3 p-[18px] self-stretch bg-white rounded-[12px]">
          <div className="flex flex-col w-1/2 justify-center items-center border-r border-r-[#D9D9D9]">
            <div className="w-fit flex flex-col">
              <span className="text-[#308BF9] bg-[#E4F0FF] text-[30px] py-2 px-5 rounded-t-[10px] text-center">
                {displayDate.getDate()}
              </span>
              <span className="flex justify-center bg-[#308BF9] rounded-bl-[10px] rounded-br-[10px] p-2 text-[12px] text-white tracking-wider">
                {displayDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="w-1/2 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center self-stretch">
              <p className="text-[#252525] font-normal text-[30px]">
                {testCount}</p>
              <p className="text-[#252525] text-[15px] font-normal tracking-[-0.04em]">
                test taken
              </p>
            </div>
          </div>
        </div> 

        <div className="w-full md:w-2/3 flex flex-col gap-5">
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
                    {["Last 1 Week", "Last 1 Month"].map((opt) => (
                      <li key={opt}>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => handleRangeChange(opt)}
                          className={`w-full text-left px-3 py-2 cursor-pointer hover:bg-gray-100 ${rangeLabel === opt ? "bg-gray-50" : ""
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
          <div className="w-full h-48">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading chart...</p>
              </div>
            ) : (
              <Bar data={chartData || generateLast7DaysMockData()} options={options} />
            )}
          </div>
        </div>
      </div>

      {/* Modal for 30 days view */}
      {showModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/40 to-gray-800/50 flex items-center justify-center z-50 p-4">
          <div className="border border-[#D9D9D9] shadow-2xl bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#252525]">
                Test Taken - Last 30 Days
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
              >
                <IoIosClose size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="h-96">
                <Bar data={chartData || generateLast30DaysMockData()} options={modalOptions} />
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
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