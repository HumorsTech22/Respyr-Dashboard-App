import Analytics from "@/app/components/Analytics";
import Header from "@/app/components/header";
import { Profile } from "@/app/components/profile";


export default function PatientProfile(){
    return(
        <>
     
        <div>
          <Header/>
          <div className="flex gap-2.5 pl-[30px] pr-[25px]">
  <Profile/>
  <Analytics/>
          </div>
        
        </div>
        </>
    )
}