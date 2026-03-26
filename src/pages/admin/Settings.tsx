import React, { useState } from 'react';
import { Mail, Lock, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/admin/Toast';

export default function Settings() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState(user?.email || '');
  const [emailLoading, setEmailLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === user?.email) {
      showToast('This is already your current email.', 'info');
      return;
    }

    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      
      showToast('Confirmation emails have been sent to both your old and new email addresses. Please verify to complete the update.', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to update email.', 'error');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (error) throw error;
      
      showToast('Password updated successfully.', 'success');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      showToast(error.message || 'Failed to update password.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your admin account credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Update Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-[#0A1F44] flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#FF6B35]" />
              Update Email Address
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Changing your email will require verification.
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0A1F44] text-white rounded-xl font-medium hover:bg-[#0A1F44]/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {emailLoading ? 'Sending...' : 'Update Email'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Password Update Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-bold text-[#0A1F44] flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#FF6B35]" />
              Update Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Ensure your account is using a long, random password.
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0A1F44] text-white rounded-xl font-medium hover:bg-[#0A1F44]/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
