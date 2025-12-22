import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

const UpdateOrderModal = ({ isOpen, closeModal, currentStatus, handleUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmed', color: 'text-green-600' },
    { value: 'processing', label: 'Processing', color: 'text-blue-600' },
    { value: 'completed', label: 'Completed', color: 'text-purple-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' }
  ]

  const handleSubmit = () => {
    handleUpdate(selectedStatus)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Update Order Status
                </Dialog.Title>
                
                <div className='mt-4'>
                  <p className='text-sm text-gray-500 mb-4'>
                    Select the new status for this order:
                  </p>
                  
                  <div className='space-y-2'>
                    {statusOptions.map((option) => (
                      <label
                        key={option.value}
                        className='flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
                      >
                        <input
                          type='radio'
                          name='status'
                          value={option.value}
                          checked={selectedStatus === option.value}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className='mr-3 h-4 w-4'
                        />
                        <span className={`font-medium ${option.color}`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className='mt-6 flex gap-3'>
                  <button
                    type='button'
                    className='flex-1 inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
                    onClick={handleSubmit}
                  >
                    Update Status
                  </button>
                  <button
                    type='button'
                    className='flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2'
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default UpdateOrderModal