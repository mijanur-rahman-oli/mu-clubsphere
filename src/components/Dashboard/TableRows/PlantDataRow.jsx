import { useState } from 'react'
import DeleteModal from '../../Modal/DeleteModal'
import UpdatePlantModal from '../../Modal/UpdatePlantModal'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const PlantDataRow = ({ club }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  // Delete club mutation
  const { mutateAsync: deleteClub } = useMutation({
    mutationFn: async (clubId) => {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/clubs/${clubId}`
      )
      return data
    },
    onSuccess: () => {
      toast.success('Club deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['my-inventory'] })
      closeModal()
    },
    onError: (error) => {
      console.error('Error deleting club:', error)
      toast.error(error.response?.data?.error || 'Failed to delete club')
      closeModal()
    }
  })

  const handleDeleteClub = async () => {
    try {
      await deleteClub(club._id)
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  return (
    <tr>
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <div className='flex items-center'>
          <div className='shrink-0'>
            <div className='block relative'>
              <img
                alt={club.name || 'club'}
                src={club.image || 'https://i.ibb.co.com/rMHmQP2/money-plant-in-feng-shui-brings-luck.jpg'}
                className='mx-auto object-cover rounded h-10 w-15'
              />
            </div>
          </div>
        </div>
      </td>
      
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 font-medium'>{club.name}</p>
      </td>
      
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900'>{club.category}</p>
      </td>
      
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900 font-semibold'>${club.price}</p>
      </td>
      
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <p className='text-gray-900'>{club.quantity || 'N/A'}</p>
      </td>

      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <span
          onClick={openModal}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-red-900 leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
          ></span>
          <span className='relative'>Delete</span>
        </span>
        
        <DeleteModal 
          isOpen={isOpen} 
          closeModal={closeModal}
          handleDelete={handleDeleteClub}
        />
      </td>
      
      <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
        <span
          onClick={() => setIsEditModalOpen(true)}
          className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
        >
          <span
            aria-hidden='true'
            className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
          ></span>
          <span className='relative'>Update</span>
        </span>
        
        <UpdatePlantModal
          isOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          club={club}
        />
      </td>
    </tr>
  )
}

export default PlantDataRow