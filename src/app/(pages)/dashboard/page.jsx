import Image from "next/image";
import TestTaken from "@/app/components/TestTaken";
import TestAnalytics from "@/app/components/TestAnalytics";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/header";
import Gender from "@/app/components/Gender"



export default function Dashboard() {
  return (
    <>
      <div className="flex w-full ">

        <div className="flex w-full flex-col  px-5  ">
          <Header />
          <div className="flex xl:flex-row  flex-col w-full gap-5 ">
            <div className="flex flex-col gap-5  xl:w-[65%] w-full ">
              <TestTaken />
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



