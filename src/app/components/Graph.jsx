
"use client";

import React, { useMemo, useRef } from "react";
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

const getColor = (y) => {
  const v = Number(y);
  if (!Number.isFinite(v)) return "#9CA3AF";
  if (v >= 80) return "#3FAF58";
  if (v >= 61) return "#FFC412";
  return "#EA5455";
};

export default function Graph({ realData }) {
  const canvasRef = useRef(null);

  const labels = Array.isArray(realData?.labels) ? realData.labels : [];
  const seriesData = Array.isArray(realData?.data) ? realData.data : [];

  const isEmpty =
    labels.length === 0 ||
    seriesData.length === 0 ||
    seriesData.every((v) => !Number.isFinite(Number(v)));

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Health Score",
          data: seriesData,
          pointBackgroundColor: (ctx) => getColor(ctx.parsed.y),
          pointBorderColor: (ctx) => getColor(ctx.parsed.y),
          pointRadius: 3,
          borderWidth: 2,
          borderColor: "#308BF9",
          fill: false,
          tension: 0.35,
          segment: {
            //borderColor: (ctx) => getColor(ctx.p1?.parsed?.y),
          },
        },
      ],
    }),
    [labels, seriesData]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: { mode: "index", intersect: false,
          callbacks: { label: (ctx) => `Score: ${ctx.parsed.y}` },
        },
      },
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#6b7280", font: { size: 12 } } },
        y: { min: 0, max: 100, grid: { color: "rgba(0,0,0,0.06)" }, ticks: { stepSize: 20 }, border: { display: false } },
      },
    }),
    []
  );

  return (
    <main className="">
      <div className="mx-auto max-w-5xl">
        <div className="h-72 sm:h-80 md:h-96">
          {isEmpty ? (
            <div className="w-full h-full flex items-center justify-center ">
              <span className="text-[16px] text-[#5B5B5B] whitespace-nowrap">No test records available for this profile</span>
            </div>
          ) : (
            <Line ref={canvasRef} data={data} options={options} />
          )}
        </div>

        {/* Range indicators */}
        {!isEmpty && (
          <div className="flex justify-center items-center gap-6 py-5 px-[35px] whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3FAF58]"></div>
              <div className="flex gap-[5px]">
                <span className="text-[10px] leading-normal font-medium text-[#252525]">Good</span>
                <span className="text-[10px] leading-normal font-normal text-[#535359] tracking-[-0.4px]">80-100%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FFC412]"></div>
              <div className="flex gap-[5px]">
                <span className="text-[10px] leading-normal font-medium text-[#252525]">Fair</span>
                <span className="text-[10px] leading-normal font-normal text-[#535359] tracking-[-0.4px]">61-79%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EA5455]"></div>
              <div className="flex gap-[5px]">
                <span className="text-[10px] leading-normal font-medium text-[#252525]">Poor</span>
                <span className="text-[10px] leading-normal font-normal text-[#535359] tracking-[-0.4px]">0-60%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
