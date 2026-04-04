import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-2 border-gray-200 px-12 py-7.5 flex items-center justify-between flex-wrap gap-5">
      <div className="flex gap-6">
        <Link to="/" className="no-underline text-gray-600 text-base font-medium cursor-pointer transition-colors hover:text-teal-500">
          Home
        </Link>
        <Link to="/privacy" className="no-underline text-gray-600 text-base font-medium cursor-pointer transition-colors hover:text-teal-500">
          Privacy
        </Link>
        <Link to="/contact" className="no-underline text-gray-600 text-base font-medium cursor-pointer transition-colors hover:text-teal-500">
          Contact
        </Link>
        <Link to="/links" className="no-underline text-gray-600 text-base font-medium cursor-pointer transition-colors hover:text-teal-500">
          Links
        </Link>
      </div>

      <div className="flex gap-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 text-2xl transition-all hover:text-teal-500 hover:scale-115">
          <Facebook size={24} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 text-2xl transition-all hover:text-teal-500 hover:scale-115">
          <Instagram size={24} />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-800 text-2xl transition-all hover:text-teal-500 hover:scale-115">
          <Youtube size={24} />
        </a>
      </div>

      <div className="text-right">
        <h4 className="text-base font-bold mb-1">Contact Info</h4>
        <p className="text-gray-600 text-sm">decore-info@gmail.com</p>
      </div>
    </footer>
  );
}
