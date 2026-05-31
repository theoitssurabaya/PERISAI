const express = require('express')
const router = express.Router()
const { create, getByDate, getHistory } = require('../controllers/habitLogController')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

router.post('/', create)
router.get('/', getByDate)
router.get('/history', getHistory)

module.exports = router