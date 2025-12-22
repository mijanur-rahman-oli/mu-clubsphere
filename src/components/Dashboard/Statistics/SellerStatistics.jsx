import { useQuery } from '@tanstack/react-query'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle,
  UserPlus,
  Activity,
  AlertCircle,
  BarChart3,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Eye,
  Award,
  Zap
} from 'lucide-react'

const SellerStatistics = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  
  // Fetch manager statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['manager-statistics', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/manager/statistics')
      return data
    },
    enabled: !!user?.email
  })

  // Fetch managed clubs
  const { data: managedClubs = [] } = useQuery({
    queryKey: ['managed-clubs', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/manager/clubs')
      return data
    },
    enabled: !!user?.email
  })

  // Fetch upcoming events
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['manager-events', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/manager/upcoming-events')
      return data
    },
    enabled: !!user?.email
  })

  // Fetch pending requests
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pending-requests', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/manager/pending-requests')
      return data
    },
    enabled: !!user?.email
  })

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, alert, badge }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 relative group">
      {alert && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="relative">
            <span className="flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex items-center justify-center rounded-full h-6 w-6 bg-red-500 text-white text-xs font-bold">
                {badge || '!'}
              </span>
            </span>
          </div>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className={`${color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            trend > 0 ? 'bg-green-50 text-green-700' : 
            trend < 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
          }`}>
            {trend > 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : trend < 0 ? (
              <ArrowDownRight className="w-3 h-3" />
            ) : null}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  )

  const QuickActionCard = ({ icon: Icon, title, count, color, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-lime-500 hover:shadow-lg transition-all duration-300 text-left w-full group"
    >
      <div className="flex items-center gap-4">
        <div className={`${color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
        </div>
        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-lime-600 transition-colors" />
      </div>
    </button>
  )

  const PerformanceMetric = ({ icon: Icon, value, label, color }) => (
    <div className={`${color} rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <Icon className="w-10 h-10 mx-auto mb-3 text-white opacity-90" />
      <p className="text-3xl font-bold text-white mb-1">{value}%</p>
      <p className="text-sm text-white opacity-90 font-medium">{label}</p>
    </div>
  )

  if (isLoading) return <LoadingSpinner />

  const hasPendingItems = (stats?.pendingRequests || 0) > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-lime-600 to-green-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Club Manager Dashboard</h1>
              <p className="text-lime-100 text-lg">
                Welcome back, {user?.displayName || 'Manager'}
              </p>
              <p className="text-lime-200 text-sm mt-1">
                Manage {stats?.totalClubs || 0} clubs • {stats?.totalMembers || 0} members
              </p>
            </div>
            {hasPendingItems && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-white animate-pulse" />
                  <div>
                    <p className="text-sm text-lime-100">Action Required</p>
                    <p className="text-xl font-bold">{stats?.pendingRequests} pending</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Total Members"
            value={stats?.totalMembers || 0}
            subtitle={`Across ${stats?.totalClubs || 0} clubs`}
            color="bg-blue-500"
            trend={stats?.membersTrend}
          />
          <StatCard
            icon={UserPlus}
            title="New Members"
            value={stats?.newMembersThisMonth || 0}
            subtitle="This month"
            color="bg-purple-500"
            trend={stats?.newMembersTrend}
          />
          <StatCard
            icon={Calendar}
            title="Active Events"
            value={stats?.activeEvents || 0}
            subtitle={`${stats?.upcomingEvents || 0} upcoming`}
            color="bg-green-500"
          />
          <StatCard
            icon={AlertCircle}
            title="Pending Requests"
            value={stats?.pendingRequests || 0}
            subtitle="Requires attention"
            color="bg-orange-500"
            alert={stats?.pendingRequests > 0}
            badge={stats?.pendingRequests}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-lime-600" />
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard
              icon={Eye}
              title="Managed Clubs"
              count={managedClubs.length}
              color="bg-blue-500"
              onClick={() => {/* Navigate to clubs */}}
            />
            <QuickActionCard
              icon={Calendar}
              title="Upcoming Events"
              count={upcomingEvents.length}
              color="bg-green-500"
              onClick={() => {/* Navigate to events */}}
            />
            <QuickActionCard
              icon={Bell}
              title="Pending Requests"
              count={pendingRequests.length}
              color="bg-orange-500"
              onClick={() => {/* Navigate to requests */}}
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Performance Overview */}
          {stats?.performanceData && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-lime-600" />
                <h2 className="text-xl font-bold text-gray-900">Performance Overview</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <PerformanceMetric
                  icon={TrendingUp}
                  value={stats.performanceData.memberGrowth}
                  label="Member Growth"
                  color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <PerformanceMetric
                  icon={Activity}
                  value={stats.performanceData.eventSuccess}
                  label="Event Success Rate"
                  color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <PerformanceMetric
                  icon={Award}
                  value={stats.performanceData.engagement}
                  label="Member Engagement"
                  color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
              </div>
            </div>
          )}

          {/* Additional Statistics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-lime-600" />
              <h2 className="text-xl font-bold text-gray-900">Activity Metrics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-5 border border-indigo-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-indigo-500 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-indigo-900">Attendance</span>
                </div>
                <p className="text-3xl font-bold text-indigo-900">
                  {stats?.averageAttendance || 0}%
                </p>
                <p className="text-xs text-indigo-600 mt-1">Average rate</p>
                {stats?.attendanceTrend !== undefined && (
                  <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${
                    stats.attendanceTrend > 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {stats.attendanceTrend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(stats.attendanceTrend)}% vs last period
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-5 border border-teal-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-teal-500 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-teal-900">Growth</span>
                </div>
                <p className="text-3xl font-bold text-teal-900">
                  {stats?.growthRate || 0}%
                </p>
                <p className="text-xs text-teal-600 mt-1">Last 30 days</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 border border-pink-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-pink-500 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-pink-900">Event Hours</span>
                </div>
                <p className="text-3xl font-bold text-pink-900">
                  {stats?.totalEventHours || 0}
                </p>
                <p className="text-xs text-pink-600 mt-1">This semester</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-500 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-900">Completion</span>
                </div>
                <p className="text-3xl font-bold text-emerald-900">
                  {stats?.eventCompletionRate || 0}%
                </p>
                <p className="text-xs text-emerald-600 mt-1">Events completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Banner */}
        <div className="bg-gradient-to-r from-lime-500 to-green-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Performance Summary</h3>
              <p className="text-lime-50 text-sm leading-relaxed">
                {stats?.newMembersThisMonth > 0 
                  ? `Great work! You've gained ${stats.newMembersThisMonth} new members this month.`
                  : 'Focus on member recruitment to grow your clubs.'
                } {stats?.pendingRequests > 0 
                  ? ` You have ${stats.pendingRequests} pending request${stats.pendingRequests > 1 ? 's' : ''} that need${stats.pendingRequests === 1 ? 's' : ''} your attention.`
                  : ' All requests are up to date!'
                }
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SellerStatistics