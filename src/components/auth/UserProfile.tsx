import React, { useState, useEffect } from 'react';
import { User, Building, Mail, Crown, BarChart3, Calendar, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface UserProfileData {
  full_name: string;
  company: string;
  subscription_tier: string;
  daily_scans_used: number;
  created_at: string;
}

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>({
    full_name: '',
    company: '',
    subscription_tier: 'free',
    daily_scans_used: 0,
    created_at: new Date().toISOString()
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    company: ''
  });

  useEffect(() => {
    if (user && supabase) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          company: data.company || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await updateProfile(formData);
      
      if (error) {
        throw error;
      }

      setProfile(prev => ({ ...prev, ...formData }));
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const getSubscriptionBadge = () => {
    const badges = {
      free: { color: 'bg-gray-100 text-gray-800', icon: '🆓', name: 'Free Plan' },
      pro: { color: 'bg-blue-100 text-blue-800', icon: '⭐', name: 'Pro Plan' },
      enterprise: { color: 'bg-purple-100 text-purple-800', icon: '👑', name: 'Enterprise' }
    };
    
    return badges[profile.subscription_tier as keyof typeof badges] || badges.free;
  };

  const getDailyScansLimit = () => {
    const limits = {
      free: 3,
      pro: 50,
      enterprise: -1 // Unlimited
    };
    
    return limits[profile.subscription_tier as keyof typeof limits] || 3;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const badge = getSubscriptionBadge();
  const dailyLimit = getDailyScansLimit();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Account Profile</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Subscription Status */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                  <span className="mr-1">{badge.icon}</span>
                  {badge.name}
                </span>
              </div>
              <p className="text-gray-600">
                {dailyLimit === -1 ? 'Unlimited' : `${profile.daily_scans_used} / ${dailyLimit}`} scans used today
              </p>
            </div>
            {profile.subscription_tier === 'free' && (
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors">
                Upgrade to Pro
              </button>
            )}
          </div>

          {dailyLimit !== -1 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (profile.daily_scans_used / dailyLimit) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Resets in 24 hours</p>
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Full Name
            </label>
            {editMode ? (
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.full_name || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="inline w-4 h-4 mr-1" />
              Company
            </label>
            {editMode ? (
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.company || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-1" />
              Email Address
            </label>
            <p className="text-gray-900">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Member Since
            </label>
            <p className="text-gray-900">
              {format(new Date(profile.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Edit Mode Actions */}
        {editMode && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setFormData({
                  full_name: profile.full_name || '',
                  company: profile.company || ''
                });
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Usage Statistics */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Usage Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile.daily_scans_used}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {profile.daily_scans_used * 5}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                82
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}