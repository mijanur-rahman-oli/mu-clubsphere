import { useQuery } from '@tanstack/react-query'
import useAuth from '../../../hooks/useAuth'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import useAxiosSecure from '../../../hooks/useAxiosSecure'

const Transactions = () => {
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure()

  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['transactions', user?.email],
    queryFn: async () => {
      try {
        const result = await axiosSecure.get('/payment-history') // or '/transactions'
        return result.data
      } catch (err) {
        // Treat 404 as empty transactions list
        if (err.response?.status === 404) {
          return []
        }
        throw err
      }
    },
    enabled: !!user?.email && !!user?.accessToken,
  })

  console.log('Transactions - Payments:', payments)
  console.log('Transactions - Loading:', isLoading)
  console.log('Transactions - Error:', error)

  if (isLoading) return <LoadingSpinner />

  if (error && error.response?.status !== 404) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        Failed to load transactions. Please try again later.
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-8">
        <div className="py-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Transactions
          </h2>

          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th scope="col" className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                      Amount
                    </th>
                    <th scope="col" className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                      Type
                    </th>
                    <th scope="col" className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                      Club / Event
                    </th>
                    <th scope="col" className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                      Date
                    </th>
                    <th scope="col" className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-5 py-10 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 font-semibold">${payment.amount}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {payment.type}
                          </span>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-600">
                            {payment.clubName || payment.eventTitle || '-'}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-600">{payment.date}</p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              ['Completed', 'Success'].includes(payment.status)
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
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

export default Transactions