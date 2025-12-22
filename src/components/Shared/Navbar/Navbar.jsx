import Container from '../Container'
import { AiOutlineMenu } from 'react-icons/ai'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import useAuth from '../../../hooks/useAuth'
import avatarImg from '../../../assets/images/placeholder.jpg'
import logo from '../../../assets/images/logo-flat.png'

const Navbar = () => {
  const { user, logOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Helper function to check if route is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className='fixed w-full bg-white z-50 shadow-sm'>
      <div className='py-4'>
        <Container>
          <div className='flex flex-row items-center justify-between gap-3 md:gap-0'>
            {/* Logo */}
            <Link to='/'>
              <img src={logo} alt='logo' width='100' height='100' />
            </Link>

            {/* Public Navigation Links - Desktop */}
            <nav className='hidden md:flex items-center gap-6'>
              <Link
                to='/'
                className={`text-sm font-semibold hover:text-neutral-600 transition ${
                  isActive('/') ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`}
              >
                Home
              </Link>
              <Link
                to='/club'
                className={`text-sm font-semibold hover:text-neutral-600 transition ${
                  isActive('/club') ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`}
              >
                Clubs
              </Link>
              <Link
                to='/event'
                className={`text-sm font-semibold hover:text-neutral-600 transition ${
                  isActive('/event') ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`}
              >
                Events
              </Link>
            </nav>

            {/* Dropdown Menu */}
            <div className='relative'>
              <div className='flex flex-row items-center gap-3'>
                {/* Dropdown btn */}
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className='p-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
                >
                  <AiOutlineMenu />
                  <div className='hidden md:block'>
                    {/* Avatar */}
                    <img
                      className='rounded-full'
                      referrerPolicy='no-referrer'
                      src={user && user.photoURL ? user.photoURL : avatarImg}
                      alt='profile'
                      height='30'
                      width='30'
                    />
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className='absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-white overflow-hidden right-0 top-12 text-sm'>
                  <div className='flex flex-col cursor-pointer'>
                    {/* Mobile Navigation Links */}
                    <Link
                      to='/'
                      className={`block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold ${
                        isActive('/') ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      Home
                    </Link>
                    <Link
                      to='/club'
                      className={`block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold ${
                        isActive('/club') ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      Clubs
                    </Link>
                    <Link
                      to='/event'
                      className={`block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold ${
                        isActive('/event') ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      Events
                    </Link>

                    {user ? (
                      <>
                        <Link
                          to='/dashboard/profile'
                          className={`px-4 py-3 hover:bg-neutral-100 transition font-semibold ${
                            isActive('/dashboard/profile') ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                        >
                          Profile
                        </Link>
                        <Link
                          to='/dashboard'
                          className={`px-4 py-3 hover:bg-neutral-100 transition font-semibold ${
                            isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                        >
                          Dashboard
                        </Link>
                        <div
                          onClick={logOut}
                          className='px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer'
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          to='/login'
                          className={`px-4 py-3 hover:bg-neutral-100 transition font-semibold ${
                            isActive('/login') ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                        >
                          Login
                        </Link>
                        <Link
                          to='/signup'
                          className={`px-4 py-3 hover:bg-neutral-100 transition font-semibold ${
                            isActive('/signup') ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navbar