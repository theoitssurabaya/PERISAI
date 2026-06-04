const express = require('express')
const router = express.Router()
const { register, login, me } = require('../controllers/authController')
const {
  googleRedirect, googleCallback,
  facebookRedirect, facebookCallback,
  appleRedirect, appleCallback,
} = require('../controllers/OauthController')
const authMiddleware = require('../middleware/auth')

// Email/Password
router.post('/register', register)
router.post('/login', login)
router.get('/me', authMiddleware, me)

// Google OAuth
router.get('/google', googleRedirect)
router.get('/google/callback', googleCallback)

// Facebook OAuth
router.get('/facebook', facebookRedirect)
router.get('/facebook/callback', facebookCallback)

// Apple OAuth (Apple menggunakan POST untuk callback)
router.get('/apple', appleRedirect)
router.post('/apple/callback', appleCallback)

module.exports = router