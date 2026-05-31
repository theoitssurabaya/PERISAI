import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MdOutlineEmail, MdLockOutline } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaApple } from 'react-icons/fa'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import logoIcon from '../assets/Perisai.png'
import { useAuth } from '../context/useAuth'
import { s } from '../styles/common'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    // nanti diganti API call 
    // login({ name: 'Ibra', email })
    // navigate('/chat')
    try {
      await login(email, password)
      navigate('/chat')
    } catch (err) {
      alert(err.response?.data?.message || 'Login gagal')
    }
  }

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm w-full max-w-sm p-8">

        <div className="flex justify-center mb-6">
          <img src={logoIcon} alt="PERISAI" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-3xl font-bold text-[#3B82F6] text-center mb-1">Welcome</h1>
        <p className="text-sm text-[#64748B] text-center mb-6">Login with Email</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#3B82F6]">Email Id</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#3B82F6] transition-colors">
              <MdOutlineEmail size={18} className="text-[#64748B] shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
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
                placeholder="Password"
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
            <div className="flex justify-end">
              <button type="button" className="text-xs text-[#64748B] hover:text-[#3B82F6] transition-colors">
                Forgot your password?
              </button>
            </div>
          </div>

          <button type="submit" className={`${s.btnPrimary} w-full text-center mt-2`}>
            LOGIN
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-[#64748B]">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <FcGoogle size={22} />
          </button>
          <button className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <FaFacebook size={22} className="text-[#1877F2]" />
          </button>
          <button className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <FaApple size={22} className="text-[#0F172A]" />
          </button>
        </div>

        <p className="text-center text-xs text-[#64748B]">
          Don't have account?{' '}
          <Link to="/register" className="text-[#3B82F6] font-semibold hover:underline">
            Register Now
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage