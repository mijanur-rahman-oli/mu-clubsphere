import { FaUserCog } from 'react-icons/fa'
import MenuItem from './MenuItem'
import { GrUserManager } from 'react-icons/gr'
import { MdManageHistory, MdPayment } from 'react-icons/md'

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={FaUserCog} label='Manage Members' address='manage-members' />
      <MenuItem icon={GrUserManager} label='Manager Requests' address='manager-requests' />
      <MenuItem icon={MdManageHistory} label='Manage Clubs' address='manage-clubs' />
      <MenuItem icon={MdPayment} label='View Payments' address='view-payments' />
      

    </>
  )
}

export default AdminMenu
