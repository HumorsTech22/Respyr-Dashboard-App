// "use client"
// import Image from "next/image";
// import TestTaken from "@/app/components/TestTaken";
// import TestAnalytics from "@/app/components/TestAnalytics";
// import Sidebar from "@/app/components/Sidebar";
// import Header from "@/app/components/header";
// import Gender from "@/app/components/Gender"
// import { useState } from "react";


// export default function Dashboard() {
//   const [selectedDate, setSelectedDate] = useState(() => {
//     const now = new Date();
//     return new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   });
//   return (
//     <>
//       <div className="flex w-full ">

//         <div className="flex w-full flex-col  px-5  ">
//           <Header />
//           <div className="flex xl:flex-row  flex-col w-full gap-5 ">
//             <div className="flex flex-col gap-5  xl:w-[65%] w-full ">
//               <TestTaken selectedDate={selectedDate}  onDateSelect={setSelectedDate}/>
//               <TestAnalytics />
//             </div>
//             <div className="xl:w-[35%] w-full">

//               <Gender />
//             </div>


//           </div>


//         </div>
//       </div>
//     </>
//   )
// }






"use client"
import Image from "next/image";
import TestTaken from "@/app/components/TestTaken";
import TestAnalytics from "@/app/components/TestAnalytics";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/header";
import Gender from "@/app/components/Gender"
import { useSelector } from "react-redux";

export default function Dashboard() {
  // Get selectedDate from Redux store instead of local state
  const selectedDate = useSelector((state) => state.datewise.selectedDate);
  
  return (
    <>
      <div className="flex w-full ">
        <div className="flex w-full flex-col  px-5  ">
          <Header />
          <div className="flex xl:flex-row  flex-col w-full gap-5 ">
            <div className="flex flex-col gap-5  xl:w-[65%] w-full ">
              {/* Pass the Redux date to TestTaken */}
              <TestTaken selectedDate={selectedDate} />
              <TestAnalytics />
            </div>
            <div className="xl:w-[35%] w-full">
              <Gender />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}