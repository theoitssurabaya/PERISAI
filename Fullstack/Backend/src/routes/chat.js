const express = require('express')
const router = express.Router()
const axios = require('axios')
const authMiddleware = require('../middleware/auth')

const AI_CHAT_URL = process.env.AI_CHAT_URL || 'http://127.0.0.1:8000'

router.use(authMiddleware)

router.post('/', async (req, res, next) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong' })

    const response = await axios.post(`${AI_CHAT_URL}/api/v1/chat/general`, { message })
    res.json({ success: true, reply: response.data.reply })
  } catch (err) {
    next(err)
  }
})

module.exports = router