import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AiOutlineMenu, 
  AiOutlineUser, 
  AiOutlineDashboard,
  AiOutlineLogout,
  AiOutlineHome,
  AiOutlineTeam,
  AiOutlineCalendar,
  AiOutlineInfoCircle
} from 'react-icons/ai'
import { ChevronDown, Sparkles } from 'lucide-react'
import useAuth from '../../../hooks/useAuth'
import Container from '../Container'
import avatarImg from '../../../assets/images/placeholder.jpg'
import logo from '../../../assets/images/logo-flat.png'

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: AiOutlineHome },
  { to: '/club', label: 'Clubs', icon: AiOutlineTeam },
  { to: '/event', label: 'Events', icon: AiOutlineCalendar },
  { to: '/about', label: 'About', icon: AiOutlineInfoCircle },
]

const Navbar = () => {
  const { user, logOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && 
          buttonRef.current && !buttonRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -8,
      transition: { duration: 0.15 }
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.header 
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg' 
          : 'bg-white/95 backdrop-blur-sm'
      } border-b ${
        isScrolled 
          ? 'border-gray-200/50' 
          : 'border-gray-100'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container>
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="relative">
              <img
                src={logo}
                alt="ClubSphere"
                className="h-8 w-auto md:h-10 transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.to)
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} className={active ? 'text-blue-600' : ''} />
                  {link.label}
                  {/* Active indicator - static positioning to prevent shaking */}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Account Menu */}
            <div className="relative">
              <motion.button
                ref={buttonRef}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen((v) => !v)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 border rounded-full transition-all duration-200 ${
                  isOpen
                    ? 'border-blue-500 shadow-md shadow-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300'
                } bg-white hover:shadow-sm`}
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <AiOutlineMenu size={16} className="text-gray-600 md:hidden" />
                <div className="relative">
                  <img
                    className="rounded-full ring-2 ring-gray-100 object-cover transition-all duration-200"
                    referrerPolicy="no-referrer"
                    src={user?.photoURL || avatarImg}
                    alt={user?.displayName || 'Account'}
                    height="28"
                    width="28"
                  />
                  {user && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div className="hidden md:flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.displayName || 'Guest'}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </motion.button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    ref={menuRef}
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    {/* User info header */}
                    {user && (
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    )}

                    {/* Mobile nav links */}
                    <div className="md:hidden border-b border-gray-100 py-1">
                      {NAV_LINKS.map((link) => {
                        const active = isActive(link.to)
                        const Icon = link.icon
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition ${
                              active
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon size={18} className={active ? 'text-blue-600' : ''} />
                            {link.label}
                          </Link>
                        )
                      })}
                    </div>

                    {user ? (
                      <div className="py-1">
                        <Link
                          to="/dashboard/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                          <AiOutlineUser size={18} />
                          Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                          <AiOutlineDashboard size={18} />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logOut()
                            setIsOpen(false)
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition border-t border-gray-100 mt-1"
                        >
                          <AiOutlineLogout size={18} />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 space-y-2">
                        <Link
                          to="/login"
                          className="block w-full px-4 py-2.5 text-sm font-medium text-center text-gray-700 hover:bg-gray-50 rounded-lg transition"
                        >
                          Log in
                        </Link>
                        <Link
                          to="/signup"
                          className="block w-full px-4 py-2.5 text-sm font-semibold text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition shadow-md hover:shadow-lg"
                        >
                          <span className="flex items-center justify-center gap-2">
                            Get Started
                            <Sparkles size={16} />
                          </span>
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </motion.header>
  )
}

export default Navbar