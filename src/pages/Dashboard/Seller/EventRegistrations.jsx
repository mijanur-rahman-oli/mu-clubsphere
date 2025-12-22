import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const EventRegistrations = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: registrations = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['manager-all-registrations'],
    queryFn: async () => {
      const res = await axiosSecure.get('/manager/all-registrations');
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ regId, newStatus }) => {
      await axiosSecure.patch(`/manager/registration/${regId}/status`, {
        status: newStatus,
      });
    },
    onSuccess: () => {
      toast.success('Registration status updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['manager-all-registrations'] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to update registration status'
      );
    },
  });

  const handleStatusChange = (regId, newStatus) => {
    const action = newStatus === 'confirmed' ? 'approve' : 'reject';
    if (window.confirm(`Are you sure you want to ${action} this registration?`)) {
      updateStatusMutation.mutate({ regId, newStatus });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getActionContent = (reg) => {
    if (reg.status === 'registered') {
      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleStatusChange(reg._id, 'confirmed')}
            disabled={updateStatusMutation.isPending}
            className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
          >
            Approve
          </button>
          <button
            onClick={() => handleStatusChange(reg._id, 'rejected')}
            disabled={updateStatusMutation.isPending}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm"
          >
            Reject
          </button>
        </div>
      );
    }

    if (reg.status === 'confirmed') {
      return (
        <span className="inline-flex items-center px-5 py-2.5 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Accepted
        </span>
      );
    }

    if (reg.status === 'rejected') {
      return (
        <span className="inline-flex items-center px-5 py-2.5 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          Rejected
        </span>
      );
    }

    return null;
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">Error loading registrations</p>
          <p className="text-red-600 text-sm mt-2">
            {error?.response?.data?.message || error?.message || 'Something went wrong'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Event Registrations</h2>
        <p className="text-gray-600 mt-2">
          Total registrations: <span className="font-semibold">{registrations.length}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left py-5 px-6">#</th>
                <th className="text-left py-5 px-6">Member</th>
                <th className="text-left py-5 px-6">Club</th>
                <th className="text-left py-5 px-6">Event</th>
                <th className="text-left py-5 px-6">Status</th>
                <th className="text-left py-5 px-6">Registered On</th>
                <th className="text-left py-5 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-20 text-gray-500 text-lg">
                    No event registrations found for your clubs yet.
                  </td>
                </tr>
              ) : (
                registrations.map((reg, index) => (
                  <tr
                    key={reg._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="py-5 px-6 text-gray-700">{index + 1}</td>

                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{reg.userName}</p>
                          <p className="text-sm text-gray-500">{reg.userEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-5 px-6">
                      <span className="font-medium text-blue-700">{reg.clubName}</span>
                    </td>

                    <td className="py-5 px-6 text-gray-800">{reg.eventTitle}</td>

                    <td className="py-5 px-6">
                      <span
                        className={`inline-flex px-4 py-2 rounded-full text-xs font-semibold tracking-wide ${
                          reg.status === 'registered'
                            ? 'bg-yellow-100 text-yellow-800'
                            : reg.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : reg.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                      </span>
                    </td>

                    <td className="py-5 px-6 text-gray-600">
                      {formatDate(reg.registeredAt)}
                    </td>

                    {/* Conditional Action Column */}
                    <td className="py-5 px-6">
                      {getActionContent(reg)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrations;