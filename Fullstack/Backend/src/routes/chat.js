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

    // --- JALUR AMAN BACKEND: Deteksi jika FE mengirim Object, ubah ke String ---
    let cleanMessage = message;
    if (typeof message === 'object') {
      // Jika object tersebut punya properti teks internal, ambil teksnya. Jika tidak, stringify seluruhnya.
      cleanMessage = message.text || message.message || JSON.stringify(message);
    }

    const response = await axios.post(`${AI_CHAT_URL}/api/v1/chat/general`, { message: cleanMessage })
    const data = response.data
    let reply
    // FastAPI return { status, reply } atau { status, message }
    // const reply = data.reply || data.message || 'Maaf, AI sedang tidak tersedia.'
    // console.log('FastAPI response:', response.data)
    if (data.status === 'error') {
      reply = data.message || 'Maaf, AI Chat sedang tidak tersedia saat ini. Silakan coba lagi nanti.'
    } else {
      reply = data.reply || 'Maaf, tidak ada respons dari AI.'
    }
    res.json({ success: true, reply })
  } catch (err) {
    next(err)
  }
})

module.exports = router