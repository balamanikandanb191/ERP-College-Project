import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Successfully logged in! Redirecting to dashboard...', { duration: 3000 });
      setTimeout(() => {
        navigate('/admin');
      }, 500); // slight delay for better UX
    } else {
      toast.error(result.message || 'Login failed. Please check your credentials.', { duration: 4000 });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-40 w-72 h-72 bg-info/10 rounded-full blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-card mb-6 border border-border-color/50">
            <div className="bg-primary/10 p-3 rounded-xl">
              <GraduationCap className="text-primary h-10 w-10" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-text-main tracking-tight mb-2">
            Welcome Back
          </h2>
          <p className="text-base text-text-muted font-medium">
            Sign in to access the EduERP portal
          </p>
        </div>

        <div className="bg-white py-10 px-6 shadow-card sm:rounded-3xl sm:px-12 border border-border-color/40 backdrop-blur-xl relative">
          <form className="space-y-7" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-main mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11 py-3 text-base"
                  placeholder="you@college.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-main mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 py-3 text-base"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-border-color rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2.5 block text-sm font-medium text-text-muted cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base shadow-primary/25"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full">
                    Sign in to dashboard
                    <ArrowRight size={18} />
                  </div>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-text-muted">
              Don't have an account? <a href="#" className="font-semibold text-primary hover:text-primary-dark transition-colors">Contact IT Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
