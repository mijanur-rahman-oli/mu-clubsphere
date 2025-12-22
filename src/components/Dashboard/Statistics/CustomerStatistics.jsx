import { useQuery } from '@tanstack/react-query'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Star,
  Activity,
  ArrowRight,
  Sparkles,
  Target,
  DollarSign
} from 'lucide-react'

const MemberStatistics = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  // Fetch member's bookings (their "joined events")
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['member-bookings', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/my-orders')
      return data
    },
    enabled: !!user?.email,
  })

  // Fetch unique clubs the member has joined
  const { data: joinedClubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ['member-joined-clubs', user?.email],
    queryFn: async () => {
      const uniqueClubIds = [...new Set(bookings.map(b => b.clubId))]
      const clubPromises = uniqueClubIds.map(id =>
        axiosSecure.get(`/clubs/${id}`).then(res => res.data)
      )
      const clubs = await Promise.all(clubPromises)
      return clubs.filter(Boolean)
    },
    enabled: !!user?.email && bookings.length > 0,
  })

  if (bookingsLoading || clubsLoading) return <LoadingSpinner />

  // Calculate real statistics
  const totalEventsBooked = bookings.length
  const upcomingEvents = bookings.filter(b => b.status === 'confirmed').length
  const completedEvents = bookings.filter(b => b.status === 'completed').length
  const attendanceRate = totalEventsBooked > 0 
    ? Math.round((completedEvents / totalEventsBooked) * 100) 
    : 0

  const totalSpent = bookings.reduce((sum, b) => sum + b.price, 0)
  const averagePerBooking = totalEventsBooked > 0 ? (totalSpent / totalEventsBooked).toFixed(2) : '0.00'

  // Calculate member level/tier based on activity
  const getMemberTier = () => {
    if (totalEventsBooked >= 20) return { name: 'Platinum', color: 'from-gray-400 to-gray-600', icon: '💎' }
    if (totalEventsBooked >= 10) return { name: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: '🏆' }
    if (totalEventsBooked >= 5) return { name: 'Silver', color: 'from-gray-300 to-gray-500', icon: '⭐' }
    return { name: 'Bronze', color: 'from-orange-400 to-orange-600', icon: '🌟' }
  }

  const memberTier = getMemberTier()

  // Recent activity (latest 5 bookings)
  const recentActivity = bookings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(booking => {
      const date = new Date(booking.createdAt)
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      return {
        title: booking.name,
        description: `Booked "${booking.name}" club session`,
        timestamp: formattedDate,
        status: booking.status,
      }
    })

  const StatCard = ({ icon: Icon, title, value, subtitle, color, gradient, badge }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient || color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`${color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {badge && (
            <span className="px-3 py-1 bg-lime-100 text-lime-700 text-xs font-bold rounded-full">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
      </div>
    </div>
  )

  const ClubCard = ({ club }) => (
    <div className="group bg-white rounded-xl border-2 border-gray-200 hover:border-lime-500 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-4">
        {club.image ? (
          <img
            src={club.image}
            alt={club.name}
            className="w-16 h-16 rounded-xl object-cover shadow-md group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
            <MapPin className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate group-hover:text-lime-600 transition-colors">
            {club.name}
          </p>
          <p className="text-sm text-gray-500">{club.category}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs text-gray-600 font-medium">Active Member</span>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-lime-600 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  )

  const ActivityItem = ({ activity, index }) => {
    const statusConfig = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: 'bg-green-500' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'bg-blue-500' },
      default: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'bg-gray-500' }
    }
    const config = statusConfig[activity.status] || statusConfig.default

    return (
      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
        <div className="relative">
          <div className={`${config.icon} p-2.5 rounded-lg shadow-sm`}>
            <Calendar className="w-5 h-5 text-white" />
          </div>
          {index < recentActivity.length - 1 && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-200"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 group-hover:text-lime-600 transition-colors">
            {activity.title}
          </p>
          <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-500">{activity.timestamp}</span>
            <span className={`${config.bg} ${config.text} px-2 py-0.5 rounded-full text-xs font-semibold`}>
              {activity.status}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header with Member Tier */}
        <div className="bg-gradient-to-r from-lime-600 to-green-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold">Member Dashboard</h1>
                  <div className={`bg-gradient-to-r ${memberTier.color} px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg`}>
                    <span className="text-xl">{memberTier.icon}</span>
                    <span className="text-sm font-bold text-white">{memberTier.name}</span>
                  </div>
                </div>
                <p className="text-lime-100 text-lg">
                  Welcome back, {user?.displayName || 'Member'}!
                </p>
                <p className="text-lime-200 text-sm mt-1">
                  {joinedClubs.length} clubs • {totalEventsBooked} bookings • {attendanceRate}% attendance
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-white" />
                  <p className="text-3xl font-bold">{attendanceRate}%</p>
                  <p className="text-sm text-lime-100">Attendance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Clubs Joined"
            value={joinedClubs.length}
            subtitle="Active memberships"
            color="bg-blue-500"
            gradient="from-blue-400 to-blue-600"
            badge={joinedClubs.length > 5 ? "Active!" : null}
          />
          <StatCard
            icon={Calendar}
            title="Total Bookings"
            value={totalEventsBooked}
            subtitle={`${upcomingEvents} upcoming • ${completedEvents} completed`}
            color="bg-green-500"
            gradient="from-green-400 to-green-600"
          />
          <StatCard
            icon={CheckCircle}
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            subtitle="Completed vs booked"
            color="bg-purple-500"
            gradient="from-purple-400 to-purple-600"
            badge={attendanceRate >= 80 ? "Excellent!" : null}
          />
          <StatCard
            icon={DollarSign}
            title="Total Spent"
            value={`$${totalSpent.toFixed(2)}`}
            subtitle={`$${averagePerBooking} avg per booking`}
            color="bg-orange-500"
            gradient="from-orange-400 to-orange-600"
          />
        </div>

        {/* Progress & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-lime-600" />
              <h3 className="font-bold text-gray-900">Next Milestone</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {memberTier.name === 'Bronze' ? 'Silver Member' : 
                     memberTier.name === 'Silver' ? 'Gold Member' :
                     memberTier.name === 'Gold' ? 'Platinum Member' : 'Max Level!'}
                  </span>
                  <span className="text-sm font-bold text-lime-600">
                    {memberTier.name === 'Platinum' ? '20/20' :
                     memberTier.name === 'Gold' ? `${totalEventsBooked}/20` :
                     memberTier.name === 'Silver' ? `${totalEventsBooked}/10` : `${totalEventsBooked}/5`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-lime-500 to-green-500 h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${memberTier.name === 'Platinum' ? 100 :
                               memberTier.name === 'Gold' ? (totalEventsBooked / 20) * 100 :
                               memberTier.name === 'Silver' ? (totalEventsBooked / 10) * 100 : 
                               (totalEventsBooked / 5) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {memberTier.name === 'Platinum' 
                  ? 'You\'ve reached the highest level! Keep up the great participation.' 
                  : `Complete ${memberTier.name === 'Gold' ? 20 - totalEventsBooked :
                                memberTier.name === 'Silver' ? 10 - totalEventsBooked : 
                                5 - totalEventsBooked} more bookings to unlock the next tier.`}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-blue-900">Engagement Score</h3>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-3">
                <span className="text-3xl font-bold text-blue-600">{attendanceRate}</span>
              </div>
              <p className="text-sm text-blue-700 font-medium">
                {attendanceRate >= 90 ? 'Outstanding!' :
                 attendanceRate >= 75 ? 'Great job!' :
                 attendanceRate >= 50 ? 'Keep it up!' : 'You can do better!'}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-purple-900">Achievements</h3>
            </div>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 p-2 rounded-lg ${totalEventsBooked >= 1 ? 'bg-white shadow-sm' : 'opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${totalEventsBooked >= 1 ? 'bg-lime-100' : 'bg-gray-200'}`}>
                  <span className="text-xl">{totalEventsBooked >= 1 ? '🎯' : '🔒'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">First Booking</p>
                  <p className="text-xs text-gray-600">Join your first club</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-2 rounded-lg ${totalEventsBooked >= 5 ? 'bg-white shadow-sm' : 'opacity-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${totalEventsBooked >= 5 ? 'bg-lime-100' : 'bg-gray-200'}`}>
                  <span className="text-xl">{totalEventsBooked >= 5 ? '⭐' : '🔒'}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Club Explorer</p>
                  <p className="text-xs text-gray-600">Join 5 clubs</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Joined Clubs */}
        {joinedClubs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-lime-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  My Clubs ({joinedClubs.length})
                </h2>
              </div>
              <button className="text-sm font-semibold text-lime-600 hover:text-lime-700 flex items-center gap-1 transition-colors">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedClubs.map(club => (
                <ClubCard key={club._id} club={club} />
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-lime-600" />
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            </div>
          </div>
          <div className="p-6">
            {recentActivity.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-2">No bookings yet</p>
                <p className="text-sm text-gray-500 mb-6">Start exploring clubs and join events!</p>
                <button className="px-6 py-3 bg-gradient-to-r from-lime-600 to-green-600 text-white font-semibold rounded-xl hover:from-lime-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl">
                  Explore Clubs
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((activity, i) => (
                  <ActivityItem key={i} activity={activity} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default MemberStatistics