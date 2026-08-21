import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos.js';
import authRoutes from './routes/auth.js';
import requireAuth from './middleware/auth.js';

dotenv.config();

const app = express();

// Trust the first proxy (Render's load balancer) so req.ip works correctly
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running!' });
});

// Public routes (no auth needed)
app.use('/api/auth', authRoutes);

// Protected routes (auth required)
app.use('/api/todos', requireAuth, todoRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
