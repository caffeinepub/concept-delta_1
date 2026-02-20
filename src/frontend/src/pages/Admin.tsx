import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Admin() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    // Redirect unauthenticated users to home
    if (!isAuthenticated) {
      navigate({ to: '/' });
      return;
    }

    // Redirect non-admin users to dashboard
    if (role !== 'admin') {
      navigate({ to: '/dashboard' });
      return;
    }
  }, [isAuthenticated, role, navigate]);

  // Don't render content if not authenticated or not admin
  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold text-brand-navy">Admin</h1>
      <p className="text-muted-foreground">Admin page - Coming soon</p>
    </div>
  );
}
