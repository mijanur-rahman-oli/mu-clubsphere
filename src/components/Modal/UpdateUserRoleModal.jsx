import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const UpdateUserRoleModal = ({ isOpen, closeModal, user, refetch }) => {
  const [updatedRole, setUpdatedRole] = useState(user?.role || 'customer')
  const axiosSecure = useAxiosSecure()

  const { mutate: updateRole, isPending } = useMutation({
    mutationFn: async (roleData) => {
      const { data } = await axiosSecure.patch('/update-role', roleData)
      return data
    },
    onSuccess: () => {
      toast.success('User role updated successfully!')
      refetch()
      closeModal()
    },
    onError: (error) => {
      console.error('Update role error:', error)
      toast.error(error.response?.data?.error || 'Failed to update user role')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (updatedRole === user?.role) {
      toast.error('Please select a different role')
      return
    }

    updateRole({
      email: user?.email,
      role: updatedRole
    })
  }

  return (
    <>
      <Dialog
        open={isOpen}
        as='div'
        className='relative z-10 focus:outline-none'
        onClose={closeModal}
      >
        <div className='fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <DialogPanel
              transition
              className='w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl'
            >
              <DialogTitle
                as='h3'
                className='text-base/7 font-medium text-black'
              >
                Update User Role
              </DialogTitle>
              
              <div className='mt-2 mb-4'>
                <p className='text-sm text-gray-600'>
                  User: <span className='font-medium'>{user?.email}</span>
                </p>
                <p className='text-sm text-gray-600'>
                  Current Role: <span className='font-medium capitalize'>{user?.role}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor='role' className='block text-sm font-medium text-gray-700 mb-2'>
                    Select New Role
                  </label>
                  <select
                    value={updatedRole}
                    onChange={e => setUpdatedRole(e.target.value)}
                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500'
                    name='role'
                    id='role'
                    disabled={isPending}
                  >
                    <option value='member'>Member</option>
                    <option value='manager'>Manager</option>
                    <option value='admin'>Admin</option>
                  </select>
                </div>
                <div className='flex mt-6 justify-around gap-2'>
                  <button
                    type='submit'
                    disabled={isPending}
                    className='cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isPending ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    type='button'
                    disabled={isPending}
                    className='cursor-pointer inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default UpdateUserRoleModal