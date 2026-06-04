import { RxHamburgerMenu } from 'react-icons/rx'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import logo from '../../assets/LogoPerisai.png'

function Navbar({ onToggleSidebar }) {
  const { isLoggedIn, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/chat')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RxHamburgerMenu size={20} className="text-[#0F172A]" />
        </button>
        <img src={logo} alt="PERISAI" className="h-7 sm:h-8 object-contain" />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {isLoggedIn ? (
          <>
            <span className="hidden sm:block text-sm text-[#64748B] truncate max-w-[140px]">
              Hi, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm text-[#64748B] hover:text-[#0F172A] font-medium px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-200 hover:border-gray-400 rounded-lg transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/register')}
              className="text-[#3B82F6] font-medium text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 hover:underline"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#3B82F6] text-white font-medium text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Log In
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar