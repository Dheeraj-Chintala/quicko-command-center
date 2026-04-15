import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="brutal-card p-8 text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-heading font-bold text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user && isAdmin) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

export default Index;
