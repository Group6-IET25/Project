"use client"

import { useState } from "react"
import { Bell, ChevronDown, Home, Image, Menu, Settings, Users } from "lucide-react"
// import Image from "next/image"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "react-router-dom"

export default function HospitalDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Sample accident notifications data
  const accidentNotifications = [
    {
      id: 1,
      patientName: "John Doe",
      mobileNumber: "+1 (555) 123-4567",
      familyMobileNumber: "+1 (555) 987-6543",
      location: "Highway 101, Mile Marker 25",
      timestamp: "10 minutes ago",
      severity: "Critical",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      mobileNumber: "+1 (555) 234-5678",
      familyMobileNumber: "+1 (555) 876-5432",
      location: "Main Street & 5th Avenue",
      timestamp: "25 minutes ago",
      severity: "Moderate",
    },
    {
      id: 3,
      patientName: "Robert Johnson",
      mobileNumber: "+1 (555) 345-6789",
      familyMobileNumber: "+1 (555) 765-4321",
      location: "Central Park, East Entrance",
      timestamp: "45 minutes ago",
      severity: "Stable",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:hidden">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 sm:max-w-xs">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                to="/home"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-primary hover:bg-muted"
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/home"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
                onClick={() => setSidebarOpen(false)}
              >
                <Users className="h-5 w-5" />
                Patients
              </Link>
              <Link
                to="/home"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
                onClick={() => setSidebarOpen(false)}
              >
                <Bell className="h-5 w-5" />
                Notifications
              </Link>
              <Link
                to="/home"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Hospital Dashboard</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Image
                // src="/placeholder.svg?height=32&width=32"
                width={32}
                height={32}
                // alt="User"
                className="rounded-full"
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/home" className="flex items-center gap-2 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m6 0h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3" />
                <path d="m12 12 4 10 1.7-4.3L22 16Z" />
              </svg>
              <span className="hidden md:inline">Hospital System</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto py-6">
            <div className="px-4 lg:px-6">
              <h2 className="mb-2 text-lg font-semibold tracking-tight">Menu</h2>
              <div className="space-y-1">
                <Link
                  to="/home"
                  className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground transition-all hover:text-primary-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="/home"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Patients
                </Link>
                <Link
                  to="/home"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <Bell className="h-5 w-5" />
                  Notifications
                </Link>
                <Link
                  to="/home"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Accident Notifications</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Image
                    // src="/placeholder.svg?height=24&width=24"
                    width={24}
                    height={24}
                    // alt="User"
                    className="rounded-full"
                  />
                  <span className="hidden sm:inline-flex">Dr. Sarah Wilson</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-4 lg:p-6">
            <div className="grid gap-4">
              {accidentNotifications.map((notification) => (
                <Card key={notification.id} className="w-full">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div>
                      <CardTitle className="text-xl">
                        {notification.patientName}
                        <span
                          className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            notification.severity === "Critical"
                              ? "bg-red-100 text-red-800"
                              : notification.severity === "Moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {notification.severity}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{notification.timestamp}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium">Patient Mobile</p>
                          <p className="text-sm text-muted-foreground">{notification.mobileNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Family Contact</p>
                          <p className="text-sm text-muted-foreground">{notification.familyMobileNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{notification.location}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">Respond</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

