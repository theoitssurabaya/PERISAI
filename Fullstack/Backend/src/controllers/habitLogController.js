const HabitLog = require('../models/HabitLog')

const create = async (req, res, next) => {
  try {
    const { meals, food_types, exercised, exercise_intensity, daily_steps, sleep_hours, stress, smokes, smoke_count, alcohol } = req.body
    const date = req.body.date || new Date().toISOString().split('T')[0]

    const log = await HabitLog.create({
      userId: req.userId,
      date,
      meals,
      foodTypes: food_types || [],
      exercised: exercised || false,
      exerciseIntensity: exercise_intensity || null,
      dailySteps: daily_steps || 0,
      sleepHours: sleep_hours || 0,
      stressLevel: stress,
      smokes: smokes || false,
      smokeCount: smoke_count || 0,
      alcohol: alcohol || false
    })

    res.status(201).json({ success: true, data: log })
  } catch (err) {
    next(err)
  }
}

const getByDate = async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0]
    const log = await HabitLog.findByDate(req.userId, date)

    if (!log) return res.json({ success: true, data: null })

    res.json({ success: true, data: log })
  } catch (err) {
    next(err)
  }
}

const getHistory = async (req, res, next) => {
  try {
    const logs = await HabitLog.findHistory(req.userId)
    res.json({ success: true, data: logs })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, getByDate, getHistory }