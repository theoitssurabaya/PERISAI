import { NavLink } from 'react-router-dom'
import { IoChatbubblesOutline, IoDocumentTextOutline, IoShieldOutline, IoHelpCircleOutline } from 'react-icons/io5'
import { RiBarChartLine } from 'react-icons/ri'
import { MdOutlineMonitorHeart } from 'react-icons/md'
import logoIcon from '../../assets/Perisai.png'
import { s } from '../../styles/common'


const navItems = [
  { to: '/chat', label: 'AI Chat', icon: IoChatbubblesOutline },
  { to: '/risk-profile', label: 'Risk Profile', icon: RiBarChartLine },
  { to: '/habit-log', label: 'Habit Log', icon: MdOutlineMonitorHeart },
  { to: '/medical-records', label: 'Medical Records', icon: IoDocumentTextOutline },
]

const bottomItems = [
  { to: '/help', label: 'Help', icon: IoHelpCircleOutline },
  { to: '/privacy', label: 'Privacy', icon: IoShieldOutline },
]

function Sidebar({ isOpen }) {
  return (
    <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 flex flex-col justify-between py-6 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col gap-1 px-4">
        <div className="flex justify-center mb-6">
          <img src={logoIcon} alt="PERISAI" className="w-16 h-16 object-contain" />
        </div>

        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${s.navItem} ${isActive ? s.navActive : s.navInactive}`
            }
          >
            <Icon size={24} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="flex flex-col gap-1 px-4 border-t border-gray-200 pt-4">
        {bottomItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${s.navItem} ${isActive ? s.navActive : s.navInactive}`
            }
          >
            <Icon size={24} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar