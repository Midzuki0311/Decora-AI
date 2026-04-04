import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Log in', path: '/login' },
  ];

  return (
    <header className="sticky top-0 z-1000 flex items-center justify-between px-12 py-3.5 bg-white border-b border-gray-200 shadow-sm">
      <Link to="/" className="flex items-center gap-2.5 no-underline cursor-pointer">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="6" fill="#1bbfb3"/>
          <path d="M18 8L28 18H24V26H12V18H8L18 8Z" fill="#fff"/>
          <rect x="15" y="20" width="6" height="6" rx="1" fill="#f5a623"/>
        </svg>
        <span className="text-xl font-bold text-gray-800">Decore</span>
      </Link>

      <button 
        className="hidden sm:block bg-none border-none cursor-pointer text-2xl text-gray-800"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`${menuOpen ? 'flex' : 'hidden'} absolute top-full left-0 right-0 bg-white flex-col p-5 border-b border-gray-200 shadow-lg sm:static sm:flex sm:flex-row sm:items-center sm:gap-7 sm:bg-transparent sm:border-none sm:p-0 sm:shadow-none`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`no-underline font-medium text-base transition-colors cursor-pointer relative ${
              isActive(link.path)
                ? 'text-teal-500'
                : 'text-gray-600 hover:text-teal-500'
            }`}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
            {isActive(link.path) && (
              <span className="absolute bottom-[-4px] left-0 right-0 h-0.75 bg-teal-500 rounded-sm"></span>
            )}
          </Link>
        ))}
        <Link
          to="/signup"
          className="bg-orange-500 text-white border-none px-6 py-2.5 rounded-full font-semibold text-base cursor-pointer no-underline transition-all hover:bg-orange-600 hover:scale-105 active:scale-95"
          onClick={() => setMenuOpen(false)}
        >
          Sign up
        </Link>
      </nav>
    </header>
  );
}
