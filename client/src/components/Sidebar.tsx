import { Bell, Home, Settings, Shield, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${
      isActive
        ? 'bg-teal-50 text-teal-700'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <aside className="hidden w-64 flex-col border-r bg-white/80 backdrop-blur lg:flex shadow-sm">
      <div className="flex h-16 items-center border-b px-6">
        <NavLink to="/hospitaldashboard" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-teal-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
            Accisense
          </span>
        </NavLink>
      </div>
      <nav className="flex-1 overflow-auto py-6">
        <div className="px-4 lg:px-6">
          <h2 className="mb-4 text-sm font-semibold tracking-tight text-slate-500 uppercase">Menu</h2>
          <div className="space-y-1">
            <NavLink to="/hospitaldashboard" end className={linkClasses}>
              <Home className="h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink to="/hospitaldashboard/trackingPatients" className={linkClasses}>
              <Users className="h-5 w-5" />
              Live Patients
            </NavLink>
              <NavLink to="/hospitaldashboard/confirmPatients" className={linkClasses}>
              <Users className="h-5 w-5" />
              Patients
            </NavLink>
            {/* <NavLink to="/home/notifications" className={linkClasses}>
              <Bell className="h-5 w-5" />
              Notifications
            </NavLink>
            <NavLink to="/home/settings" className={linkClasses}>
              <Settings className="h-5 w-5" />
              Settings
            </NavLink> */}
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
