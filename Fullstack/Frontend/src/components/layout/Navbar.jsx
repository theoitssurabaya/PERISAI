import { RxHamburgerMenu } from 'react-icons/rx'
import { IoPersonCircleOutline, IoSettingsOutline } from 'react-icons/io5'
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
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RxHamburgerMenu size={22} className="text-[#0F172A]" />
        </button>
        <img src={logo} alt="PERISAI" className="h-8 object-contain" />
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <span className="text-sm text-[#64748B]">Hi, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-[#64748B] hover:text-[#0F172A] font-medium px-4 py-2 hover:underline"
            >
              Logout
            </button>
            <IoPersonCircleOutline size={28} className="text-[#0F172A] cursor-pointer" />
            <IoSettingsOutline size={24} className="text-[#0F172A] cursor-pointer" />
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/register')}
              className="text-[#3B82F6] font-medium px-4 py-2 hover:underline"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#3B82F6] text-white font-medium px-5 py-2 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Log In
            </button>
            <IoPersonCircleOutline size={28} className="text-[#0F172A] cursor-pointer" />
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar