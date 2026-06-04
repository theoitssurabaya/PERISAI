import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      localStorage.setItem('token', token)
      navigate('/chat')
    } else {
      navigate('/login')
    }
  }, [navigate, searchParams])

  return <div>Memproses login...</div>
}

export default OAuthCallbackPage