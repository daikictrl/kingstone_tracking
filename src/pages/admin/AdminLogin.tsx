import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Globe, Plane, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, session, loading: authLoading } = useAuth();

  // If already logged in, redirect
  if (!authLoading && session) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError('Invalid email or password');
      } else {
        navigate('/admin/dashboard');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1F44] via-[#0d2a5c] to-[#0A1F44] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 text-white mb-4 relative">
            <Globe className="h-14 w-14" strokeWidth={1.2} />
            <Plane className="h-6 w-6 absolute -top-1 -right-2 transform rotate-45 fill-current" />
          </div>
          <h2 className="text-white text-2xl font-bold tracking-wider">Diane Dollar</h2>
          <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-[#0A1F44] mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to access the admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors text-sm outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-[#FF6B35]/20 disabled:opacity-70 disabled:cursor-not-allowed text-sm tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          &copy; {new Date().getFullYear()} Diane Dollar Logistics. Admin Access Only.
        </p>
      </div>
    </div>
  );
}
