import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#E5E7EB]">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {/* On mobile: no margin shift (sidebar overlays). On sm+: shift when open */}
      <main className={`pt-14 sm:pt-16 transition-all duration-300 ${sidebarOpen ? 'sm:ml-64' : 'ml-0'}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
