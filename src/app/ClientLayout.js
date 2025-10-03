"use client"
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";

// Ensure this is the default export
export default function ClientLayout({ children }) { 
  const pathname = usePathname();

  // Hide sidebar for specific routes
  const hideSidebarRoutes = ["/", "not-found"]; // Add routes where you don't want sidebar
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  return (
    <div className="flex">
      {!shouldHideSidebar && <Sidebar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}