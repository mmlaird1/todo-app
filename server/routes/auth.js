import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Simple in-memory rate limiter to slow down brute force attempts.
// Resets when the server restarts, which is fine for our purposes.
const attemptsByIp = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip) {
  const now = Date.now();
  const record = attemptsByIp.get(ip);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    attemptsByIp.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }

  record.count++;
  return true;
}

router.post('/login', async (req, res) => {
  try {
    const ip = req.ip;

    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many attempts. Try again later.' });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const isValid = await bcrypt.compare(password, process.env.PASSWORD_HASH);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ authorized: true }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
