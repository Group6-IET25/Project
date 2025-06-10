import React, { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { Bell, Home, Menu, Settings, Shield, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'

function MobileHeader() {

     const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <div>
             <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur px-4 sm:px-6 lg:hidden shadow-sm">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-xs">
            <div className="flex items-center gap-2 p-4">
              <Shield className="h-7 w-7 text-teal-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Accisense
              </span>
            </div>
            <nav className="grid gap-1 mt-6">
              <Link
                to="/home"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium bg-teal-50 text-teal-700"
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/home"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setSidebarOpen(false)}
              >
                <Users className="h-5 w-5" />
                Patients
              </Link>
              <Link
                to="/home"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setSidebarOpen(false)}
              >
                <Bell className="h-5 w-5" />
                Notifications
              </Link>
              {/* <Link
                to="/home"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link> */}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-slate-800">Hospital Dashboard</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <img
                src="https://via.placeholder.com/32"
                alt="User"
                className="rounded-full w-8 h-8"
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-slate-200 shadow-lg">
            <DropdownMenuLabel className="font-medium text-slate-800">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            {/* <DropdownMenuItem className="text-slate-700 hover:bg-slate-50">
              <Settings className="mr-2 h-4 w-4 text-slate-500" />
              Settings
            </DropdownMenuItem> */}
            <DropdownMenuItem className="text-slate-700 hover:bg-slate-50">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  )
}

export default MobileHeader;