import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { imageUpload } from '../../utils'

const UpdatePlantModal = ({ isOpen, setIsEditModalOpen, club }) => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  // Reset form data when club changes or modal opens
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    location: '',
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  // Reset form when modal opens with new club
  useEffect(() => {
    if (isOpen && club) {
      setFormData({
        name: club.name || '',
        category: club.category || '',
        price: club.price || '',
        quantity: club.quantity || '',
        description: club.description || '',
        location: club.location || '',
      })
      setImagePreview(club.image || null)
      setImageFile(null)
    }
  }, [isOpen, club])

  const closeModal = () => {
    setIsEditModalOpen(false)
    // Reset form when closing
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      description: '',
      location: '',
    })
    setImagePreview(null)
    setImageFile(null)
  }

  // Update club mutation
  const { mutateAsync: updateClub } = useMutation({
    mutationFn: async (clubData) => {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/clubs/${club?._id}`,
        clubData
      )
      return data
    },
    onSuccess: () => {
      toast.success('Club updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['my-inventory'] })
      closeModal()
    },
    onError: (error) => {
      console.error('Error updating club:', error)
      toast.error(error.response?.data?.error || 'Failed to update club')
      setLoading(false)
    }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!club?._id) {
      toast.error('Club ID not found')
      return
    }

    setLoading(true)

    try {
      let imageUrl = club.image

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await imageUpload(imageFile)
      }

      const clubData = {
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0,
      }

      await updateClub(clubData)
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update club')
    } finally {
      setLoading(false)
    }
  }

  // Don't render if no club selected
  if (!isOpen || !club) return null

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={closeModal}>
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
              <Dialog.Panel className='w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900 mb-4'
                >
                  Update Club: {club.name}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className='space-y-4'>
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className='flex justify-center'>
                      <img
                        src={imagePreview}
                        alt='Preview'
                        className='h-32 w-32 object-cover rounded-lg shadow-md'
                      />
                    </div>
                  )}

                  {/* Image Upload */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Club Image (optional)
                    </label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      className='mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100'
                    />
                  </div>

                  {/* Club Name */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Club Name *
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border'
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Category *
                    </label>
                    <select
                      name='category'
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border'
                    >
                      <option value=''>Select Category</option>
                      <option value='Sports'>Sports</option>
                      <option value='Social'>Social</option>
                      <option value='Cultural'>Cultural</option>
                      <option value='Debating'>Debating</option>
                    </select>
                  </div>

                  {/* Price and Quantity */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Price ($) *
                      </label>
                      <input
                        type='number'
                        name='price'
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min='0'
                        step='0.01'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Quantity
                      </label>
                      <input
                        type='number'
                        name='quantity'
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min='0'
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border'
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Location
                    </label>
                    <input
                      type='text'
                      name='location'
                      value={formData.location}
                      onChange={handleInputChange}
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border'
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Description
                    </label>
                    <textarea
                      name='description'
                      value={formData.description}
                      onChange={handleInputChange}
                      rows='3'
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-3 border resize-vertical'
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-3 mt-8 pt-4 border-t'>
                    <button
                      type='submit'
                      disabled={loading}
                      className='flex-1 inline-flex justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    >
                      {loading ? (
                        <span className='flex items-center gap-2'>
                          <svg className='animate-spin h-4 w-4' fill='none' viewBox='0 0 24 24'>
                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        'Update Club'
                      )}
                    </button>
                    <button
                      type='button'
                      onClick={closeModal}
                      disabled={loading}
                      className='flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50 transition-colors'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default UpdatePlantModal