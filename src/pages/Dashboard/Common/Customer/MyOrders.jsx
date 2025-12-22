import { useQuery } from '@tanstack/react-query'
import CustomerOrderDataRow from '../../../components/Dashboard/TableRows/CustomerOrderDataRow'
import useAuth from '../../../hooks/useAuth'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const MyOrders = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()
  
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['my-orders', user?.email],
    queryFn: async () => {
      const result = await axiosSecure.get('/my-orders')
      return result.data
    },
    enabled: !!user?.email && !!user?.accessToken,
  })

  console.log('MyOrders - Orders:', orders)
  console.log('MyOrders - Loading:', isLoading)
  console.log('MyOrders - Error:', error)

  if (isLoading) return <LoadingSpinner />
  
  return (
    <>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-8'>
          <h1 className='text-2xl font-semibold'>My Clubs</h1>
          <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
            <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
              <table className='min-w-full leading-normal'>
                <thead>
                  <tr>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                    >
                      Image
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                    >
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                    >
                      Category
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                    >
                      Entry Fee
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                    >
                      Status
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal'
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <CustomerOrderDataRow key={order._id} order={order} />
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

export default MyOrders