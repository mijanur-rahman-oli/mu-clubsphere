import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Container from '../Shared/Container'
import LoadingSpinner from '../Shared/LoadingSpinner'
import { Link } from 'react-router'
import { toast } from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import { getAuth } from 'firebase/auth'
import {
  Users,
  Bookmark,
  BookmarkCheck,
  Tag,
  ArrowRight
} from 'lucide-react'
import { useState } from 'react'

const Clubs = () => {
  const queryClient = useQueryClient()
  const { user, loading: authLoading } = useAuth()
  const auth = getAuth()
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Fetch all clubs
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const result = await axios.get(`${import.meta.env.VITE_API_URL}/clubs`)
      return result.data
    },
  })

  // Fetch bookmarks for current user
  const { data: clubBookmarks = [] } = useQuery({
    queryKey: ['club-bookmarks', user?.email],
    enabled: !!user && !authLoading,
    queryFn: async () => {
      const token = await auth.currentUser.getIdToken()
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/my-club-bookmarks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return res.data
    }
  })

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async ({ clubId, action }) => {
      if (!user) {
        throw new Error('Please login to bookmark clubs')
      }

      const token = await auth.currentUser.getIdToken()
      const url = `${import.meta.env.VITE_API_URL}/clubs/${clubId}/bookmark`

      if (action === 'add') {
        const res = await axios.post(url, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        return res.data
      } else {
        const res = await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` }
        })
        return res.data
      }
    },
    onSuccess: (data, variables) => {
      toast.success(variables.action === 'add' ? 'Added to wishlist!' : 'Removed from wishlist!')
      queryClient.invalidateQueries(['club-bookmarks'])
    },
    onError: (err) => {
      console.error('Bookmark error:', err)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Bookmark action failed'
      toast.error(errorMsg)
    }
  })

  const handleBookmark = (clubId, isBookmarked, e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Please login to bookmark clubs')
      return
    }

    bookmarkMutation.mutate({
      clubId,
      action: isBookmarked ? 'remove' : 'add'
    })
  }

  // Get unique categories
  const categories = ['all', ...new Set(clubs.map(club => club.category))]

  // Filter clubs
  const filteredClubs = clubs.filter(club => {
    const categoryMatch = selectedCategory === 'all' || club.category === selectedCategory

    if (filterStatus === 'wishlist') {
      return categoryMatch && clubBookmarks.some(b => b.clubId === club._id)
    }
    return categoryMatch
  })

  // Calculate statistics
  const totalClubs = clubs.length
  const bookmarkedCount = clubBookmarks.length

  if (isLoading || authLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100  py-20 md:py-24">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-lime-500 to-green-600 rounded-xl mb-3 shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Clubs</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and join clubs that match your interests and passion
          </p>
        </div>

        {/* Unified Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Left: Categories */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 text-gray-500 shrink-0">
                <Tag className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Categories</span>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {categories.map(category => {
                  const count = category === 'all'
                    ? clubs.length
                    : clubs.filter(c => c.category === category).length

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${selectedCategory === category
                          ? 'bg-lime-500 border-lime-500 text-white shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-lime-500 hover:text-lime-600'
                        }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                      <span className={`ml-2 text-xs ${selectedCategory === category ? 'text-lime-100' : 'text-gray-400'}`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right: Wishlist Toggle */}
            <div className="flex shrink-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
              <button
                onClick={() => setFilterStatus(filterStatus === 'wishlist' ? 'all' : 'wishlist')}
                className={`w-full md:w-auto px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border-2 ${filterStatus === 'wishlist'
                    ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-sm'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-rose-200 hover:text-rose-500'
                  }`}
              >
                {filterStatus === 'wishlist' ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                Wishlist ({bookmarkedCount})
              </button>
            </div>

          </div>
        </div>
        {/* Clubs Grid */}
        {filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-12">
            {filteredClubs.map((club) => {
              const isBookmarked = clubBookmarks.some(b => b.clubId === club._id)

              return (
                <Link
                  key={club._id}
                  to={`/club/${club._id}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  {/* Club Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => handleBookmark(club._id, isBookmarked, e)}
                      disabled={bookmarkMutation.isLoading}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all active:scale-95 z-10"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-pink-600 fill-pink-600" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-gray-600 hover:text-pink-600 transition-colors" />
                      )}
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-lime-500 text-white text-xs font-bold rounded-full shadow-md">
                        {club.category}
                      </span>
                    </div>
                  </div>

                  {/* Club Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-lime-600 transition-colors">
                      {club.name}
                    </h2>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                      {club.description}
                    </p>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Membership Fee</p>
                        <p className="text-2xl font-bold text-lime-600">
                          ${club.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-lime-600 font-semibold text-sm group-hover:gap-3 transition-all">
                        View
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-5">
              {filterStatus === 'wishlist' ? (
                <Bookmark className="w-8 h-8 text-gray-400" />
              ) : (
                <Users className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filterStatus === 'wishlist' ? 'No Bookmarked Clubs' : 'No Clubs Found'}
            </h3>
            <p className="text-gray-600 mb-5">
              {filterStatus === 'wishlist'
                ? 'Start bookmarking clubs you\'re interested in!'
                : selectedCategory !== 'all'
                  ? `No clubs found in the "${selectedCategory}" category.`
                  : 'Check back later for new clubs.'}
            </p>
            {(filterStatus === 'wishlist' || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setFilterStatus('all')
                  setSelectedCategory('all')
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-lime-500 to-green-600 text-white font-semibold rounded-xl hover:from-lime-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
              >
                View All Clubs
              </button>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

export default Clubs