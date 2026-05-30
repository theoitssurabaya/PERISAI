const UserProfile = require('../models/UserProfile')

const getProfile = async (req, res, next) => {
  try {
    const profile = await UserProfile.findByUserId(req.userId)
    res.json({ success: true, data: profile || null })
  } catch (err) {
    next(err)
  }
}

const upsertProfile = async (req, res, next) => {
  try {
    const { age, sex, weight, height, fruits, veggies, diff_walk, stroke, heart_disease, chol_check, gen_hlth } = req.body

    if (!age || !weight || !height) {
      return res.status(400).json({ success: false, message: 'Age, weight, dan height wajib diisi' })
    }

    const profile = await UserProfile.upsert({
      userId: req.userId,
      age, sex, weight, height, fruits, veggies,
      diffWalk: diff_walk,
      stroke, heartDisease: heart_disease,
      cholCheck: chol_check ?? 1,
      genHlth: gen_hlth ?? 3
    })

    res.json({ success: true, data: profile })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProfile, upsertProfile }