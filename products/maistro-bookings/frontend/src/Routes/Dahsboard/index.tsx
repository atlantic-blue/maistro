import React, { useEffect, useState } from 'react';
import { AuthContext } from '@maistro/auth';
import {
  Calendar,
  Users,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Settings,
  Mail,
  Globe,
  Phone,
  MapPin,
  PawPrint,
} from 'lucide-react';

import env from '@/env';
import { Me, MeProfile } from '@/Api/Me';
import { MaistroUser, UserProfile } from './types';

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading, user } = React.useContext(AuthContext);

  const [me, setMe] = useState<Partial<MaistroUser>>({
    ProductAccess: {
      academy: false,
      bookings: false,
      chats: false,
      customers: false,
      funnels: false,
      socials: false,
      websites: false,
    },
  });
  const [meProfile, setMeProfile] = useState<Partial<UserProfile>>({
    BusinessType: [''],
    Services: [],
    Features: [],
  });

  const stats = {
    totalBookings: 0,
    upcomingBookings: 0,
    monthlyRevenue: 0,
    activeServices: meProfile.Services?.length,
  };

  useEffect(() => {
    if (!isAuthenticated || isLoading || !user) {
      return;
    }

    MeProfile(env.api.meProfile, user.getTokenAccess()).then((response) => {
      setMeProfile(response);
    });

    Me(env.api.me, user.getTokenAccess()).then((response) => {
      setMe(response);
    });
  }, [isAuthenticated, isLoading]);

  const bizType = meProfile?.BusinessType && meProfile?.BusinessType[0]?.replace('-', ' ');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Welcome back, {me.FirstName}! 👋
            </h1>
            <p className="text-gray-600">Manage your bookings and grow your {bizType} business</p>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      <div className="mb-6 space-y-3">
        {!me.EmailVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 flex-wrap">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-amber-800 font-medium">Verify your email address</p>
              <p className="text-amber-600 text-sm">
                Please check your inbox and verify {me.Email} to secure your account
              </p>
            </div>
            <button className="px-3 py-1.5 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 transition-colors">
              Resend Email
            </button>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-blue-800 font-medium">Onboarding completed! 🎉</p>
            <p className="text-blue-600 text-sm">
              Your {meProfile.BusinessName} profile is set up and ready to accept bookings
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-primary-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-primary mt-1">{stats.totalBookings}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">All time bookings</p>
        </div>

        <div className="bg-primary-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Upcoming</p>
              <p className="text-2xl font-bold text-primary mt-1">{stats.upcomingBookings}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">Next 7 days</p>
        </div>

        <div className="bg-primary-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Monthly Revenue</p>
              <p className="text-2xl font-bold text-primary mt-1">£{stats.monthlyRevenue}</p>
            </div>
            <div className="p-3 bg-accent-orange-light rounded-lg">
              <DollarSign className="w-6 h-6 text-accent-orange" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">This month</p>
        </div>

        <div className="bg-primary-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Services</p>
              <p className="text-2xl font-bold text-primary mt-1">{stats.activeServices}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-2">Available for booking</p>
        </div>
      </div>

      {/* Services & Quick Actions */}
      <div className="lg:col-span-2 space-y-6">
        {/* Business Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-primary-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Business Profile</h3>
              <button className="text-accent-orange hover:text-accent-orange-dark">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-primary text-lg">{meProfile.BusinessName}</h4>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                  {bizType}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <a
                    href={meProfile.Website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-orange hover:underline"
                  >
                    {meProfile.Website}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{meProfile.Phone}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{meProfile.Address}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Team size: {meProfile.TeamSize}</span>
                </div>

                {meProfile.Features?.includes('Acepta mascotas') && (
                  <div className="flex items-center gap-2 text-green-600">
                    <PawPrint className="w-4 h-4" />
                    <span>Pet-friendly</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm">{meProfile.Description}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-primary-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-primary mb-4">Quick Actions</h3>

          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Calendar className="w-6 h-6 text-accent-orange mb-2" />
              <h4 className="font-medium text-primary">View Calendar</h4>
              <p className="text-gray-600 text-sm">Manage your booking schedule</p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="font-medium text-primary">Customer List</h4>
              <p className="text-gray-600 text-sm">View and manage clients</p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Settings className="w-6 h-6 text-purple-600 mb-2" />
              <h4 className="font-medium text-primary">Booking Settings</h4>
              <p className="text-gray-600 text-sm">Configure availability & rules</p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Mail className="w-6 h-6 text-green-600 mb-2" />
              <h4 className="font-medium text-primary">Notifications</h4>
              <p className="text-gray-600 text-sm">Set up email reminders</p>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section with Product Access */}
      <div className="mt-8 bg-primary-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-primary mb-4">Your Maistro Products</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(me.ProductAccess || {}).map(([product, hasAccess]) => (
            <div
              key={product}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                hasAccess ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span className="capitalize">{product}</span>
              {hasAccess && <span className="ml-1">✓</span>}
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-sm mt-3">
          {me.SubscriptionTier} plan •
          <button className="text-accent-orange hover:underline ml-1">
            Upgrade to unlock all features
          </button>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
