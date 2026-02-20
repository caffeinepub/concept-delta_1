import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <nav className="border-b border-border bg-white dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Logo and brand name */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/generated/delta-logo.dim_200x80.png"
              alt="Delta Logo"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-brand-navy">Concept Delta</span>
          </Link>

          {/* Desktop navigation - Right side */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-foreground transition-colors hover:text-brand-navy"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-foreground transition-colors hover:text-brand-navy"
            >
              About
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
              onClick={() => handleNavigation('/dashboard')}
            >
              Login
            </Button>
          </div>

          {/* Mobile hamburger menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-brand-navy" />
            ) : (
              <Menu className="h-6 w-6 text-brand-navy" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-foreground transition-colors hover:text-brand-navy"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-foreground transition-colors hover:text-brand-navy"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
                onClick={() => handleNavigation('/dashboard')}
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
