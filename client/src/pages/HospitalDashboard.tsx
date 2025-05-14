import { Outlet } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import MobileHeader from "@/components/mobileHeader"
import Header from "@/components/header"

export default function HospitalDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-teal-50">
      {/* Mobile Header */}
       <MobileHeader/>
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
       <Sidebar />
        {/* Main content */}
        <main className="flex-1">
         <Header/>
         
         <Outlet/>
        </main>
      </div>
    </div>
  )
}