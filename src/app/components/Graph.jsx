"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function Graph() {
  const canvasRef = useRef(null);
  const [grads, setGrads] = useState(null);

  const labels = ["15 May", "16 May", "17 May", "18 May", "19 May"];
  const series = {
    good: [86, 89, 90, 92, 94, 95, 96],
  };

  // Create gradients after mount
  useEffect(() => {
    const ctx = canvasRef.current?.ctx?.canvas?.getContext("2d");
    if (!ctx) return;

    const makeGrad = (color, alpha = 0.18) => {
      const g = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height || 300);
      g.addColorStop(0, `${color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`);
      g.addColorStop(1, `${color}00`);
      return g;
    };

    setGrads({
      good: makeGrad("#22c55e", 0.24), // green
    });
  }, []);

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Good",
        data: series.good,
        borderColor: "#22c55e",
        pointBackgroundColor: "#22c55e",
        fill: true,
        backgroundColor: grads?.good || "transparent",
        tension: 0.35,
        borderWidth: 2,
      },
    ],
  }), [labels, series.good, grads]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false
      },
      title: { display: true },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}` },
      },
    },
    interaction: { mode: "index", intersect: false },
    scales: {
      x: { 
        grid: { display: false }, 
        ticks: { color: "#6b7280", font: { size: 12 } } 
      },
      y: { 
        min: 0, 
        max: 100, 
        grid: { color: "rgba(0,0,0,0.06)" }, 
        ticks: { stepSize: 20 }, 
        border: {
          display: false 
        }
      },
    },
  }), []);

  return (
    <main className="">
      <div className="mx-auto max-w-5xl">
        <div className="">
          <div className="h-72 sm:h-80 md:h-96">
            <Line ref={canvasRef} data={data} options={options} style={{ width: "400px", height: "400px" }}/>
          </div>
          
          {/* Range indicators at the bottom */}
          <div className="flex justify-center items-center gap-6 py-5 px-[35px] whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3FAF58]"></div>
              <div className="flex gap-[5px]">
              <span className="text-[10px] leading-normal font-medium text-[#252525]">Good </span>
                <span className="text-[10px] leading-normal font-normal text-[#535359] tracking-[-0.4px]">80-100%</span>
           </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FFC412]"></div>
             <div className="flex gap-[5px]">
              <span className="text-[10px] leading-normal font-medium text-[#252525]">Fair </span>
                <span className="text-[10px] leading-normal font-normal text-[#535359] tracking-[-0.4px]">61-79%</span>
           </div>
              
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EA5455]"></div>
             <div className="flex gap-[5px]">
              <span className="text-[10px] leading-normal font-medium text-[#252525]">Poor </span>
                <span className="text-[10px] leading-normal font-normal text-[#535359] tracking-[-0.4px]">0-60%</span>
           </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}