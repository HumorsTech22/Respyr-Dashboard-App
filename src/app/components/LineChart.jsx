// import React from 'react'
// import HistoryTable from './HistoryTable'
// import Image from 'next/image'
// import { IoIosArrowDown } from "react-icons/io";
// import Graph from './Graph';

// export const LineChart = ({ activeTab, records }) => {
//     // Get the current score based on active tab
//     const getCurrentScore = () => {
//         if (!records || records.length === 0) return "-";
        
//         const latestRecord = records[0]; // Most recent record
        
//         switch(activeTab) {
//             case 'sugar':
//                 return latestRecord.Db_Score || "-";
//             case 'liver':
//                 return latestRecord.liver_score || "-";
//             case 'respiratory':
//                 return latestRecord.Blow_Score || "-";
//             case 'gut':
//                 return latestRecord.Gut_Score_per || "-";
//             default:
//                 return "-";
//         }
//     };

//     // Get score status and color
//     const getScoreStatus = (score) => {
//         const numericScore = parseInt(score);
//         if (numericScore >= 80) return { status: "Good", color: "#3FAF58" };
//         if (numericScore >= 61) return { status: "Fair", color: "#FFC412" };
//         return { status: "Poor", color: "#EA5455" };
//     };

//     // Prepare chart data from records
//     const getChartData = () => {
//         if (!records || records.length === 0) {
//             return {
//                 labels: ["15 May", "16 May", "17 May", "18 May", "19 May", "20 May", "21 May"],
//                 data: [86, 89, 90, 92, 94, 95, 96]
//             };
//         }

//         // Sort records by timestamp (newest first) and take last 7 for chart
//         const sortedRecords = [...records].sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)).slice(0, 7).reverse();
        
//         const labels = sortedRecords.map(record => {
//             const date = new Date(parseInt(record.timestamp) * 1000);
//             return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
//         });

//         const data = sortedRecords.map(record => {
//             switch(activeTab) {
//                 case 'sugar':
//                     return parseInt(record.Db_Score);
//                 case 'liver':
//                     return parseInt(record.liver_score);
//                 case 'respiratory':
//                     return parseInt(record.Blow_Score);
//                 case 'gut':
//                     return parseInt(record.Gut_Score_per);
//                 default:
//                     return parseInt(record.Db_Score);
//             }
//         });

//         return { labels, data };
//     };

//     const currentScore = getCurrentScore();
//     const scoreStatus = getScoreStatus(currentScore);
//     const chartData = getChartData();

//     return (
//         <div className='flex gap-[34px] pl-[23px] rounded-[20px] bg-white shadow-[0_0_10px_5px_rgba(0,0,0,0.05)]'>
//             <div className='flex flex-col gap-10'>
//                 <div className='flex justify-between items-start'>
//                     <div className='flex flex-col gap-5'>
//                         <div className='flex gap-[5px] pt-[25px]'>
//                             <div className='flex items-start'>
//                                 {/* <Image
//                                     src="/assets/icons/Frame 427319409.svg"
//                                     alt='Frame 427319409.svg'
//                                     width={20}
//                                     height={20}
//                                 /> */}
//                                 {/* <span className='text-[#3FAF58] text-[12px] font-medium tracking-[-0.24px] leading-normal'>5%</span> */}
//                             </div>
//                             {/* <p className='text-[#A1A1A1] text-[12px] font-normal leading-normal tracking-[-0.24px]'>than all time</p> */}
//                         </div>
//                         <div className='flex flex-col gap-2.5'>
//                             <span className='text-[#252525] text-[30px] font-normal leading-normal tracking-[0.6px]'>{currentScore}%</span>
//                             <span className='font-semibold leading-normal tracking-[-0.24px] text-[12px]' style={{ color: scoreStatus.color }}>
//                                 {scoreStatus.status}
//                             </span>
//                             <span className='text-[#252525] text-[15px] font-normal leading-[110%] tracking-[-0.3px]'>Health score</span>
//                         </div>
//                     </div>
//                 </div>
                
//                 <div>
//                     {/* Pass the real data to Graph but keep your existing Graph component as is */}
//                     <Graph realData={chartData} />
//                 </div>
//             </div>
//             <HistoryTable records={records} activeTab={activeTab} />
//         </div>
//     )
// }









import React from 'react';
import HistoryTable from './HistoryTable';
import Graph from './Graph';

export const LineChart = ({ activeTab, records }) => {
  // pull latest record safely
  const latest = Array.isArray(records) && records.length > 0 ? records[0] : null;

  const getCurrentScore = () => {
    if (!latest) return null;
    switch (activeTab) {
      case 'sugar':       return latest?.Db_Score ?? null;
      case 'liver':       return latest?.liver_score ?? null;
      case 'respiratory': return latest?.Blow_Score ?? null;
      case 'gut':         return latest?.Gut_Score_per ?? null;
      default:            return null;
    }
  };

  const getScoreStatus = (score) => {
    const v = Number(score);
    if (!Number.isFinite(v)) return { status: '—', color: '#A1A1A1' };
    if (v >= 80) return { status: 'Good', color: '#3FAF58' };
    if (v >= 61) return { status: 'Fair', color: '#FFC412' };
    return { status: 'Poor', color: '#EA5455' };
  };

  const getChartData = () => {
    if (!Array.isArray(records) || records.length === 0) {
      // return truly empty data; Graph will render "No Data Found"
      return { labels: [], data: [] };
    }

    const sorted = [...records]
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
      .slice(0, 7)
      .reverse();

    const labels = sorted.map(r => {
      const d = new Date(Number(r.timestamp) * 1000);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    });

    const data = sorted.map(r => {
      switch (activeTab) {
        case 'sugar':       return Number(r?.Db_Score);
        case 'liver':       return Number(r?.liver_score);
        case 'respiratory': return Number(r?.Blow_Score);
        case 'gut':         return Number(r?.Gut_Score_per);
        default:            return Number(r?.Db_Score);
      }
    });

    return { labels, data };
  };

  const currentScore = getCurrentScore();
  const scoreStatus = getScoreStatus(currentScore);
  const chartData = getChartData();

  const showPercent = Number.isFinite(Number(currentScore));

  return (
    <div className='flex gap-[34px] pl-[23px] rounded-[20px] bg-white shadow-[0_0_10px_5px_rgba(0,0,0,0.05)]'>
      <div className='flex flex-col gap-10'>
        <div className='flex justify-between items-start'>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-2.5 pt-[25px]'>
              <span className='text-[#252525] text-[30px] font-normal leading-normal tracking-[0.6px]'>
                {showPercent ? `${Number(currentScore)}%` : '—'}
              </span>
              <span
                className='font-semibold leading-normal tracking-[-0.24px] text-[12px]'
                style={{ color: scoreStatus.color }}
              >
                {scoreStatus.status}
              </span>
              <span className='text-[#252525] text-[15px] font-normal leading-[110%] tracking-[-0.3px]'>
                Health score
              </span>
            </div>
          </div>
        </div>

        <div>
          <Graph realData={chartData} />
        </div>
      </div>

      <HistoryTable records={records} activeTab={activeTab} />
    </div>
  );
};
