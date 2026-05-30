const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Semua field harus diisi' })

    const existing = await User.findByEmail(email)
    if (existing)
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    const token = generateToken(user.id)

    res.status(201).json({ success: true, token, user })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email dan password harus diisi' })

    const user = await User.findByEmail(email)
    if (!user)
      return res.status(401).json({ success: false, message: 'Email atau password salah' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid)
      return res.status(401).json({ success: false, message: 'Email atau password salah' })

    const token = generateToken(user.id)

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (err) {
    next(err)
  }
}

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user)
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' })
    res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, me }