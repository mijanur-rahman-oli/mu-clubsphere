import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import {
  Users,
  Building2,
  UserCheck,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AdminStatistics = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch clubs
  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ['admin-clubs'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/clubs');
      return data;
    },
  });

  // Fetch all bookings (platform-wide)
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-all-bookings'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/admin/bookings');
      return data;
    },
  });

  // Fetch all users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/users');
      return data;
    },
  });

  if (clubsLoading || bookingsLoading || usersLoading) {
    return <LoadingSpinner />;
  }

  // Calculations
  const totalMembers = users.filter(u => u.role !== 'admin').length;
  const totalManagers = users.filter(u => u.role === 'manager').length;
  const totalClubs = clubs.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const totalBookings = bookings.length;

  // Date calculations
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  // New members this month
  const newMembersThisMonth = users.filter(
    u => new Date(u.created_at || u.createdAt) >= thisMonthStart
  ).length;

  // New members last month
  const newMembersLastMonth = users.filter(
    u => {
      const created = new Date(u.created_at || u.createdAt);
      return created >= lastMonthStart && created <= lastMonthEnd;
    }
  ).length;

  // Calculate growth percentages
  const memberGrowth = newMembersLastMonth > 0 
    ? ((newMembersThisMonth - newMembersLastMonth) / newMembersLastMonth * 100).toFixed(1)
    : 100;

  // Bookings this month vs last month
  const bookingsThisMonth = bookings.filter(
    b => new Date(b.created_at || b.createdAt) >= thisMonthStart
  ).length;

  const bookingsLastMonth = bookings.filter(
    b => {
      const created = new Date(b.created_at || b.createdAt);
      return created >= lastMonthStart && created <= lastMonthEnd;
    }
  ).length;

  const bookingGrowth = bookingsLastMonth > 0
    ? ((bookingsThisMonth - bookingsLastMonth) / bookingsLastMonth * 100).toFixed(1)
    : 100;

  // Revenue this month vs last month
  const revenueThisMonth = bookings
    .filter(b => new Date(b.created_at || b.createdAt) >= thisMonthStart)
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const revenueLastMonth = bookings
    .filter(b => {
      const created = new Date(b.created_at || b.createdAt);
      return created >= lastMonthStart && created <= lastMonthEnd;
    })
    .reduce((sum, b) => sum + (b.price || 0), 0);

  const revenueGrowth = revenueLastMonth > 0
    ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100).toFixed(1)
    : 100;

  // Prepare data for bar chart: Bookings per club
  const clubBookingData = clubs.map(club => {
    const clubBookings = bookings.filter(b => b.clubId === club._id.toString());
    return {
      name: club.name.length > 15 ? club.name.slice(0, 12) + '...' : club.name,
      fullName: club.name,
      bookings: clubBookings.length,
      revenue: clubBookings.reduce((sum, b) => sum + (b.price || 0), 0),
    };
  }).sort((a, b) => b.bookings - a.bookings).slice(0, 10);

  // Monthly trend data (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    
    const monthBookings = bookings.filter(b => {
      const date = new Date(b.created_at || b.createdAt);
      return date >= monthDate && date < nextMonth;
    });

    const monthRevenue = monthBookings.reduce((sum, b) => sum + (b.price || 0), 0);

    monthlyData.push({
      month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
      bookings: monthBookings.length,
      revenue: monthRevenue,
    });
  }

  // Club distribution by category (if available)
  const categoryData = clubs.reduce((acc, club) => {
    const category = club.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const StatCard = ({ icon: Icon, title, value, subtitle, change, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`${color} p-3 rounded-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            parseFloat(change) >= 0 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {parseFloat(change) >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(parseFloat(change))}%
          </div>
        )}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-2">{payload[0]?.payload?.fullName || label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-gray-600">
              <span className="font-medium">{entry.name}:</span>{' '}
              {entry.name === 'revenue' ? `$${entry.value.toFixed(2)}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-blue-100 text-lg">
                Platform Analytics & Performance Overview
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">{now.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subtitle={`$${revenueThisMonth.toFixed(2)} this month`}
            change={revenueGrowth}
            color="bg-emerald-500"
          />
          <StatCard
            icon={Activity}
            title="Total Bookings"
            value={totalBookings.toLocaleString()}
            subtitle={`${bookingsThisMonth} this month`}
            change={bookingGrowth}
            color="bg-blue-500"
          />
          <StatCard
            icon={Users}
            title="Total Members"
            value={totalMembers.toLocaleString()}
            subtitle={`+${newMembersThisMonth} this month`}
            change={memberGrowth}
            color="bg-purple-500"
          />
          <StatCard
            icon={Building2}
            title="Active Clubs"
            value={totalClubs}
            subtitle={`${totalManagers} managers`}
            color="bg-orange-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Monthly Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Revenue & Bookings Trend</h2>
              <p className="text-sm text-gray-500 mt-1">Last 6 months performance</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Bookings"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Club Categories Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Club Categories</h2>
              <p className="text-sm text-gray-500 mt-1">Distribution by type</p>
            </div>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {pieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-gray-700">{entry.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-12">No category data</p>
            )}
          </div>
        </div>

        {/* Top Performing Clubs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Performing Clubs</h2>
            <p className="text-sm text-gray-500 mt-1">Ranked by total memberships</p>
          </div>
          {clubBookingData.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No booking data available yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={clubBookingData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="bookings" 
                  fill="#3b82f6" 
                  radius={[8, 8, 0, 0]} 
                  name="Members Joined"
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-blue-900">Growth Rate</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">{Math.abs(parseFloat(memberGrowth))}%</p>
            <p className="text-sm text-blue-700 mt-1">Monthly member growth</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-green-900">Avg. Revenue/Club</span>
            </div>
            <p className="text-3xl font-bold text-green-900">
              ${totalClubs > 0 ? (totalRevenue / totalClubs).toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-green-700 mt-1">Per club average</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500 p-3 rounded-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <span className="font-semibold text-purple-900">Avg. Members/Club</span>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {totalClubs > 0 ? Math.round(totalBookings / totalClubs) : 0}
            </p>
            <p className="text-sm text-purple-700 mt-1">Platform average</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStatistics;