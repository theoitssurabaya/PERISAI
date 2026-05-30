import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MdOutlineEmail, MdLockOutline, MdPersonOutline } from 'react-icons/md'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import logoIcon from '../assets/Perisai.png'
import { useAuth } from '../context/useAuth'
import { s } from '../styles/common'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      return setError('Semua field harus diisi')
    }
    if (password !== confirmPassword) {
      return setError('Password tidak cocok')
    }
    if (password.length < 6) {
      return setError('Password minimal 6 karakter')
    }

    try {
      await register(name, email, password)
      navigate('/chat')
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal')
    }
  }
  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-sm p-8">

        <div className="flex justify-center mb-6">
          <img src={logoIcon} alt="PERISAI" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-3xl font-bold text-[#3B82F6] text-center mb-1">Create Account</h1>
        <p className="text-sm text-[#64748B] text-center mb-6">Register with Email</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#3B82F6]">Full Name</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#3B82F6] transition-colors">
              <MdPersonOutline size={18} className="text-[#64748B] shrink-0" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap"
                className="w-full outline-none text-[#0F172A] text-sm bg-transparent placeholder-gray-300"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#3B82F6]">Email</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#3B82F6] transition-colors">
              <MdOutlineEmail size={18} className="text-[#64748B] shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full outline-none text-[#0F172A] text-sm bg-transparent placeholder-gray-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#3B82F6]">Password</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#3B82F6] transition-colors">
              <MdLockOutline size={18} className="text-[#64748B] shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                className="w-full outline-none text-[#0F172A] text-sm bg-transparent placeholder-gray-300"
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#3B82F6]">Confirm Password</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#3B82F6] transition-colors">
              <MdLockOutline size={18} className="text-[#64748B] shrink-0" />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
                className="w-full outline-none text-[#0F172A] text-sm bg-transparent placeholder-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-[#64748B] hover:text-[#0F172A] transition-colors shrink-0"
              >
                {showConfirm ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={`${s.btnPrimary} w-full text-center mt-2`}>
            REGISTER
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-[#64748B]">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-xs text-[#64748B]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3B82F6] font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}


export default RegisterPage