import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { Trash2, Loader2, CheckCircle, XCircle, Edit3 } from 'lucide-react';
import UpdatePlantModal from '../../../components/Modal/UpdatePlantModal'; // Reuse existing modal

const ManageClubs = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const {
    data: clubs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-clubs'],
    queryFn: async () => {
      const res = await axiosSecure.get('/clubs');
      return res.data;
    },
  });

  // Status toggle mutation
  const updateClubStatusMutation = useMutation({
    mutationFn: async ({ clubId, status }) => {
      await axiosSecure.patch(`/clubs/${clubId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-clubs']);
      toast.success('Club status updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
    },
  });

  // Delete mutation
  const deleteClubMutation = useMutation({
    mutationFn: async (clubId) => {
      await axiosSecure.delete(`/clubs/${clubId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-clubs']);
      toast.success('Club deleted permanently by admin');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to delete club');
    },
  });

  const handleStatusToggle = (clubId, currentStatus) => {
    const newStatus = currentStatus === 'approved' ? 'rejected' : 'approved';
    const action = newStatus === 'approved' ? 'approve' : 'reject';

    if (window.confirm(`Are you sure you want to ${action} this club?`)) {
      updateClubStatusMutation.mutate({ clubId, status: newStatus });
    }
  };

  const handleDelete = (clubId, clubName) => {
    if (window.confirm(`PERMANENTLY delete "${clubName}"?\n\nAll data will be lost. This cannot be undone.`)) {
      deleteClubMutation.mutate(clubId);
    }
  };

  const openEditModal = (club) => {
    setSelectedClub(club);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClub(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="text-lg font-semibold">Failed to load clubs</p>
        <p className="mt-2">{error.message}</p>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-2xl">No clubs found in the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Manage Clubs</h2>
          <p className="text-gray-600 mt-1">
            Full admin control: approve, reject, edit, or delete clubs
          </p>
        </div>
        <div className="text-lg font-semibold text-gray-700">
          Total: <span className="text-2xl text-blue-600">{clubs.length}</span> clubs
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Club
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Manager
              </th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Current Status
              </th>
              <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Fee
              </th>
              <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Events
              </th>
              <th className="px-6 py-5 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clubs.map((club) => {
              const currentStatus = club.status || 'pending';
              const isApproved = currentStatus === 'approved';
              const isRejected = currentStatus === 'rejected';

              return (
                <tr key={club._id} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={club.image || 'https://via.placeholder.com/80'}
                        alt={club.name}
                        className="w-16 h-16 rounded-xl object-cover shadow-md"
                      />
                      <div>
                        <p className="text-lg font-bold text-gray-900">{club.name}</p>
                        <p className="text-sm text-gray-500">{club.category}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <p className="text-sm font-medium text-gray-900">
                      {club.seller?.email || 'N/A'}
                    </p>
                  </td>

                  <td className="px-6 py-6">
                    <span
                      className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-full ${
                        isApproved
                          ? 'bg-green-100 text-green-800'
                          : isRejected
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {isApproved && <CheckCircle size={18} />}
                      {isRejected && <XCircle size={18} />}
                      {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-6 text-center">
                    <p className="text-xl font-bold text-gray-900">
                      ${club.price || 0}
                    </p>
                  </td>

                  <td className="px-6 py-6 text-center text-lg font-semibold text-gray-700">
                    {club.membersCount || 0}
                  </td>

                  <td className="px-6 py-6 text-center text-lg font-semibold text-gray-700">
                    {club.eventsCount || 0}
                  </td>

                  <td className="px-6 py-6">
                    <div className="flex justify-center items-center gap-3">
                      {/* Edit Button - Always available for admin */}
                      <button
                        onClick={() => openEditModal(club)}
                        className="p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-lg transition"
                        title="Edit Club Details"
                      >
                        <Edit3 size={20} />
                      </button>

                      {/* Dynamic Approve/Reject Button */}
                      <button
                        onClick={() => handleStatusToggle(club._id, currentStatus)}
                        disabled={updateClubStatusMutation.isPending}
                        className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition flex items-center gap-2 ${
                          isApproved
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        } disabled:opacity-60`}
                      >
                        {updateClubStatusMutation.isPending ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : isApproved ? (
                          <>
                            <XCircle size={18} />
                            Reject
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Approve
                          </>
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(club._id, club.name)}
                        disabled={deleteClubMutation.isPending}
                        className="p-3 bg-red-700 hover:bg-red-800 text-white rounded-lg shadow-lg transition disabled:opacity-60"
                        title="Delete Club Permanently"
                      >
                        {deleteClubMutation.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Reusable Update Modal */}
      <UpdatePlantModal
        isOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        club={selectedClub}
        // Optional: Add onSuccess callback if you want extra refresh
        // onSuccess={() => queryClient.invalidateQueries(['admin-clubs'])}
      />
    </div>
  );
};

export default ManageClubs;