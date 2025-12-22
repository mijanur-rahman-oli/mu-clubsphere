import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import UpdatePlantModal from '../../../components/Modal/UpdatePlantModal';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const MyInventory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const { data: clubs = [], isLoading, error } = useQuery({
    queryKey: ['my-inventory', user?.email],
    queryFn: async () => {
      const result = await axiosSecure.get('/my-inventory');
      return result.data;
    },
    enabled: !!user?.email,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (clubId) => {
      await axiosSecure.delete(`/clubs/${clubId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-inventory', user?.email]);
      toast.success('Club deleted successfully!');
    },
    onError: (err) => {
      const message = err.response?.data?.error || 'Failed to delete club';
      if (message.includes('booking') || message.includes('active')) {
        toast.error('Cannot delete club with active bookings. Cancel or complete them first.');
      } else {
        toast.error(message);
      }
    },
  });

  const openEditModal = (club) => {
    setSelectedClub(club);
    setIsEditModalOpen(true);
  };

  const handleDelete = (club) => {
    if (window.confirm(`Are you sure you want to delete "${club.name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(club._id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className='container mx-auto px-4 sm:px-8 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800 font-medium'>Error loading inventory</p>
          <p className='text-red-600 text-sm mt-1'>
            {error.response?.data?.message || error.message}
          </p>
          {error.response?.status === 403 && (
            <p className='text-red-600 text-sm mt-2'>
              You need manager role to access this page. Your current role: {error.response?.data?.role}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 sm:px-8 py-8'>
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold text-gray-800'>My Inventory</h2>
        <p className='text-gray-600 mt-2'>Total clubs: <span className='font-semibold'>{clubs.length}</span></p>
      </div>

      {clubs.length === 0 ? (
        <div className='text-center py-20'>
          <p className='text-xl text-gray-500'>No clubs in your inventory yet.</p>
          <p className='text-gray-400 mt-2'>Create your first club to get started!</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {clubs.map((club) => (
            <div
              key={club._id}
              className='bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col'
            >
              <div className='relative'>
                <img
                  src={club.image}
                  alt={club.name}
                  className='w-full h-56 object-cover'
                />
                <div className='absolute top-4 right-4'>
                  <span className='bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow'>
                    {club.category}
                  </span>
                </div>
              </div>

              <div className='p-6 flex flex-col flex-grow'>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>{club.name}</h3>
                <p className='text-3xl font-bold text-green-600 mb-6'>${club.price}</p>

                <div className='mt-auto space-y-3'>
                  <button
                    onClick={() => openEditModal(club)}
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition shadow-md hover:shadow-lg'
                  >
                    Update Club
                  </button>

                  <button
                    onClick={() => handleDelete(club)}
                    disabled={deleteMutation.isPending}
                    className='w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 rounded-lg transition shadow-md hover:shadow-lg flex items-center justify-center gap-2'
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Delete Club
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      <UpdatePlantModal
        isOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        club={selectedClub}
      />
    </div>
  );
};

export default MyInventory;