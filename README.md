# Game Review Platform

A web application where gamers can discover games, read and write reviews, save games to a personal "Play Later" list, and check platform/subscription availability — all in one place instead of across multiple sites.

## Architecture

- **Frontend**: React (Vite) + Tailwind CSS, served as a static build
- **Backend**: Node.js + Express, exposing a REST API
- **Database**: MongoDB (hosted on MongoDB Atlas), accessed via Mongoose
- **Hosting**: AWS EC2 (manual deployment)

```
frontend/   React + Vite client
backend/    Express API + Mongoose models
```

The backend serves the built frontend as static files and exposes API routes under `/api`. See the system design diagrams in the project report for the full component and data-flow breakdown.

## Setup

### Prerequisites

- Node.js
- A MongoDB Atlas connection string (or a local MongoDB instance)

### Backend

```
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
MONGO_URI=<your MongoDB connection string>
PORT=5001
```

Run it:

```
npm start
```

### Frontend

```
cd frontend
npm install
npm run dev
```

This starts the Vite dev server. For a production build (the version the backend serves):

```
npm run build
```

## Known limitations

- User registration and login are not yet wired to the backend — the login UI currently authenticates against mock demo data as a placeholder for the in-progress registration/login API work
- Game discovery, reviews, and Play Later functionality are designed (see system design and Jira backlog) but not yet implemented
- No automated test suite yet
- No CI/CD — deployment to EC2 is manual (documented in the project report)

## Deployment

Live URL: *[add EC2 public URL here]*
