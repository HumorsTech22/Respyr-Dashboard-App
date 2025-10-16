import ProtectedRoute from "@/app/components/ProtectedRoute"
import SubjectTable from "@/app/components/SubjectTable"
import Header from "@/app/components/header"

export default function Subjects() {
    return (
        <>
         <ProtectedRoute>
            <div className="flex gap-3 w-full">
                <div className="flex flex-col gap-2 w-full px-4">
                    <Header />
                    <SubjectTable />
                </div>
            </div>
</ProtectedRoute>
        </>
    )
}