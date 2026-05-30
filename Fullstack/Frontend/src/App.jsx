import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import AIChatPage from './pages/AIChatPage'
import HabitLogPage from './pages/HabitLogPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RiskProfilePage from './pages/RiskProfilePage'
import MedicalRecordsPage from './pages/MedicalRecordsPage'
import ProfilePage from './pages/ProfilePage'



function App() {
  return (
    <Routes>

      {/* Auth routes - tanpa Navbar/Sidebar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/chat" replace />} />
        <Route path="chat" element={<AIChatPage />} />
        <Route path="habit-log" element={<HabitLogPage />} />
        <Route path="risk-profile" element={<RiskProfilePage />} />
        <Route path="/medical-records" element={<MedicalRecordsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App