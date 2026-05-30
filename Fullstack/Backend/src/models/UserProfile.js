const pool = require('../config/db')

const UserProfile = {
  async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [userId]
    )
    return result.rows[0]
  },

  async upsert({ userId, age, sex, weight, height, fruits, veggies, diffWalk, stroke, heartDisease, cholCheck, genHlth }) {
    const bmi = weight / ((height / 100) ** 2)
    const result = await pool.query(
      `INSERT INTO user_profiles 
        (user_id, age, sex, bmi, weight, height, fruits, veggies, diff_walk, stroke, heart_disease, chol_check, gen_hlth, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW())
       ON CONFLICT (user_id) DO UPDATE SET
        age = EXCLUDED.age,
        sex = EXCLUDED.sex,
        bmi = EXCLUDED.bmi,
        weight = EXCLUDED.weight,
        height = EXCLUDED.height,
        fruits = EXCLUDED.fruits,
        veggies = EXCLUDED.veggies,
        diff_walk = EXCLUDED.diff_walk,
        stroke = EXCLUDED.stroke,
        heart_disease = EXCLUDED.heart_disease,
        chol_check = EXCLUDED.chol_check,
        gen_hlth = EXCLUDED.gen_hlth,
        updated_at = NOW()
       RETURNING *`,
      [userId, age, sex, bmi, weight, height, fruits, veggies, diffWalk, stroke, heartDisease, cholCheck, genHlth]
    )
    return result.rows[0]
  }
}

module.exports = UserProfile