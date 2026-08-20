import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos.js';

// Load environment variables from .env
dotenv.config();

// Create the Express app
const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running!' });
});

app.use('/api/todos', todoRoutes);

// Connect to MongoDB, then start the server
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
