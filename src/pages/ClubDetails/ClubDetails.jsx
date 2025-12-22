import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Tag,
  DollarSign,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Shield,
  Award,
  Share2,
  Users,
  Loader2,
} from 'lucide-react';
import Container from '../../components/Shared/Container';
import LoadingSpinner from '../../components/Shared/LoadingSpinner';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [joining, setJoining] = useState(false);

  // Fetch Club Data
  const { data: club = {}, isLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/clubs/${id}`);
      return data;
    },
  });

  // Fetch Bookmarks
  const { data: bookmarks = [] } = useQuery({
    queryKey: ['club-bookmarks', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const token = await getAuth().currentUser?.getIdToken();
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/my-club-bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
  });

  const isBookmarked = bookmarks.some(b => b.clubId === id);

  // Bookmark Mutation
  const { mutate: toggleBookmark } = useMutation({
    mutationFn: async () => {
      const token = await getAuth().currentUser?.getIdToken();
      const url = `${import.meta.env.VITE_API_URL}/clubs/${id}/bookmark`;
      return isBookmarked
        ? axios.delete(url, { headers: { Authorization: `Bearer ${token}` } })
        : axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['club-bookmarks']);
      toast.success(isBookmarked ? 'Removed from wishlist' : 'Added to wishlist');
    },
    onError: () => {
      toast.error('Please login to bookmark clubs');
    },
  });

  // Join Club Mutation
  const joinClubMutation = useMutation({
    mutationFn: async () => {
      const token = await getAuth().currentUser?.getIdToken();
      return axiosSecure.post(`/clubs/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success('Successfully joined the club!');
      // Optional: refetch club or user data
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to join club');
    },
  });

  // Handle Join Click
  const handleJoinClub = async () => {
    if (!user) {
      toast.error('Please login to join a club');
      return;
    }

    setJoining(true);

    try {
      if (club.price > 0) {
        // Paid club → Create Stripe Checkout Session
        const { data } = await axiosSecure.post('/create-checkout-session', {
          name: club.name,
          description: club.description,
          price: club.price,
          image: club.image,
          clubId: club._id,
          quantity: 1,
          customer: {
            name: user.displayName || 'Member',
            email: user.email,
            image: user.photoURL || '',
          },
          seller: {
            email: club.seller?.email || '',
            name: club.seller?.name || '',
            image: club.seller?.image || '',
          },
        });

        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        // Free club → Directly join
        await joinClubMutation.mutateAsync();
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (isLoading || authLoading) return <LoadingSpinner />;

  const { image, name, description, category, price, seller, createdAt } = club;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <Container>
        {/* Back Button */}
        <button
          onClick={() => navigate('/club')}
          className="flex items-center gap-2 text-gray-600 hover:text-lime-600 mb-6 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Clubs
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          {/* Image Side */}
          <div className="relative h-64 lg:h-auto">
            <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm shadow-md rounded-full text-xs font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-lime-600" /> {category}
              </span>
            </div>

            <button
              onClick={() => user ? toggleBookmark() : toast.error('Please login to bookmark')}
              className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5 text-pink-600 fill-pink-600" />
              ) : (
                <Bookmark className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Content Side */}
          <div className="p-6 lg:p-8 flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{name}</h1>
              <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
            </div>

            {/* Price Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
                    One-time Membership Fee
                  </p>
                  <p className="text-4xl font-extrabold text-green-900">
                    ${price > 0 ? price : 'Free'}
                  </p>
                </div>
                <div className="p-4 bg-green-600 rounded-2xl shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Manager Info */}
            <div className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 bg-gray-50 mb-8">
              {seller?.image ? (
                <img
                  src={seller.image}
                  className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
                  alt="Manager"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Managed By
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {seller?.name || seller?.email || 'Club Manager'}
                </p>
              </div>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-4">
              <button
                onClick={handleJoinClub}
                disabled={joining}
                className="w-full py-4 bg-gradient-to-r from-lime-500 to-green-600 text-white font-bold text-xl rounded-2xl hover:from-lime-600 hover:to-green-700 shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {joining ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Users className="w-6 h-6" />
                    {price > 0 ? 'Pay & Join Club' : 'Join Club for Free'}
                  </>
                )}
              </button>

              <button className="w-full py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share This Club
              </button>
            </div>

            {/* Created Date */}
            {createdAt && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-3 text-gray-500 text-sm">
                <Calendar className="w-5 h-5" />
                Established {new Date(createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ClubDetails;