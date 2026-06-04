const pool = require('../config/db')
const axios = require('axios')
const UserProfile = require('../models/UserProfile')
const HabitLog = require('../models/HabitLog')

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001/api/v1'

const predict = async (req, res, next) => {
  try {
    const profile = await UserProfile.findByUserId(req.userId)
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Lengkapi profil kesehatan kamu dulu!' })
    }

    // Ambil histori 7 hari terakhir
    const habitLogs = await HabitLog.findHistory(req.userId, 7)
    if (!habitLogs || habitLogs.length === 0) {
      return res.status(400).json({ success: false, message: 'Isi data harian kamu dulu!' })
    }

    let totalSmokes = 0
    let totalExercised = 0
    let totalAlcohol = 0
    let totalSleepHours = 0

    habitLogs.forEach(log => {
      if (log.smokes) totalSmokes++
      if (log.exercised) totalExercised++
      if (log.alcohol) totalAlcohol++
      totalSleepHours += Number(log.sleep_hours) || 0
    })

    const totalLogs = habitLogs.length
    
    // Threshold dari User: Minimal 3 kali untuk dinyatakan Positif (1) dalam 7 hari.
    // Skalasi dinamis jika pengguna baru mendaftar (data < 7 hari).
    const threshold = totalLogs >= 7 ? 3 : Math.ceil(totalLogs * (3/7))
    
    const isSmoker = totalSmokes >= threshold ? 1 : 0
    const isPhysActive = totalExercised >= threshold ? 1 : 0
    const isHeavyDrinker = totalAlcohol >= threshold ? 1 : 0
    const avgSleepHours = Math.round(totalSleepHours / totalLogs)

    // Konversi usia ke age group
    const getAgeGroup = (age) => {
      if (age < 25) return 1
      if (age < 30) return 2
      if (age < 35) return 3
      if (age < 45) return 5
      if (age < 50) return 6
      if (age < 55) return 7
      if (age < 60) return 8
      if (age < 65) return 9
      if (age < 70) return 10
      if (age < 75) return 11
      if (age < 80) return 12
      return 13
    }

    // Map ke format input model Theo
    const payload = {
      Age: getAgeGroup(profile.age),
      Sex: profile.sex,
      BMI: parseFloat(profile.bmi),
      Smoker: isSmoker,
      PhysActivity: isPhysActive,
      Fruits: profile.fruits,
      Veggies: profile.veggies,
      HvyAlcoholConsump: isHeavyDrinker,
      DiffWalk: profile.diff_walk,
      Stroke: profile.stroke,
      HeartDiseaseorAttack: profile.heart_disease,
      CholCheck: profile.chol_check,
      GenHlth: profile.gen_hlth,
      SleepHours: avgSleepHours
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

const getHistory = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM predictions WHERE user_id = $1 ORDER BY predicted_at DESC LIMIT 30',
      [req.userId]
    )
    res.json({ success: true, data: result.rows })
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

module.exports = { predict, getLatest, getHistory }