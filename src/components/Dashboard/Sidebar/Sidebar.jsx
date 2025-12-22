import { useState } from 'react'
import { Link } from 'react-router'
import useAuth from '../../../hooks/useAuth'
import logo from '../../../assets/images/logo-flat.png'
import { GrLogout } from 'react-icons/gr'
import { FcSettings } from 'react-icons/fc'
import { AiOutlineBars } from 'react-icons/ai'
import { BsGraphUp } from 'react-icons/bs'
import { X } from 'lucide-react'

import MenuItem from './Menu/MenuItem'
import AdminMenu from './Menu/AdminMenu'
import SellerMenu from './Menu/SellerMenu'
import CustomerMenu from './Menu/CustomerMenu'
import useRole from '../../../hooks/useRole'
import LoadingSpinner from '../../Shared/LoadingSpinner'

const Sidebar = () => {
  const { logOut, user } = useAuth()
  const [isActive, setActive] = useState(false)
  const [role, isRoleLoading] = useRole()

  const handleToggle = () => {
    setActive(!isActive)
  }

  if (isRoleLoading) return <LoadingSpinner />

  const roleLabels = {
    admin: 'Administrator',
    manager: 'Club Manager',
    member: 'Member'
  }

  return (
    <>
      {/* Mobile Header */}
      <div className='bg-white shadow-sm text-gray-800 flex justify-between items-center md:hidden sticky top-0 z-50'>
        <div className='p-4'>
          <Link to='/'>
            <img src={logo} alt='logo' className='h-8 w-auto' />
          </Link>
        </div>

        <button
          onClick={handleToggle}
          className='p-4 hover:bg-gray-100 rounded-lg transition-colors'
          aria-label='Toggle menu'
        >
          <AiOutlineBars className='h-6 w-6 text-gray-700' />
        </button>
      </div>

      {/* Mobile Overlay */}
      {!isActive && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
          onClick={handleToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`z-40 fixed flex flex-col bg-white shadow-xl w-72 h-screen px-4 py-6 inset-y-0 left-0 transform ${
          isActive ? '-translate-x-full' : 'translate-x-0'
        } md:translate-x-0 transition-transform duration-300 ease-in-out border-r border-gray-200`}
      >
        <div className='flex flex-col h-full'>
          {/* Header Section */}
          <div>
            {/* Logo & Close Button */}
            <div className='flex items-center justify-between mb-6'>
              <Link to='/' className='block'>
                <img src={logo} alt='logo' className='h-12 w-auto' />
              </Link>

              <button
                onClick={handleToggle}
                className='md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
                aria-label='Close menu'
              >
                <X className='h-5 w-5 text-gray-600' />
              </button>
            </div>

            {/* User Profile Card */}
            {user && (
              <div className='bg-gradient-to-r from-lime-50 to-green-50 rounded-xl p-4 mb-6 border border-lime-200'>
                <div className='flex items-center gap-3'>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt='User'
                      className='w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover'
                    />
                  ) : (
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-sm'>
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-gray-900 truncate text-sm'>
                      {user.displayName || 'User'}
                    </p>
                    <span className='inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-700 border border-lime-200 mt-1'>
                      {roleLabels[role] || role}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className='h-px bg-gray-200 mb-4'></div>
          </div>

          {/* Navigation Menu */}
          <div className='flex-1 overflow-y-auto'>
            <nav className='space-y-1'>
              {/* Overview Menu Item */}
              <MenuItem
                icon={BsGraphUp}
                label='Overview'
                address='/dashboard'
              />

              {/* Role-Based Menu */}
              {role === 'member' && <CustomerMenu />}
              {role === 'manager' && <SellerMenu />}
              {role === 'admin' && <AdminMenu />}
            </nav>
          </div>

          {/* Bottom Section */}
          <div className='pt-4 border-t border-gray-200 space-y-1'>
            <MenuItem
              icon={FcSettings}
              label='Profile'
              address='/dashboard/profile'
            />
            
            <button
              onClick={logOut}
              className='flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200'
            >
              <GrLogout className='w-5 h-5' />
              <span className='ml-4 font-medium'>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar