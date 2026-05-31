const pool = require('../config/db')

const HabitLog = {
  async create({ userId, date, meals, foodTypes, exercised, exerciseIntensity, dailySteps, sleepHours, stressLevel, smokes, smokeCount, alcohol }) {
    const result = await pool.query(
      `INSERT INTO habit_logs 
        (user_id, date, meals, food_types, exercised, exercise_intensity, daily_steps, sleep_hours, stress_level, smokes, smoke_count, alcohol)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (user_id, date) 
       DO UPDATE SET
        meals = EXCLUDED.meals,
        food_types = EXCLUDED.food_types,
        exercised = EXCLUDED.exercised,
        exercise_intensity = EXCLUDED.exercise_intensity,
        daily_steps = EXCLUDED.daily_steps,
        sleep_hours = EXCLUDED.sleep_hours,
        stress_level = EXCLUDED.stress_level,
        smokes = EXCLUDED.smokes,
        smoke_count = EXCLUDED.smoke_count,
        alcohol = EXCLUDED.alcohol
       RETURNING *`,
      [userId, date, meals, foodTypes, exercised, exerciseIntensity, dailySteps, sleepHours, stressLevel, smokes, smokeCount, alcohol]
    )
    return result.rows[0]
  },

  async findByDate(userId, date) {
    const result = await pool.query(
      'SELECT * FROM habit_logs WHERE user_id = $1 AND date = $2',
      [userId, date]
    )
    return result.rows[0]
  },

  async findHistory(userId, limit = 7) {
    const result = await pool.query(
      'SELECT * FROM habit_logs WHERE user_id = $1 ORDER BY date DESC LIMIT $2',
      [userId, limit]
    )
    return result.rows
  }
}

module.exports = HabitLog