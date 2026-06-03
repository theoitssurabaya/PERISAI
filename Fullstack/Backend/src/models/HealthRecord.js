const pool = require('../config/db')

const HealthRecord = {
  async create({ userId, date, systolic, diastolic, cholesterol, bloodSugar, bmi, sleepHours, stressLevel, activityMinutes, notes }) {
    const result = await pool.query(
      `INSERT INTO health_records
        (user_id, date, systolic, diastolic, cholesterol, blood_sugar, bmi, sleep_hours, stress_level, activity_minutes, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [userId, date, systolic, diastolic, cholesterol, bloodSugar, bmi, sleepHours, stressLevel, activityMinutes, notes]
    )
    return result.rows[0]
  },

  async findLatest(userId) {
    const result = await pool.query(
      `SELECT DISTINCT ON (date) * FROM health_records
       WHERE user_id = $1
       ORDER BY date DESC, created_at DESC
       LIMIT 1`,
      [userId]
    )
    return result.rows[0]
  },

  async findHistory(userId, limit = 30) {
    const result = await pool.query(
      `SELECT * FROM health_records
       WHERE user_id = $1
       ORDER BY date DESC, created_at DESC
       LIMIT $2`,
      [userId, limit]
    )
    return result.rows
  },

  async findLatestPerMetric(userId) {
    const result = await pool.query(
      `SELECT DISTINCT ON (date) * FROM health_records
       WHERE user_id = $1
       ORDER BY date DESC, created_at DESC
       LIMIT 10`,
      [userId]
    )
    return result.rows
  }
}

module.exports = HealthRecord
