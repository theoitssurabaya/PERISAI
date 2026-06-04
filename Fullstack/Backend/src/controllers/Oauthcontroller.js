const axios = require('axios')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Helper: cari atau buat user dari data OAuth
const findOrCreateUser = async ({ name, email }) => {
  let user = await User.findByEmail(email)
  if (!user) {
    // Buat user baru tanpa password (OAuth user)
    user = await User.createOAuth({ name, email })
  }
  return user
}

// =====================
// GOOGLE
// =====================
const googleRedirect = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  })
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}

const googleCallback = async (req, res, next) => {
  try {
    const { code } = req.query
    if (!code) return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`)

    // Tukar code dengan token
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code',
    })

    const { access_token } = tokenRes.data

    // Ambil info user dari Google
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    })

    const { name, email } = userRes.data
    const user = await findOrCreateUser({ name, email })
    const token = generateToken(user.id)

    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`)
  } catch (err) {
    next(err)
  }
}

// =====================
// FACEBOOK
// =====================
const facebookRedirect = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID,
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
    scope: 'email,public_profile',
    response_type: 'code',
  })
  res.redirect(`https://www.facebook.com/v18.0/dialog/oauth?${params}`)
}

const facebookCallback = async (req, res, next) => {
  try {
    const { code } = req.query
    if (!code) return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`)

    // Tukar code dengan token
    const tokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
        code,
      }
    })

    const { access_token } = tokenRes.data

    // Ambil info user dari Facebook
    const userRes = await axios.get('https://graph.facebook.com/me', {
      params: { fields: 'id,name,email', access_token }
    })

    const { name, email } = userRes.data
    if (!email) return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_email`)

    const user = await findOrCreateUser({ name, email })
    const token = generateToken(user.id)

    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`)
  } catch (err) {
    next(err)
  }
}

// =====================
// APPLE
// =====================
const appleRedirect = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.APPLE_CLIENT_ID,
    redirect_uri: process.env.APPLE_CALLBACK_URL,
    response_type: 'code id_token',
    scope: 'name email',
    response_mode: 'form_post',
  })
  res.redirect(`https://appleid.apple.com/auth/authorize?${params}`)
}

const appleCallback = async (req, res, next) => {
  try {
    const { code, id_token, user: userJson } = req.body
    if (!code) return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`)

    // Decode id_token untuk ambil email (Apple kirim email hanya saat pertama kali)
    const decoded = jwt.decode(id_token)
    const email = decoded?.email

    if (!email) return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_email`)

    // Apple hanya kirim name saat pertama kali login
    let name = email.split('@')[0]
    if (userJson) {
      try {
        const parsed = typeof userJson === 'string' ? JSON.parse(userJson) : userJson
        name = `${parsed.name?.firstName || ''} ${parsed.name?.lastName || ''}`.trim() || name
      } catch (_) {}
    }

    const user = await findOrCreateUser({ name, email })
    const token = generateToken(user.id)

    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  googleRedirect, googleCallback,
  facebookRedirect, facebookCallback,
  appleRedirect, appleCallback,
}