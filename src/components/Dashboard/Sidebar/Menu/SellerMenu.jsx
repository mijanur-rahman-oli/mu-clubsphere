import { BsFillHouseAddFill, BsCalendarPlus, BsPeople } from 'react-icons/bs'
import { MdHomeWork, MdOutlineManageHistory } from 'react-icons/md'
import MenuItem from './MenuItem'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../Shared/LoadingSpinner'


const SellerMenu = () => {
  const axiosSecure = useAxiosSecure()

  // Fetch the clubs managed by this user
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['manager-clubs-menu'],
    queryFn: async () => {
      const res = await axiosSecure.get('/manager/clubs')
      return res.data
    },
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <>
      <MenuItem icon={BsFillHouseAddFill} label='Add Club' address='add-club' />
      <MenuItem icon={MdHomeWork} label='My Inventory' address='my-inventory' />
      <MenuItem icon={MdOutlineManageHistory} label='Manage Membership' address='manage-orders' />
      <MenuItem icon={BsCalendarPlus} label='Manage Events' address='manage-events' />

   <MenuItem
  icon={BsPeople}
  label='Event Registrations'
  address='event-registrations' 
/>
    </>
  )
}

export default SellerMenu