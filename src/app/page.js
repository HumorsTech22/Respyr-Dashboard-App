import Image from "next/image";
import TestTaken from "./components/TestTaken";
import TestAnalytics from "./components/TestAnalytics";
import Sidebar from "./components/Sidebar";
import Header from "./components/header";
import Scorecard from "./components/scorecard";
import Gender from "./components/Gender"

export default function Home() {
  return (
    <>
      {/* <div className="flex w-full ">
        <div> <Sidebar /></div>
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
      </div> */}

      <p className="text-black">login page</p>
    </>
  );
}
