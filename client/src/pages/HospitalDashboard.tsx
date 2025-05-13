import { useEffect, useState } from "react"
import { Bell, ChevronDown, Home, Menu, Settings, Users } from "lucide-react"
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
import { log } from "console"

export default function HospitalDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accidentNotifications, setAccidentNotifications] = useState([])

  useEffect(() => {
    // check how the user arrived
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]
    const navType = navEntries.length > 0 ? navEntries[0].type : "navigate"
    const hasVisited = sessionStorage.getItem("hasVisitedHospitalDashboard")

    // only on hard reload or first-ever landing in this session
    if (navType === "reload" || !hasVisited) {
      sessionStorage.setItem("hasVisitedHospitalDashboard", "true")

      const fetchNotifications = async () => {
        try {
          const res = await fetch(
            "http://192.168.81.204:5000/api/monitor/healthcare/dashboard"
          )
          const data = await res.json()
          console.log(data);
          setAccidentNotifications(data)
        } catch (error) {
          console.error("Failed to fetch accident notifications", error)
        }
      }

      fetchNotifications()
    }
  }, [])

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
              <img
                src="https://via.placeholder.com/32"
                alt="User"
                className="rounded-full w-8 h-8"
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
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
                  className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground hover:text-primary-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to="/home"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Patients
                </Link>
                <Link
                  to="/home"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Bell className="h-5 w-5" />
                  Notifications
                </Link>
                <Link
                  to="/home"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  <img
                    src="https://via.placeholder.com/24"
                    alt="User"
                    className="rounded-full w-6 h-6"
                  />
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
                <Card key={notification.userId?._id} className="w-full">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div>
                      <CardTitle className="text-xl">
                        {notification.userId?.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {notification.timestamp}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium">Patient Mobile</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.userId?.personalContact}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Family Contact</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.userId?.familyContact}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.userId?.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button size="sm" variant="outline">
                          Location
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
