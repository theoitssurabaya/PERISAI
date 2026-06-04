const express = require('express')
const router = express.Router()
const { predict, getLatest, getHistory } = require('../controllers/predictionController')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)
router.post('/run', predict)
router.get('/latest', getLatest)
router.get('/history', getHistory)

module.exports = router