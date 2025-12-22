import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import useAuth from '../../hooks/useAuth'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router'

const PurchaseModal = ({ closeModal, isOpen, club }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { _id, name, category, price, description, image, seller } = club || {}

  const handlePayment = async () => {
    // 1. SILENT REDIRECT
    // If no user, send them to login. 
    // We pass the 'club' data in state so the login page knows what they were buying.
    if (!user) {
      return navigate('/login', { 
        state: { 
          from: location,
          purchaseIntent: club // Passing the data for immediate action after login
        } 
      })
    }

    // 2. STRIPE REDIRECT LOGIC
    try {
      const paymentInfo = {
        clubId: _id,
        name,
        category,
        price,
        description,
        image,
        quantity: 1,
        seller: {
          email: seller?.email || '',
          name: seller?.name || '',
          image: seller?.image || '',
        },
        customer: {
          name: user?.displayName || '',
          email: user?.email || '',
          image: user?.photoURL || '',
        },
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        paymentInfo
      )
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Payment error:', error)
    }
  }

  return (
    <Dialog open={isOpen} as='div' className='relative z-50' onClose={closeModal}>
      <div className='fixed inset-0 bg-black/40 backdrop-blur-sm' aria-hidden="true" />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogPanel className='w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl'>
            <DialogTitle as='h3' className='text-xl font-bold text-gray-900 text-center'>
              Confirm Purchase
            </DialogTitle>
            
            <div className='mt-6 space-y-3 border-t border-gray-100 pt-6'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Item</span>
                <span className='font-medium text-gray-900'>{name}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-500'>Total</span>
                <span className='font-bold text-gray-900'>${price}</span>
              </div>
            </div>

            <div className='flex flex-col gap-3 mt-8'>
              <button
                onClick={handlePayment}
                className='w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all'
              >
                {/* Visual cue: the button text changes but no annoying alerts */}
                {user ? 'Checkout with Stripe' : 'Login to Checkout'}
              </button>
              
              <button
                onClick={closeModal}
                className='w-full py-2 text-gray-400 text-sm hover:text-gray-600'
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default PurchaseModal