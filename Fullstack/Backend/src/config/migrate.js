const pool = require('./db')

const migrate = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS habit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        meals INT DEFAULT 0,
        food_types TEXT[] DEFAULT '{}',
        exercised BOOLEAN DEFAULT false,
        exercise_intensity VARCHAR(10),
        daily_steps INT DEFAULT 0,
        sleep_hours FLOAT DEFAULT 0,
        stress_level INT,
        smokes BOOLEAN DEFAULT false,
        smoke_count INT DEFAULT 0,
        alcohol BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, date)
      );

      CREATE TABLE IF NOT EXISTS predictions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        predicted_at TIMESTAMP DEFAULT NOW(),
        diabetes_risk FLOAT,
        hypertension_risk FLOAT,
        cholesterol_risk FLOAT,
        shap_values JSONB,
        recommendation TEXT
      );
    `)

    console.log('Migration berhasil - semua tabel sudah dibuat')
    process.exit(0)
  } catch (err) {
    console.error('Migration gagal:', err.message)
    process.exit(1)
  }
}

migrate()