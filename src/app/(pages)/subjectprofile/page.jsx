import Analytics from "@/app/components/Analytics";
import Header from "@/app/components/header";
import { Profile } from "@/app/components/profile";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Footer from "@/app/components/Footer";

export default function SubjectProfile() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        
        <main className="flex-1">
          <Header />
          <div className="flex w-full gap-5 px-[30px] mb-8 items-start">
            <div className="w-full lg:w-1/3">
              <Profile />
            </div>
            <div className="w-full lg:w-2/3">
              <Analytics />
            </div>
          </div>
        </main>

      
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
