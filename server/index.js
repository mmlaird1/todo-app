import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos.js';

// Load environment variables from .env
dotenv.config();

// Create the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running!' });
});

app.use('/api/todos', todoRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});