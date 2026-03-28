import { Outlet, NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-on-surface pb-28">
      <Outlet />
      
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-nav rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-white/20 px-6 py-3 w-[90%] max-w-md flex justify-between items-center">
        <NavItem to="/app/home" icon="home" />
        <NavItem to="/app/create" icon="auto_awesome" />
        <NavItem to="/app/gallery" icon="collections" />
        <NavItem to="/app/profile" icon="person" />
      </nav>
    </div>
  );
}

function NavItem({ to, icon }: { to: string; icon: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 active:scale-90",
          isActive
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "text-outline hover:text-primary"
        )
      }
    >
      {({ isActive }) => (
        <span 
          className="material-symbols-outlined text-2xl" 
          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
        >
          {icon}
        </span>
      )}
    </NavLink>
  );
}
