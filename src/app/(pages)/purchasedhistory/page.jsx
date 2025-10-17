

import ProtectedRoute from "@/app/components/ProtectedRoute";
import Header from "@/app/components/header";
import Footer from "@/app/components/Footer";
import PurchasedHistoryTable from "@/app/components/PurchedHistoryTable";
export default function PurchedHistory() {
    return (
        <>
            <ProtectedRoute>

                <div className="flex flex-col min-h-screen">

                    <div className="flex flex-1 flex-col gap-2 w-full px-4">
                        <Header />
                        {/* <p className="text-[#252525] text-[18px] font-semibold">Purchased History</p> */}
                        <PurchasedHistoryTable />
                    </div>

                    <Footer />
                </div>
            </ProtectedRoute>
        </>
    )
}