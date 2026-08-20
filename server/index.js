import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Create the Express app
const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies

// A simple test route
app.get('/', (req, res) => {
    res.json({message: 'Todo API is running!'});
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});