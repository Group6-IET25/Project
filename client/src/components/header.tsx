import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { ChevronDown, Settings } from 'lucide-react'

function Header() {
  return (
    <div>
         <div className="flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur px-6 shadow-sm">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-slate-800">Accident Notifications</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1 border-slate-200">
                  <img
                    src="https://via.placeholder.com/24"
                    alt="User"
                    className="rounded-full w-6 h-6"
                  />
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-slate-200 shadow-lg">
                <DropdownMenuLabel className="font-medium text-slate-800">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem className="text-slate-700 hover:bg-slate-50">
                  <Settings className="mr-2 h-4 w-4 text-slate-500" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem className="text-slate-700 hover:bg-slate-50">Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
    </div>
  )
}

export default Header;