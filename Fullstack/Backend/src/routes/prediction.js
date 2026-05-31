const express = require('express')
const router = express.Router()
const { predict, getLatest } = require('../controllers/predictionController')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)
router.post('/run', predict)
router.get('/latest', getLatest)

module.exports = router