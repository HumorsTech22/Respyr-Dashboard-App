import Header from "@/app/components/header";
import Sidebar from "@/app/components/Sidebar";
import TestHistoryTable from "@/app/components/testhistorytable";

export default function TestHistory(){
    return(
        <>
     <div className="flex gap-3 w-full">
         {/* <div>
            <Sidebar/>
         </div> */}

        <div className="flex flex-col gap-2 w-full px-4">
            <Header/>
            <p className="text-[#252525] text-[18px] font-semibold pl-3">Test Logo</p>
            <TestHistoryTable/>
        </div>
     </div>
        </>
    )
}