const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');

const app = express();
const host = process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0';
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'PERISAI API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/habit-log', require('./routes/habitLog'));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port http://${host}:${PORT}`);
});