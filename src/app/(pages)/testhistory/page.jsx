import Header from "@/app/components/header";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import TestHistoryTable from "@/app/components/testhistorytable";

export default function TestHistory(){
    return(
        <>
         <ProtectedRoute>
     <div className="flex gap-3 w-full">
       
        <div className="flex flex-col gap-2 w-full px-4">
            <Header  enableSubjects={false} enableDatewise={false}/>
            <p className="text-[#252525] text-[18px] font-semibold pl-3">Test Logo</p>
            <TestHistoryTable/>
        </div>
     </div>
     </ProtectedRoute>
        </>
    )
}