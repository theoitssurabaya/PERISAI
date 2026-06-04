import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { MdLockOutline } from 'react-icons/md'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import logoIcon from '../assets/Perisai.png'

function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  
  // Mengambil email yang dikirim dari halaman login sebelumnya
  const email = location.state?.email || ''

  const handleReset = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) return

    if (newPassword !== confirmPassword) {
      alert('Konfirmasi password tidak cocok!')
      return
    }

    setLoading(true)
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiBase}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Gagal memperbarui password')

      alert(data.message)
      navigate('/login') // Balik ke halaman login setelah sukses
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-sm p-8">
        
        <div className="flex justify-center mb-6">
          <img src={logoIcon} alt="PERISAI" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-[#3B82F6] text-center mb-1">Perbarui Password</h1>
        <p className="text-xs text-[#64748B] text-center mb-6">Email: <span className="font-semibold text-[#0F172A]">{email}</span></p>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          
          {/* Password Baru */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#3B82F6]">Password Baru</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#3B82F6] transition-colors">
              <MdLockOutline size={18} className="text-[#64748B] shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
                className="w-full outline-none text-[#0F172A] text-sm bg-transparent placeholder-gray-300"
                required
              />
            </div>
          </div>

          {/* Konfirmasi Password Baru */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#3B82F6]">Konfirmasi Password</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#3B82F6] transition-colors">
              <MdLockOutline size={18} className="text-[#64748B] shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full outline-none text-[#0F172A] text-sm bg-transparent placeholder-gray-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#64748B] hover:text-[#0F172A] transition-colors shrink-0"
              >
                {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-center mt-2 bg-[#3B82F6] text-white rounded-xl py-3 font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'MEMPROSES...' : 'PERBARUI PASSWORD'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-xs text-[#64748B] hover:underline">
            Batal dan Kembali
          </Link>
        </div>

      </div>
    </div>
  )
}

export default ResetPasswordPage