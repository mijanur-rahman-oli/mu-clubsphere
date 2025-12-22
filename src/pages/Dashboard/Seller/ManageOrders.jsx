import { useQuery } from '@tanstack/react-query'
import SellerOrderDataRow from '../../../components/Dashboard/TableRows/SellerOrderDataRow'
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'

const ManageOrders = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['manage-orders', user?.email],
    queryFn: async () => {
      const result = await axiosSecure.get('/manage-orders')
      return result.data
    },
    enabled: !!user?.email && !!user?.accessToken,
  })

  console.log('ManageOrders - Orders:', orders)
  console.log('ManageOrders - Loading:', isLoading)
  console.log('ManageOrders - Error:', error)

  if (isLoading) return <LoadingSpinner />
  
  if (error) {
    return (
      <div className='container mx-auto px-4 sm:px-8 py-8'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-red-800 font-medium'>Error loading orders</p>
          <p className='text-red-600 text-sm mt-1'>{error.response?.data?.message || error.message}</p>
          {error.response?.status === 403 && (
            <p className='text-red-600 text-sm mt-2'>
              You need manager role to access this page. Your current role: {error.response?.data?.role}
            </p>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-8'>
          <div className='mb-4'>
            <h2 className='text-2xl font-semibold text-gray-800'>Manage Membership</h2>
            <p className='text-gray-600 text-sm mt-1'>Total orders: {orders.length}</p>
          </div>
          
          <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
            <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
              <table className='min-w-full leading-normal'>
                <thead>
                  <tr>
                    <th scope='col' className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'>
                      Image
                    </th>
                    <th scope='col' className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'>
                      Club Name
                    </th>
                    <th scope='col' className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'>
                      Customer
                    </th>
                    <th scope='col' className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'>
                      Price
                    </th>
                    <th scope='col' className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'>
                      Status
                    </th>
                    <th scope='col' className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                        No orders to manage
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <SellerOrderDataRow key={order._id} order={order} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManageOrders