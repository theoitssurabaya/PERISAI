const pool = require('../config/db')
const axios = require('axios')
const UserProfile = require('../models/UserProfile')
const HabitLog = require('../models/HabitLog')

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001'

const predict = async (req, res, next) => {
  try {
    const profile = await UserProfile.findByUserId(req.userId)
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Lengkapi profil kesehatan kamu dulu!' })
    }

    const today = new Date().toISOString().split('T')[0]
    const habitLog = await HabitLog.findByDate(req.userId, today)
    if (!habitLog) {
      return res.status(400).json({ success: false, message: 'Isi data harian kamu dulu!' })
    }

    // Map ke format input model Theo
    const payload = {
      Age: profile.age,
      Sex: profile.sex,
      BMI: parseFloat(profile.bmi),
      Smoker: habitLog.smokes ? 1 : 0,
      PhysActivity: habitLog.exercised ? 1 : 0,
      Fruits: profile.fruits,
      Veggies: profile.veggies,
      HvyAlcoholConsump: habitLog.alcohol ? 1 : 0,
      DiffWalk: profile.diff_walk,
      Stroke: profile.stroke,
      HeartDiseaseorAttack: profile.heart_disease,
      CholCheck: profile.chol_check,
      GenHlth: profile.gen_hlth,
      SleepHours: habitLog.sleep_hours
    }

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, payload)
    const predictions = mlResponse.data.predictions

    // Simpan ke DB
    await pool.query(
      `INSERT INTO predictions (user_id, diabetes_risk, hypertension_risk, cholesterol_risk)
       VALUES ($1, $2, $3, $4)`,
      [req.userId, predictions.Diabetes, predictions.HighBP, predictions.HighChol]
    )

    res.json({
      success: true,
      data: {
        diabetes: (predictions.Diabetes * 100).toFixed(1),
        hipertensi: (predictions.HighBP * 100).toFixed(1),
        kolesterol: (predictions.HighChol * 100).toFixed(1),
      }
    })
  } catch (err) {
    next(err)
  }
}

const getLatest = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM predictions WHERE user_id = $1 ORDER BY predicted_at DESC LIMIT 1',
      [req.userId]
    )
    res.json({ success: true, data: result.rows[0] || null })
  } catch (err) {
    next(err)
  }
}

module.exports = { predict, getLatest }