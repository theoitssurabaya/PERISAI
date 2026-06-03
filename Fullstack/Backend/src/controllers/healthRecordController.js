const HealthRecord = require('../models/HealthRecord')

const create = async (req, res, next) => {
  try {
    const {
      date,
      systolic,
      diastolic,
      cholesterol,
      blood_sugar,
      bmi,
      sleep_hours,
      stress_level,
      activity_minutes,
      notes
    } = req.body

    const recordDate = date || new Date().toISOString().split('T')[0]

    const record = await HealthRecord.create({
      userId: req.userId,
      date: recordDate,
      systolic: systolic ? parseInt(systolic) : null,
      diastolic: diastolic ? parseInt(diastolic) : null,
      cholesterol: cholesterol ? parseFloat(cholesterol) : null,
      bloodSugar: blood_sugar ? parseFloat(blood_sugar) : null,
      bmi: bmi ? parseFloat(bmi) : null,
      sleepHours: sleep_hours ? parseFloat(sleep_hours) : null,
      stressLevel: stress_level || null,
      activityMinutes: activity_minutes ? parseInt(activity_minutes) : null,
      notes: notes || null
    })

    res.status(201).json({ success: true, data: record })
  } catch (err) {
    next(err)
  }
}

const getHistory = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 30
    const records = await HealthRecord.findHistory(req.userId, limit)
    res.json({ success: true, data: records })
  } catch (err) {
    next(err)
  }
}

const getLatest = async (req, res, next) => {
  try {
    const record = await HealthRecord.findLatest(req.userId)
    res.json({ success: true, data: record || null })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, getHistory, getLatest }
