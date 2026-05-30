const express = require('express')
const router = express.Router()
const { getProfile, upsertProfile } = require('../controllers/profileController')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)
router.get('/', getProfile)
router.post('/', upsertProfile)

module.exports = router