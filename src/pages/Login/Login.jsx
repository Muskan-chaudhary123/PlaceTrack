import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Seed default credential for easy testing
  const seedDemoCredentials = () => {
    // If no users exist, seed one in localStorage
    const users = JSON.parse(localStorage.getItem('placetrack_users') || '[]');
    const demoUser = {
      id: 'demo-123',
      fullName: 'John Doe',
      email: 'demo@placetrack.com'
    };
    
    if (!users.some(u => u.email === demoUser.email)) {
      users.push(demoUser);
      localStorage.setItem('placetrack_users', JSON.stringify(users));
    }
    
    setEmail(demoUser.email);
    setPassword('demopassword123');
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link to="/" className="inline-block mb-6">
          <Logo iconSize={24} fontSize="text-2xl" />
        </Link>
        <h2 className="text-center text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-950">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-slate-600">
          Continue managing your placement journey.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow-sm border border-slate-200 rounded-lg sm:px-10">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="text-sm font-medium text-red-600">{error}</div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset is not implemented in this demo."); }} className="font-medium text-primary hover:text-primary-dark">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Login
              </Button>
            </div>
          </form>

          {/* Quick Demo Helper */}
          {/*<div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 font-semibold text-slate-400">Testing?</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={seedDemoCredentials}
                className="flex w-full justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
              >
                Fill Demo Credentials (demo@placetrack.com)
              </button>
            </div>
          </div>*/}

          <div className="mt-6 text-center text-sm sm:text-base">
            <span className="text-slate-600">Don't have an account? </span>
            <Link to="/signup" className="font-semibold text-primary hover:text-primary-dark">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
