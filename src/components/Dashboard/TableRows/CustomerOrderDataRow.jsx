import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const CustomerOrderDataRow = ({ order }) => {
  const axiosSecure = useAxiosSecure()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const closeModal = () => setIsOpen(false)

  // Cancel order
  const { mutateAsync: cancelOrder, isLoading } = useMutation({
    mutationFn: async (orderId) => {
      const { data } = await axiosSecure.delete(`/orders/${orderId}`)
      return data
    },
    onSuccess: () => {
      toast.success('Order cancelled successfully!')
      queryClient.invalidateQueries({ queryKey: ['my-orders'] })
      closeModal()
    },
    onError: (error) => {
      console.error(error)
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          'Failed to cancel order'
      )
      closeModal()
    },
  })

  const handleCancelOrder = async () => {
    await cancelOrder(order._id)
  }

  return (
    <tr>
      {/* Image */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <img
            alt={order.name || 'product'}
            src={
              order.image ||
              'https://i.ibb.co/rMHmQP2/money-plant-in-feng-shui-brings-luck.jpg'
            }
            className="mx-auto object-cover rounded h-10 w-14"
          />
        </div>
      </td>

      {/* Name */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900">{order.name}</p>
      </td>

      {/* Category */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900">{order.category}</p>
      </td>

      {/* Price */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900">${order.price}</p>
      </td>

      {/* Status */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            order.status === 'confirmed'
              ? 'bg-green-100 text-green-800'
              : order.status === 'cancelled'
              ? 'bg-red-100 text-red-800'
              : order.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
        </span>
      </td>

      {/* Action */}
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <button
          onClick={() => setIsOpen(true)}
          disabled={
            order.status === 'completed' ||
            order.status === 'cancelled' ||
            isLoading
          }
          className="relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-red-900 leading-tight disabled:opacity-50"
        >
          <span className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
          <span className="relative">
            {isLoading ? 'Cancelling...' : 'Cancel'}
          </span>
        </button>

        <DeleteModal
          isOpen={isOpen}
          closeModal={closeModal}
          handleDelete={handleCancelOrder}
        />
      </td>
    </tr>
  )
}

export default CustomerOrderDataRow
