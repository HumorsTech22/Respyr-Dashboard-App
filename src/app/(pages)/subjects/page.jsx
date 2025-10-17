// import ProtectedRoute from "@/app/components/ProtectedRoute"
// import SubjectTable from "@/app/components/SubjectTable"
// import Header from "@/app/components/header"
// import Footer from "@/app/components/Footer"

// export default function Subjects() {
//     return (
//         <>
//             <ProtectedRoute>
//                 <div className="flex flex-col min-h-screen">
//                 <div className="flex gap-3 w-full">
//                     <div className="flex flex-col gap-2 w-full px-4">
//                         <Header />
//                         <SubjectTable />
//                     </div>
//                 </div>
//                   <Footer />
//                 </div>
//             </ProtectedRoute>
//         </>
//     )
// }






import ProtectedRoute from "@/app/components/ProtectedRoute";
import SubjectTable from "@/app/components/SubjectTable";
import Header from "@/app/components/header";
import Footer from "@/app/components/Footer";

export default function Subjects() {
  return (
    <ProtectedRoute>
      {/* Full page layout */}
      <div className="flex flex-col min-h-screen">
        
        {/* Page content */}
        <div className="flex flex-1 flex-col gap-2 w-full px-4">
          <Header />
          <p className="text-[#252525] text-[18px] font-semibold pl-3">Subjects</p>
          <SubjectTable />
        </div>

        {/* Footer always at bottom */}
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
