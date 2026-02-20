import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, principalId, login, logout, isLoading, role } = useAuth();

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    login();
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const shortenPrincipal = (principal: string) => {
    if (principal.length <= 12) return principal;
    return `${principal.slice(0, 6)}...${principal.slice(-4)}`;
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
            {role === "admin" && (
              <Link
                to="/admin"
                className="text-sm font-medium text-foreground transition-colors hover:text-brand-navy"
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">
                    {principalId && shortenPrincipal(principalId)}
                  </span>
                  <span className="text-xs font-mono text-brand-navy">
                    Full: {principalId}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Login'}
              </Button>
            )}
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
              {role === "admin" && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-foreground transition-colors hover:text-brand-navy"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <div className="rounded-md bg-muted px-3 py-2">
                    <p className="text-xs text-muted-foreground">Principal ID</p>
                    <p className="text-sm font-medium text-foreground">
                      {principalId && shortenPrincipal(principalId)}
                    </p>
                    <p className="mt-2 text-xs font-mono text-brand-navy break-all">
                      Full: {principalId}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Login'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
