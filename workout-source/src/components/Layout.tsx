import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ExportImportModal } from './ExportImportModal';

const navItems = [
  { to: '/', label: 'Home', icon: HomeIcon, exact: true },
  { to: '/exercises', label: 'Exercises', icon: DumbbellIcon },
  { to: '/workout/new', label: 'Workout', icon: PlusCircleIcon },
  { to: '/stats', label: 'Stats', icon: ChartIcon },
];

export function Layout() {
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-indigo-600">Workout</span>
        <button
          onClick={() => setShowExport(true)}
          className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          title="Export / Import"
        >
          <ArrowsUpDownIcon />
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 flex">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-700'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      {showExport && <ExportImportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function DumbbellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h2m0 0V4m0 2v2m0-2h4m0 0V4m0 2v2m0-2h4m0 0V4m0 2v2M4 18h2m0 0v-2m0 2v2m0-2h4m0 0v-2m0 2v2m0-2h4m0 0v-2m0 2v2M2 12h20" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ArrowsUpDownIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}
