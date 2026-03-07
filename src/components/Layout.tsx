import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import FocusRingIcon from '@/components/icons/FocusRingIcon';
import {
  LayoutDashboard,
  PenLine,
  FileBarChart,
  UserCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/entry', label: 'Daily Entry', icon: PenLine },
  { to: '/report', label: 'Daily Report', icon: FileBarChart },
  { to: '/account', label: 'Account', icon: UserCircle },
] as const;

export default function Layout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleSignOut = () => {
    signOut();
    // ProtectedRoute in App.tsx will automatically redirect to /login
    // when user becomes null — no imperative navigate needed
  };

  const sidebarContent = (mobile = false) => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 lg:px-6 ${mobile ? 'h-[56px] justify-between' : 'h-16'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[11px] bg-[#0a84ff] flex items-center justify-center shrink-0">
            <FocusRingIcon className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="text-[16px] font-semibold text-[var(--tx)] tracking-[-0.02em]">
            CalmOS
          </span>
        </div>
        {mobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--tx2)] hover:text-[var(--tx)] hover:bg-[var(--elev)] transition-colors tap-sm"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 pt-4">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 lg:py-[10px] text-[15px] lg:text-[14px] no-transition ${
                isActive
                  ? 'bg-[var(--elev)] text-[var(--tx)] font-medium'
                  : 'text-[var(--tx2)] hover:text-[var(--tx)] hover:bg-[var(--card-h)]'
              }`
            }
          >
            <Icon className="w-[18px] h-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 pb-4 lg:px-4 lg:pb-5">
        <div className="rounded-xl bg-[var(--elev)] p-3.5 lg:p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--tert)] flex items-center justify-center shrink-0">
              <span className="text-[13px] font-semibold text-[var(--tx2)]">
                {user?.email?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[var(--tx)] truncate">{user?.email}</p>
              <p className="text-[11px] text-[var(--tx2)]">Free Plan</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-[13px] text-[var(--tx2)] hover:text-[#ff453a] transition-colors mt-3 w-full py-1"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-[100dvh] bg-[var(--bg)] text-[var(--tx)] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-col border-r border-[var(--bd)] bg-[var(--bg)] shrink-0">
        {sidebarContent(false)}
      </aside>

      {/* Mobile Overlay + Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{ backgroundColor: 'var(--overlay)' }}
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[280px] max-w-[85vw] h-full bg-[var(--bg)] border-r border-[var(--bd)] flex flex-col animate-[slideIn_0.25s_ease-out]">
            {sidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between h-[52px] lg:h-14 px-4 lg:px-8 border-b border-[var(--bd)] backdrop-blur-xl shrink-0"
          style={{ backgroundColor: 'var(--header-bg)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[var(--tx2)] hover:text-[var(--tx)] hover:bg-[var(--elev)] transition-colors tap-sm"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 lg:hidden">
              <div className="w-7 h-7 rounded-lg bg-[#0a84ff] flex items-center justify-center">
                <FocusRingIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[14px] font-semibold text-[var(--tx)] tracking-[-0.01em]">CalmOS</span>
            </div>

            {/* Desktop breadcrumb */}
            <p className="hidden lg:block text-[14px] text-[var(--tx2)]">
              Mental Performance Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-[var(--card)] rounded-full px-3 py-1.5">
              <div className="w-[6px] h-[6px] rounded-full bg-[#30d158]" />
              <span className="text-[12px] text-[var(--tx2)]">Live</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg)] -webkit-overflow-scrolling-touch">
          <div className="p-4 lg:p-8 max-w-[1400px] mx-auto animate-fade-in pb-8 lg:pb-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
