"use client";

import React from "react";

export default function HistoryTable({ records, activeTab }) {
  // Get the appropriate value based on active tab
  const getRecordValue = (record) => {
    switch (activeTab) {
      case "sugar":
        return {
          score: record.Db_Score,
          additional: `Acetone: ${parseFloat(record.acetone_ppm).toFixed(1)} ppm`,
        };

      case "liver":
        return {
          score: record.liver_score,
          // Note: API key is "ethnol_ppm" (typo kept as-is)
          additional: `Ethanol: ${parseFloat(record.ethnol_ppm).toFixed(1)} ppm`,
        };

      case "respiratory": {
        let respiratoryData = {};
        try {
          respiratoryData = JSON.parse(record.respiratory_fvc_json || "{}");
        } catch (_) {}

        const respiratoryScore =
          respiratoryData?.["Respiratory Score(%)"]?.["Respiratory Score(%)"];
        const fev1 = respiratoryData?.["Respyr_Measured"]?.["FEV1(L)"];

        const fvcText = respiratoryScore
          ? `${parseFloat(respiratoryScore).toFixed(1)}%`
          : "N/A";
        const fev1Text =
          fev1 !== undefined && fev1 !== null
            ? `${Number(fev1).toFixed(3)} L`
            : "N/A";

        return {
          score: record.Blow_Score,
          // Now shows both FVC% and FEV1(L)
          additional: `FVC: ${fvcText} • FEV1: ${fev1Text}`,
        };
      }

      case "gut":
        return {
          score: record.Gut_Score_per,
          additional: `H2: ${parseFloat(record.h2_ppm).toFixed(1)} ppm`,
        };

      default:
        return {
          score: record.Db_Score,
          additional: `Acetone: ${parseFloat(record.acetone_ppm).toFixed(1)} ppm`,
        };
    }
  };

  // Get color based on score
  const getScoreColor = (score) => {
    const numericScore = parseInt(score);
    if (numericScore >= 80) return "#3FAF58";
    if (numericScore >= 61) return "#FFC412";
    return "#EA5455";
  };

  // Format date from dttm
  const formatDate = (dttm) => {
    const [datePart, timePart] = dttm.split(" ");
    const [day, month, year] = datePart.split("/");
    const date = new Date(`${month}/${day}/${year} ${timePart}`);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!records || records.length === 0) {
    return (
      <div className="w-full flex flex-col gap-5 px-5 pt-[30px] rounded-[20px] bg-white shadow-[0_0_10px_5px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-6">
          <span className="text-[#5B5B5B] text-[25px] font-semibold leading-normal tracking-[-1px]">
            Test History
          </span>
        </div>
        <div className="max-h-[520px] overflow-y-auto scrollbar-hide">
          <div className="text-center text-[#535359] py-8">
            No test records available
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-5 px-5 pt-[30px] rounded-[20px] bg-white shadow-[0_0_10px_5px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-6">
          <span className="text-[#5B5B5B] text-[25px] font-semibold leading-normal tracking-[-1px]">
            Test History
          </span>
        </div>

        <div className="max-h-[520px] overflow-y-auto scrollbar-hide">
          {records.map((record, index) => {
            const recordValue = getRecordValue(record);
            const scoreColor = getScoreColor(recordValue.score);

            return (
              <div key={record.id || index}>
                <div className="flex flex-col gap-2.5">
                  <span className="text-[#535359] text-[12px] font-normal leading-[110%] tracking-[-0.24px]">
                    {formatDate(record.dttm)}
                  </span>
                  <div className="flex">
                    <div className="flex gap-[5px] items-center pr-3.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 8 9"
                        className="w-2 h-[9px]"
                        style={{ color: scoreColor }}
                        aria-hidden="true"
                      >
                        <circle cx="4" cy="4.5" r="4" fill="currentColor" />
                      </svg>
                      <span className="text-[#535359] text-[15px] font-semibold leading-[110%] tracking-[-0.3px]">
                        {recordValue.score}%
                      </span>
                    </div>

                    <div className="pl-3.5 border-l border-l-[#535359] ">
                      <span className="text-[#535359] text-[15px] font-semibold leading-[110%] tracking-[-0.3px]">
                        {recordValue.additional}
                      </span>
                    </div>
                  </div>
                </div>
                {index < records.length - 1 && (
                  <div className="w-full h-px bg-[#D9D9D9] my-[15px]"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
