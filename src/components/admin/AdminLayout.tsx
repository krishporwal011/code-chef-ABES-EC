import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChefLogo } from '../brand/ChefLogo';
import { StampBadge } from '../brand/DoodleGraphics';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, logout, userEmail } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Route protection
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Control Room (Dashboard)', path: '/admin', icon: LayoutDashboard },
    { name: 'Train Scheduler (Events)', path: '/admin/events', icon: CalendarDays },
    { name: 'Passenger Manifest (Registrations)', path: '/admin/registrations', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F6EFE3] dark:bg-[#121110] text-[#1B1A17] dark:text-[#EDE6DA] paper-texture flex flex-col md:flex-row transition-colors">
      {/* Sidebar (Desktop) / Topbar (Mobile) */}
      <aside className="w-full md:w-64 bg-[#FFFDF9] dark:bg-[#1A1916] border-b md:border-b-0 md:border-r-2 border-[#DDD2C1] dark:border-[#38342D] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo & Station Master Badge */}
          <div>
            <Link to="/">
              <ChefLogo size="sm" />
            </Link>
            <div className="mt-3 flex items-center justify-between">
              <StampBadge label="STATION MASTER" variant="red" rotate="-2deg" />
              <span className="font-mono text-[10px] text-stone-500">v2.4</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2" aria-label="Control Room Menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    active
                      ? 'bg-tomato text-white shadow-sm'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="pt-6 border-t border-[#DDD2C1] dark:border-[#38342D] space-y-3 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-tomato/15 flex items-center justify-center text-tomato font-bold font-mono text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-mono text-stone-500 block uppercase">CHIEF DISPATCHER</span>
              <span className="text-xs font-mono font-bold truncate block text-ink-light dark:text-ink-dark">
                {userEmail || 'admin@codechef.abesec'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              to="/"
              className="flex-1 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-mono flex items-center justify-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 rounded-lg text-xs font-mono flex items-center justify-center gap-1 transition-colors"
              title="Logout from Control Room"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Control Room Canvas */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
