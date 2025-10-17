



// "use client"

// import TestTaken from "@/app/components/TestTaken";
// import TestAnalytics from "@/app/components/TestAnalytics";
// import Header from "@/app/components/header";
// import Gender from "@/app/components/Gender"
// import { useSelector } from "react-redux";
// import ProtectedRoute from "../../components/ProtectedRoute";
// import Footer from "@/app/components/Footer";

// export default function Dashboard() {
//   // Get selectedDate from Redux store instead of local state
//   const selectedDate = useSelector((state) => state.datewise.selectedDate);
  
//   return (
//     <>
//      <ProtectedRoute>
//        <div className="flex flex-col min-h-screen">
//       <div className="flex w-full ">
//         <div className="flex w-full flex-col  px-5  ">
//           <Header />
//           <div className="flex xl:flex-row  flex-col w-full gap-5 ">
//             <div className="flex flex-col gap-5  xl:w-[65%] w-full ">
//               {/* Pass the Redux date to TestTaken */}
//               <TestTaken selectedDate={selectedDate} />
//               <TestAnalytics />
//             </div>
//             <div className="xl:w-[35%] w-full">
//               <Gender />
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//       </div>
//       </ProtectedRoute>
//     </>
//   )
// }













"use client";

import TestTaken from "@/app/components/TestTaken";
import TestAnalytics from "@/app/components/TestAnalytics";
import Header from "@/app/components/header";
import Gender from "@/app/components/Gender";
import { useSelector } from "react-redux";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Footer from "@/app/components/Footer";

export default function Dashboard() {
  const selectedDate = useSelector((s) => s.datewise.selectedDate);

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
      
        <main className="flex-1 w-full">
          <div className="px-5">
            <Header />
            <div className="flex xl:flex-row flex-col w-full gap-5">
              <div className="flex flex-col gap-5 xl:w-[65%] w-full">
                <TestTaken selectedDate={selectedDate} />
                <TestAnalytics />
              </div>
              <div className="xl:w-[35%] w-full">
                <Gender />
              </div>
            </div>
          </div>
        </main>

       
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
