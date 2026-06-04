const express = require('express')
const router = express.Router()
const { register, login, me, resetPassword } = require('../controllers/authController')
const {
  googleRedirect, googleCallback,
  // facebookRedirect, facebookCallback,
  // appleRedirect, appleCallback,
} = require('../controllers/oauthController')
const authMiddleware = require('../middleware/auth')

// Email/Password
router.post('/register', register)
router.post('/login', login)
router.get('/me', authMiddleware, me)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
// Google OAuth
router.get('/google', googleRedirect)
router.get('/google/callback', googleCallback)

// Facebook OAuth
// router.get('/facebook', facebookRedirect)
// router.get('/facebook/callback', facebookCallback)

// Apple OAuth - coming soon (butuh Apple Developer Account $99/tahun)
// router.get('/apple', appleRedirect)
// router.post('/apple/callback', appleCallback)

module.exports = router