# Team Task Manager

A complete, full-stack web application for managing team projects, tracking tasks, and collaborating efficiently.

## Features

- **Authentication System**: Secure signup and login with JWT and HTTP-only cookies.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Can create/delete projects, manage members, and assign tasks.
  - **Member**: Can view assigned projects and update task statuses.
- **Project Management**: Create projects, add descriptions, and manage team members.
- **Task Management**: Create tasks, assign them to members, set due dates, and update statuses (Pending / In Progress / Completed).
- **Dashboard**: Visual overview of total, completed, pending, and overdue tasks.
- **Modern UI**: Clean, responsive, and minimalist design built with custom CSS.

## Tech Stack

- **Frontend**: React.js (Vite), React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JSON Web Tokens (JWT), bcryptjs

## Project Structure (Monorepo)

```text
TeamTaskManager/
├── client/           # React Frontend Application
│   ├── src/          # Source Code (Components, Pages, Services, Context)
│   └── package.json  # Client Dependencies
├── server/           # Express Backend Server
│   ├── src/          # Models, Controllers, Middleware, Routes
│   ├── server.js     # Express Entry Point
│   └── package.json  # Server Dependencies
└── package.json      # Root package.json for Deployment Scripts
```

## Setup Instructions (Local Development)

1. **Clone the repository** (if applicable) or open the project folder.
2. **Install Dependencies**:
   From the root folder, run:
   ```bash
   npm run install
   ```
   *(This will install dependencies for both the frontend and backend).*
3. **Environment Variables**:
   In the `server` folder, the `.env` file should contain:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/teamtaskmanager
   JWT_SECRET=supersecretjwtkey123
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```
4. **Run Development Servers**:
   - Start Backend: `cd server && npm run dev`
   - Start Frontend: `cd client && npm run dev`

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/users` (Admin only)

### Projects
- `POST /api/projects` (Admin)
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id/members` (Admin)
- `DELETE /api/projects/:id` (Admin)

### Tasks
- `POST /api/tasks` (Admin)
- `GET /api/tasks`
- `PUT /api/tasks/:id/status`
- `DELETE /api/tasks/:id` (Admin)

## Deployment Steps (Railway)

This repository is configured to be deployed easily as a single service on Railway.

1. Create a GitHub repository and push this code to it.
2. Log in to [Railway.app](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub repo**.
4. Select your newly created repository.
5. In the Railway dashboard for the service, add the following **Variables**:
   - `MONGO_URI` = `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET` = `<Your secure secret>`
   - `NODE_ENV` = `production`
6. **Wait for the build**. Railway will automatically run `npm run install`, `npm run build`, and `npm start` utilizing the root `package.json`. The Express server will serve your compiled React frontend!
