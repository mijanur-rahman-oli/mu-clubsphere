import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from "../../../hooks/useAxiosSecure"
import { format } from 'date-fns';

const ViewPayments = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: payments = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/bookings');
      return res.data;
    },
  });

  // Calculate total revenue
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.price, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg font-semibold">Failed to load payments</p>
        <p className="text-gray-600 mt-2">{error?.message || 'Something went wrong'}</p>
        {error?.response?.status === 401 && (
          <p className="text-orange-600 mt-4">Session expired. Please log in again.</p>
        )}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-xl">No payment transactions found yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 ml-10 ">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>
        <div className="text-sm text-gray-600">
          Total Revenue:{' '}
          <span className="font-bold text-lg text-green-600">${totalRevenue.toFixed(2)}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Club
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                {/* User Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-3">
                    <img
                      src={payment.customer?.image || 'https://via.placeholder.com/40'}
                      alt={payment.customer?.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {payment.customer?.name || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500">{payment.customer?.email}</div>
                    </div>
                  </div>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${payment.price}
                </td>

                {/* Type */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    membership
                  </span>
                </td>

                {/* Club */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <img
                      src={payment.image || 'https://via.placeholder.com/32'}
                      alt={payment.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span>{payment.name}</span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                </td>

               
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPayments;