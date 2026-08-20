# Todo App

A simple full-stack todo list application built with the MERN stack.

**Live Demo:** [https://todo-app-mmlaird.vercel.app](https://todo-app-mmlaird.vercel.app)

> Note: The backend is hosted on Render's free tier, which sleeps after 15 minutes of inactivity. The first request after a period of inactivity may take 30-60 seconds while the service wakes up.


## Tech Stack

- **Frontend:** React (Vite), Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)

## Features

- Create, complete, and delete todos
- Persistent storage via MongoDB
- Responsive design
- Loading and error states

## Project Structure

todo-app/
├── server/ # Express backend
└── client/ # React frontend 


## Running Locally

### Prerequisites

- Node.js (v18 or higher)
- A MongoDB Atlas cluster (free tier is fine)

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

PORT=5000
MONGODB_URI=your_mongodb_connection_string 

Then run:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:

VITE_API_URL=http://localhost:5000/api

Then run:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Endpoints

- `GET /api/todos` — List all todos
- `POST /api/todos` — Create a todo
- `PATCH /api/todos/:id` — Update a todo
- `DELETE /api/todos/:id` — Delete a todo

## License

MIT