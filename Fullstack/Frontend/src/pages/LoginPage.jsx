import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MdOutlineEmail, MdLockOutline } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook/*, FaApple*/ } from 'react-icons/fa'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import logoIcon from '../assets/Perisai.png'
import { useAuth } from '../context/useAuth'
import { s } from '../styles/common'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(null) // 'google' | 'facebook' /* | 'apple' */
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      await login(email, password)
      navigate('/chat')
    } catch (err) {
      alert(err.response?.data?.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider) => {
    setOauthLoading(provider)
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      window.location.href = `${apiBase}/api/auth/${provider}`
    } catch (err) {
      alert(`Login dengan ${provider} gagal. Coba lagi.`)
      setOauthLoading(null)
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

          <button
            type="submit"
            disabled={loading}
            className={`${s.btnPrimary} w-full text-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-[#64748B]">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={oauthLoading !== null}
            className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {oauthLoading === 'google' ? (
              <span className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <FcGoogle size={20} />
            )}
            <span className="text-sm font-medium text-[#0F172A]">Continue with Google</span>
          </button>

          <button
            onClick={() => handleOAuthLogin('facebook')}
            disabled={oauthLoading !== null}
            className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {oauthLoading === 'facebook' ? (
              <span className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              <FaFacebook size={20} className="text-[#1877F2]" />
            )}
            <span className="text-sm font-medium text-[#0F172A]">Continue with Facebook</span>
          </button>

          {/* Apple Login - coming soon (butuh Apple Developer Account $99/tahun)
          <button
            onClick={() => handleOAuthLogin('apple')}
            disabled={oauthLoading !== null}
            className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {oauthLoading === 'apple' ? (
              <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
            ) : (
              <FaApple size={20} className="text-[#0F172A]" />
            )}
            <span className="text-sm font-medium text-[#0F172A]">Continue with Apple</span>
          </button>
          */}
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