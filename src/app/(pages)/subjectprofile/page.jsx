import Analytics from "@/app/components/Analytics";
import Header from "@/app/components/header";
import { Profile } from "@/app/components/profile";
import ProtectedRoute from "@/app/components/ProtectedRoute";


export default function SubjectProfile() {
    
    return (
        <>
<ProtectedRoute>
            <div>
                <Header />
                <div className="flex w-full gap-5 pl-[30px] pr-[25px] mb-8 items-start">
                    <div className="w-1/3">
                        <Profile />
                    </div>
                    <div className="w-2/3">
                        <Analytics />
                    </div>
                </div>

            </div>
            </ProtectedRoute>
        </>
    )
}