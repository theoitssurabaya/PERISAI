import { NavLink } from 'react-router-dom'
import { IoChatbubblesOutline, IoDocumentTextOutline, IoShieldOutline, IoHelpCircleOutline } from 'react-icons/io5'
import { RiBarChartLine } from 'react-icons/ri'
import { MdOutlineMonitorHeart } from 'react-icons/md'
import logoIcon from '../../assets/Perisai.png'
import { s } from '../../styles/common'
import { IoPersonCircleOutline } from 'react-icons/io5'


const navItems = [
  { to: '/chat', label: 'AI Chat', icon: IoChatbubblesOutline },
  { to: '/risk-profile', label: 'Profil Risiko', icon: RiBarChartLine },
  { to: '/habit-log', label: 'Log Harian', icon: MdOutlineMonitorHeart },
  { to: '/medical-records', label: 'Rekam Medis', icon: IoDocumentTextOutline },
  { to: '/profile', label: 'Profil Saya', icon: IoPersonCircleOutline },
]

const bottomItems = [
  { to: '/help', label: 'Bantuan', icon: IoHelpCircleOutline },
  { to: '/privacy', label: 'Privasi', icon: IoShieldOutline },
]

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 sm:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-14 sm:top-16 left-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 flex flex-col justify-between py-6 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col gap-1 px-4">
          <div className="flex justify-center mb-6">
            <img src={logoIcon} alt="PERISAI" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
          </div>

          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `${s.navItem} ${isActive ? s.navActive : s.navInactive}`
              }
            >
              <Icon size={22} />
              <span className="text-sm sm:text-base">{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="flex flex-col gap-1 px-4 border-t border-gray-200 pt-4">
          {bottomItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `${s.navItem} ${isActive ? s.navActive : s.navInactive}`
              }
            >
              <Icon size={22} />
              <span className="text-sm sm:text-base">{label}</span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  )
}

export default Sidebar