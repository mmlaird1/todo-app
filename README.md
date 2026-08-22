# Todo App

A simple full-stack todo list application built with the MERN stack (MongoDB, Express, React, Node.js), featuring password-protected access with backend-enforced JWT authentication.

**Live Demo:** [https://todo-app-mmlaird.vercel.app](https://todo-app-mmlaird.vercel.app)

> Cold-start note: The backend is hosted on Render's free tier, which sleeps after 15 minutes of inactivity. The first request after a period of inactivity may take 30–60 seconds while the service wakes up. Subsequent requests are fast.

## Tech Stack

**Frontend**
- React 18 (bootstrapped with Vite)
- Axios for HTTP requests
- Vanilla CSS with custom properties

**Backend**
- Node.js with Express
- Mongoose (MongoDB ODM)
- bcrypt for password hashing
- jsonwebtoken for JWT session tokens

**Database**
- MongoDB Atlas (M0 free tier)

**Hosting**
- Frontend: Vercel
- Backend: Render (free web service)
- Database: MongoDB Atlas

## Features

- Create, complete, and delete todos
- Data persists across sessions in MongoDB Atlas
- Real-time UI feedback with loading and error states
- Auto-dismissing error banners
- Responsive design that works on mobile and desktop
- Password-protected access with a login screen
- Backend-enforced authentication using bcrypt-hashed passwords and JWT tokens
- Rate-limited login endpoint to slow brute-force attempts
- Deployed on free-tier infrastructure end-to-end

## Architecture

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Browser   │  HTTPS  │   Express   │         │   MongoDB    │
│  (Vercel)   │ ──────► │  (Render)   │ ──────► │    Atlas     │
│   React     │  JWT    │   API +     │         │              │
│             │ ◄────── │   Auth      │ ◄────── │              │
└─────────────┘         └─────────────┘         └──────────────┘
```

The frontend calls a login endpoint with the password, receives a signed JWT, and includes it as an `Authorization: Bearer <token>` header on every protected API call. The backend verifies the token on every `/api/todos/*` request before touching the database.

## Project Structure

todo-app/<br />
... client/ # React frontend (Vercel)<br />
...... src/<br />
......... api/<br />
............ todos.js # Axios instance + API helpers<br />
......... App.jsx # Main todo UI<br />
......... App.css # Styles<br />
......... PasswordGate.jsx # Login screen wrapper<br />
......... main.jsx # Entry point<br />
......... index.css # CSS variables<br />
...... .env # VITE_API_URL (gitignored)<br />
...... package.json<br />
<br />
... server/ # Express backend (Render)<br />
...... middleware/<br />
......... auth.js # JWT verification middleware<br />
...... models/<br />
......... Todo.js # Mongoose schema<br />
...... routes/<br />
......... auth.js # POST /api/auth/login<br />
......... todos.js # CRUD for /api/todos<br />
...... .env # secrets (gitignored)<br />
...... index.js # Server entry point<br />
...... package.json<br />
<br />
... .gitignore<br />
... README.md<br />

## API Reference

All todo endpoints require a valid JWT in the `Authorization: Bearer <token>` header. Requests without a valid token receive `401 Unauthorized`.

## Running Locally

### Prerequisites

- Node.js 18+ and npm
- A MongoDB Atlas account (free tier is fine)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/todoapp?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
PASSWORD_HASH=<bcrypt hash of your chosen password>
JWT_SECRET=<long random string>
```

**Generate the password hash** with a throwaway script:

```js
// server/generateHash.js (delete after use)
import bcrypt from 'bcrypt';
console.log(await bcrypt.hash('YOUR_PASSWORD_HERE', 10));
```

```bash
node generateHash.js
rm generateHash.js
```

**Generate the JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Start the server:**

```bash
npm run dev
```

You should see `MongoDB connected` and `Server running on http://localhost:5000`.

### 3. Set up the frontend

In a new terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

**Start the dev server:**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Enter your password to access the todo list.

## Deployment

The app is designed to deploy on free tiers of Render (backend) and Vercel (frontend).

### Backend (Render)

1. Create a new **Web Service** connected to your GitHub repo
2. **Root Directory:** `server`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Environment variables:**
   - `MONGODB_URI` — your Atlas connection string
   - `PASSWORD_HASH` — bcrypt hash of your password
   - `JWT_SECRET` — 128+ character random hex string
   - `CLIENT_URL` — your Vercel URL (set after frontend is deployed)
   - `NODE_ENV=production`

### Frontend (Vercel)

1. Import the repo into Vercel
2. **Root Directory:** `client`
3. **Framework preset:** Vite (auto-detected)
4. **Environment variable:**
   - `VITE_API_URL` — `https://<your-render-url>/api`

After both are deployed, add `CLIENT_URL` to Render pointing at your Vercel URL to complete the CORS allow list.

### MongoDB Atlas

- Free M0 cluster
- Database user with a strong auto-generated password
- Network Access set to `0.0.0.0/0` (allow anywhere) for platform hosting

## Security Notes

This app implements **shared-secret authentication** — one password grants access, and every user with the password gets the same permissions. It is appropriate for a personal or small-group project, not for a multi-user product.

**What the auth actually protects:**

- The password is never sent to the browser — it lives only on the backend as a bcrypt hash
- Every `/api/todos/*` request is verified against a signed JWT before reaching the database
- Direct `curl` requests to the API without a token return `401 Unauthorized`
- Login attempts are rate-limited (5 per IP per 15 minutes) to slow brute-force attempts
- Bcrypt's constant-time comparison protects against timing attacks

**What it does not do:**

- No per-user accounts — everyone shares one password
- No token refresh — tokens expire after 7 days and require re-login
- No token persistence — refreshing the page returns you to the login screen (intentional, since we don't use `localStorage`)
- No audit logging or session revocation

For a real product, you would want per-user accounts with hashed passwords stored in MongoDB, short-lived access tokens paired with refresh tokens, and structured logging.

## License

MIT
