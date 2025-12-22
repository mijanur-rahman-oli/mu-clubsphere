import { NavLink } from 'react-router'

const MenuItem = ({ label, address, icon: Icon, isCollapsed }) => {
  return (
    <NavLink
      to={address}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-3 my-1 transition-all duration-200 rounded-xl group relative ${
          isActive
            ? 'bg-gradient-to-r from-lime-500 to-green-600 text-white shadow-lg shadow-lime-500/30'
            : 'text-gray-700 hover:bg-gray-100 hover:text-lime-600'
        } ${isCollapsed ? 'justify-center' : ''}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              isActive ? 'text-white' : 'text-gray-600 group-hover:text-lime-600'
            }`}
          />

          {!isCollapsed && (
            <span className='mx-4 font-medium text-sm'>{label}</span>
          )}

          {/* Active Indicator */}
          {isActive && !isCollapsed && (
            <div className='ml-auto'>
              <div className='w-2 h-2 rounded-full bg-white'></div>
            </div>
          )}

          {/* Tooltip for Collapsed State */}
          {isCollapsed && (
            <div className='absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl'>
              {label}
              <div className='absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45'></div>
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

export default MenuItem