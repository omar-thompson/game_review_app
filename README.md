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

**Live URL**: http://<EC2-public-IP>:5001 *(update with current IP if it changes)*

### Manual deployment procedure (EC2)

1. SSH into the instance:
   ```
   ssh -i /path/to/key.pem ubuntu@<EC2-public-IP>
   ```

2. Clone the repository (first-time setup only):
   ```
   git clone https://github.com/omar-thompson/game_review_app.git
   cd game_review_app
   ```
   For subsequent deployments, pull the latest changes instead:
   ```
   cd ~/game_review_app
   git pull
   ```

3. Create `backend/.env` with the required environment variables (first-time setup only — do not commit this file):
   ```
   MONGO_URI=<MongoDB Atlas connection string>
   PORT=5001
   ```

4. Install dependencies (first-time setup, or after a `git pull` that changes dependencies):
   ```
   npm run install-all
   ```

5. Start the app under pm2 so it keeps running after the SSH session ends:
   ```
   pm2 start npm --name game-review-app -- start
   pm2 save
   ```
   This builds the frontend and starts the backend, which serves the built frontend and the API from a single process on port 5001.

   If the app is already running under pm2 and you're redeploying updated code:
   ```
   pm2 restart game-review-app
   ```

6. Confirm it's running:
   ```
   pm2 logs game-review-app --lines 20
   ```
   Look for `Server running on http://localhost:5001` and `MongoDB connected`.

### Security configuration

- The application port (5001) must be allowed inbound on the EC2 instance's security group. SSH (port 22) is restricted to specific IPs and should remain so.
- **Known limitation**: this AWS sandbox environment does not permit opening the security group to `0.0.0.0/0`. The inbound rule for port 5001 must be updated to the marker's IP address (or current network) ahead of the marking window.
- No secrets (MongoDB credentials) are committed to the repository — they are configured via `backend/.env` on the instance, which is excluded via `.gitignore`.

### Stopping the app

```
pm2 stop game-review-app     # stop, keep registered with pm2
pm2 delete game-review-app   # stop and remove from pm2 entirely
```
