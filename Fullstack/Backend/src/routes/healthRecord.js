const express = require('express')
const router = express.Router()
const { create, getHistory, getLatest } = require('../controllers/healthRecordController')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

router.post('/', create)
router.get('/', getHistory)
router.get('/latest', getLatest)

module.exports = router
