import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user && isAdmin) navigate('/dashboard', { replace: true });
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-3 brutal-card p-6 bg-card">
            <img
              src="/Quicko-app-logo.png"
              alt="Quicko"
              className="h-24 w-auto max-w-[200px] object-contain"
              width={200}
              height={96}
            />
            <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">
              QUICKO
            </h1>
          </div>
          <p className="mt-4 text-sm font-heading font-semibold text-muted-foreground uppercase tracking-widest">
            Admin Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="brutal-card p-8">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
            Sign In
          </h2>

          {error && (
            <div className="brutal-border bg-destructive/10 p-3 mb-4 flex items-center gap-2 rounded-sm">
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-destructive">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-heading font-bold text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@quicko.com"
                className="w-full h-11 px-3 brutal-input rounded-sm text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-heading font-bold text-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full h-11 px-3 brutal-input rounded-sm text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-body">
          Admin access only · Unauthorized users will be signed out
        </p>
      </div>
    </div>
  );
};

export default Login;
