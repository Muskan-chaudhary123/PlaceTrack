import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await signup(fullName, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link to="/" className="inline-block mb-6">
          <Logo iconSize={24} fontSize="text-2xl" />
        </Link>
        <h2 className="text-center text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-950">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-slate-600">
          Start organizing your placement journey.
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

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

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
                  placeholder="e.g. john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm sm:text-base">
            <span className="text-slate-600">Already have an account? </span>
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
