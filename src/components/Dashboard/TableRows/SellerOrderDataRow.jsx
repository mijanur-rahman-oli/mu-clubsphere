import { useState } from 'react'
import UpdateOrderModal from '../../Modal/UpdateOrderModal'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const SellerOrderDataRow = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false)
  const closeModal = () => setIsOpen(false)
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure()

  // Update order status mutation
  const { mutateAsync: updateOrderStatus, isPending } = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const { data } = await axiosSecure.patch(
        `/orders/${orderId}`,
        { status }
      )
      return data
    },
    onSuccess: () => {
      toast.success('Order status updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['manage-orders'] })
      closeModal()
    },
    onError: (error) => {
      console.error('Error updating order:', error)
      toast.error(error.response?.data?.error || 'Failed to update order')
      closeModal()
    }
  })

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateOrderStatus({ orderId: order._id, status: newStatus })
    } catch (error) {
      console.error('Update error:', error)
    }
  }

  // Add safety checks for order data
  if (!order) {
    console.error('Order data is missing')
    return null
  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center'>
          <div className='shrink-0'>
            <div className='block relative'>
              <img
                alt={order.name || 'product'}
                src={order.image || 'https://i.ibb.co.com/rMHmQP2/money-plant-in-feng-shui-brings-luck.jpg'}
                className='mx-auto object-cover rounded h-10 w-15'
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150'
                }}
              />
            </div>
          </div>
        </div>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 font-medium'>{order.name || 'N/A'}</p>
        <p className='text-gray-600 text-xs'>{order.category || 'N/A'}</p>
      </td>
      
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center'>
          <div className='shrink-0 h-8 w-8'>
            <img
              className='h-8 w-8 rounded-full object-cover'
              src={order.customer?.image || 'https://via.placeholder.com/150'}
              alt={order.customer?.name || 'Customer'}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150'
              }}
            />
          </div>
          <div className='ml-3'>
            <p className='text-gray-900 whitespace-no-wrap font-medium'>
              {order.customer?.name || 'Unknown'}
            </p>
            <p className='text-gray-600 text-xs whitespace-no-wrap'>
              {order.customer?.email || 'N/A'}
            </p>
          </div>
        </div>
      </td>
      
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 font-semibold'>
          ${order.price ? order.price.toFixed(2) : '0.00'}
        </p>
      </td>

      
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
          order.status === 'completed' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
        </span>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <button
          onClick={() => setIsOpen(true)}
          disabled={order.status === 'cancelled' || order.status === 'completed' || isPending}
          className='relative disabled:cursor-not-allowed cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight disabled:opacity-50 hover:bg-green-50 transition-colors rounded-full'
        >
          <span className='absolute cursor-pointer inset-0 bg-green-200 opacity-50 rounded-full'></span>
          <span className='relative cursor-pointer'>Update</span>
        </button>

        <UpdateOrderModal 
          isOpen={isOpen} 
          closeModal={closeModal}
          currentStatus={order.status}
          handleUpdate={handleUpdateStatus}
          isPending={isPending}
        />
      </td>
    </tr>
  )
}

export default SellerOrderDataRow