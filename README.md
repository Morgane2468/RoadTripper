# Gear UP (RoadTripper)

Gear UP is a web application that helps you prepare road trips. Each trip has its own workspace with a Kanban board (**To Do**, **Doing**, **Done**) and color-coded task categories (**Admin**, **Gear**, **Bookings**).

The application was renamed from RoadTripper to Gear UP. The repository and folder names keep `roadtripper` so that file paths stay the same.

Project for MOD8 – Advanced Web Programming (Concordia Continuing Education).
Team: Valentin, Morgane, Erwan and Mathieu.

## Features

- Registration and login (passwords hashed with bcryptjs, session in a 1-hour JWT stored in an HttpOnly cookie)
- Protected pages: the session is checked on every navigation and on page refresh
- Create, edit and delete trips (name, destination, dates, transport, budget...)
- Suggested tasks saved together with the trip in a single MySQL transaction
- Kanban board with drag and drop between columns and a progress bar based on Done tasks
- Each user can only access their own trips and tasks

## Tech stack

| Part | Technologies |
| --- | --- |
| Front-end (`roadtripper-front`) | Vue 3, Vite, Vue Router, Pinia, Axios, vuedraggable, Tailwind CSS |
| Back-end (`roadtripper-server`) | Node.js, Express, Sequelize, mysql2, bcryptjs, jsonwebtoken, cookie-parser, CORS |
| Database | MySQL |

## Requirements

- Node.js 22.18 or later (or 24.12 or later)
- MySQL Server running locally (for example MySQL Community Server or XAMPP/MAMP)
- Git

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Morgane2468/RoadTripper.git
cd RoadTripper
```

### 2. Install the dependencies

```bash
cd roadtripper-server
npm install

cd ../roadtripper-front
npm install
```

### 3. Configure the server

In `roadtripper-server`, copy the example file and fill it in:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `DB_HOST` | MySQL host (default `127.0.0.1`) |
| `DB_PORT` | MySQL port. The example uses `3307`; the usual MySQL default is `3306`. Use the port of your own installation |
| `DB_USER` | MySQL user (default `root`) |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name (default `roadtripper`) |
| `JWT_SECRET` | Secret used to sign the session token. **At least 32 bytes**, the server refuses to start otherwise |
| `FRONTEND_ORIGINS` | Front-end addresses allowed by CORS, separated by commas (default `http://localhost:5173,http://localhost:5174`) |

You can generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> The `.env` file contains secrets. It is listed in `.gitignore` and must never be committed or shared.

### 4. Create the database

From `roadtripper-server`:

```bash
npm run db:setup
```

This script creates the `roadtripper` database if it does not exist, creates the missing tables (`users`, `road_trips`, `to_dos`, `categories`) and inserts the default categories (Admin, Gear, Bookings). It can be run again safely.

The default categories are read from `roadtripper-front/src/mock/data.json`, so keep this file where it is.

### 5. Start the application

Open two terminals.

**Server** (`roadtripper-server`):

```bash
npm start
```

The API runs on `http://localhost:3000`. Check it at `http://localhost:3000/api/health` and `http://localhost:3000/api/health/database`.

**Front-end** (`roadtripper-front`):

```bash
npm run dev
```

The application opens on `http://localhost:5173`.

By default the front-end calls `http://localhost:3000/api`. To use another address, create `roadtripper-front/.env` with `VITE_API_URL=http://your-address/api`.

## How to use

1. Go to `/register` and create an account (valid email, password of at least 8 characters).
2. Sign in.
3. In **My Trips**, create a trip and choose suggested tasks if you want.
4. Open a trip to see its Kanban board, add tasks and drag them between To Do, Doing and Done.
5. Refresh the page: your trips and tasks are still there because they are saved in MySQL.
6. Sign out: protected pages now redirect you to the login page.

## API overview

All `/api/trips` routes require a valid session cookie.

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/user` | Register |
| POST | `/api/user/login` | Sign in (sets the `jwt` cookie) |
| GET | `/api/user/auth` | Check the current session |
| POST | `/api/user/logout` | Sign out (clears the cookie) |
| GET | `/api/categories` | List categories |
| GET, POST | `/api/trips` | List your trips, create a trip (with optional `tasks`) |
| GET, PUT, DELETE | `/api/trips/:id` | Read, update or delete a trip |
| GET, POST | `/api/trips/:id/tasks` | List or create tasks of a trip |
| GET, PUT, DELETE | `/api/trips/:id/tasks/:taskId` | Read, update (title, status, category) or delete a task |
| GET | `/api/health`, `/api/health/database` | Server and database checks |

## Database

| Table | Content |
| --- | --- |
| `users` | Email (unique) and password hash |
| `road_trips` | Trip details, linked to its owner with `id_user` |
| `to_dos` | Tasks with title, status (`To Do`, `Doing`, `Done`) and optional `id_category`, linked to a trip with `id_trip` |
| `categories` | Name and color of each category |

Deleting a user deletes their trips, and deleting a trip deletes its tasks. Deleting a category keeps the tasks and sets their category to empty.

## Project structure

```
RoadTripper/
├── roadtripper-front/        Vue application
│   └── src/
│       ├── components/       Reusable components (Kanban, modals, navbar...)
│       ├── views/            Pages (login, register, trips, Kanban)
│       ├── stores/           Pinia stores (auth, trips)
│       ├── router/           Routes and session check
│       └── services/api.js   Axios instance (sends the session cookie)
└── roadtripper-server/       Express API
    ├── controllers/          user.controller.js, trips.js, tasks.js
    ├── routes/               user.js, trips.js
    ├── database.js           MySQL connection and Sequelize models
    ├── setup-database.js     Database, tables and default categories
    └── server.js             Express, CORS, cookies, routes
```

## Troubleshooting

- **"Configure JWT_SECRET dans .env avec au moins 32 octets"**: `JWT_SECRET` is missing or too short in `roadtripper-server/.env`.
- **`ECONNREFUSED` or `Database setup failed`**: MySQL is not running, or `DB_PORT`, `DB_USER` or `DB_PASSWORD` is wrong.
- **Login works but the next request returns 401**: the front-end address is not listed in `FRONTEND_ORIGINS`. Add it and restart the server.

## Current limitations

- Profile management (profile photo, password change, account deletion) is not implemented yet.

## Team

- **Valentin**: Node.js back-end, MySQL database, Sequelize models and relationships
- **Mathieu**: registration, login, JWT session, trip endpoints, database setup script
- **Erwan**: task and category endpoints, connection of the Kanban board and trip list to the API, ERD
- **Morgane**: styling, end-to-end tests, README and project plan
