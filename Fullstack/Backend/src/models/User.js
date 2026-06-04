const pool = require('../config/db')
const bcrypt = require('bcryptjs')

const User = {
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0]
  },

  async create({ name, email, passwordHash }) {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, passwordHash]
    )
    return result.rows[0]
  },

  async createOAuth({ name, email }) {
    const randomPassword = Math.random().toString(36)
    const passwordHash = await bcrypt.hash(randomPassword, 10)

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, passwordHash]
    )

    return result.rows[0]
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0]
  },

  async updatePassword(id, newPasswordHash) {
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, name, email',
      [newPasswordHash, id]
    )
    return result.rows[0]
  }
}

module.exports = User