import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './Button';

/**
 * Navbar for the PlaceTrack landing page.
 */
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center">
            <Logo iconSize={20} fontSize="text-xl" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm sm:text-base font-medium text-slate-600 hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm sm:text-base font-medium text-slate-600 hover:text-primary transition-colors">
              How It Works
            </a>
            <Link to="/login" className="text-sm sm:text-base font-medium text-slate-600 hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white" id="mobile-menu">
          <div className="space-y-1 px-4 pt-2 pb-4">
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
            >
              How It Works
            </a>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
            >
              Login
            </Link>
            <div className="px-3 pt-3">
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
