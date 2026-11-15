# GearUP

A web app to organise road trips: one workspace per trip and a Kanban board (To Do / Doing / Done) to track the preparation.

Project for the course MOD8 - Advanced Web Programming (Concordia Continuing Education).

## Tech stack

| Layer | Technologies |
|---|---|
| Front-end | Vue 3, Vite, Vue Router, Pinia, Tailwind CSS, vuedraggable, Axios |
| Back-end | Node.js, Express 5, Sequelize, JSON Web Tokens, bcryptjs |
| Database | MySQL |

## Getting started

### Prerequisites

- Node.js 18 or later
- A running MySQL server

### 1. Clone the project

```bash
git clone https://github.com/Morgane2468/RoadTripper.git
cd RoadTripper
```

### 2. Set up the back-end

```bash
cd roadtripper-server
npm install
cp .env.example .env
```

Open `.env` and fill in your own values:

| Variable | Description |
|---|---|
| `DB_HOST`, `DB_PORT` | Where MySQL is running (the default MySQL port is usually `3306`) |
| `DB_USER`, `DB_PASSWORD` | Your MySQL credentials |
| `DB_NAME` | Database name (`roadtripper`) |
| `JWT_SECRET` | Secret used to sign login tokens, at least 32 bytes. Generate one with `openssl rand -hex 32` |
| `FRONTEND_ORIGINS` | Front-end URLs allowed by CORS (default: `http://localhost:5173,http://localhost:5174`) |

Then create the database and start the server:

```bash
npm run db:setup   # creates the database, the tables and the task categories
npm start          # API on http://localhost:3000
```

Check that it works: <http://localhost:3000/api/health> (server) and <http://localhost:3000/api/health/database> (MySQL connection).

### 3. Set up the front-end

In a second terminal:

```bash
cd roadtripper-front
npm install
npm run dev
```

Open <http://localhost:5173/>, create an account and log in.

The front-end calls `http://localhost:3000/api` by default. To use another URL, set `VITE_API_URL` in a `.env` file in `roadtripper-front`.

> **Upgrading an existing database?** The `currency` column was added to trips after the first version. If your `road_trips` table was created before that, run:
>
> ```sql
> ALTER TABLE road_trips ADD COLUMN currency VARCHAR(3) NOT NULL DEFAULT 'CAD';
> ```

## Features

- **Accounts:** registration and login with form validation. Passwords are hashed with bcrypt and the session is a JWT stored in a cookie (1 hour).
- **Protected pages:** the trip pages require a logged-in user, both in the router and on the API.
- **Trips:** create, view, **edit** and delete trips. Each trip has a name, destination, type, dates, number of travelers, transport, budget with currency, visibility and a description. Editing a trip (for example the budget or the number of travelers) uses the same form as the creation.
- **Suggested tasks:** when creating a trip, a checklist is suggested according to the trip type (Beach, Mountain, Snow, City...). The user can uncheck what is not needed.
- **Kanban board:** 3 columns with drag and drop, task categories (Admin, Gear, Bookings) and a progress bar for each trip.
- **Dashboard:** key figures on the trips page (number of trips, tasks done and left, overall readiness).

## Project structure

### `roadtripper-front/src`

| Folder / file | Role |
|---|---|
| `views/` | Pages: login, registration, list of trips, Kanban board of a trip |
| `components/` | Reusable parts: navigation bar, Kanban column, task card, trip and task forms, stats... |
| `stores/auth.js` | Pinia store for the logged-in user (login, logout, session restore) |
| `stores/trips.js` | Pinia store for trips and tasks: load, add, update, delete, change status, progress |
| `router/index.js` | List of pages and route guard for pages that need a login |
| `services/api.js` | Axios instance used for every call to the API |
| `data/tripTemplates.js` | Suggested tasks for each trip type |
| `mock/data.json` | Task categories, used by `npm run db:setup` to fill the `categories` table |
| `assets/main.css` | Theme colors and fonts (Tailwind) |

### `roadtripper-server`

| Folder / file | Role |
|---|---|
| `server.js` | Express app: CORS, cookies, routes, error handling, health checks |
| `database.js` | Sequelize connection and models (User, Trip, Category, Task) |
| `setup-database.js` | Creates the database and tables and inserts the task categories |
| `routes/` | Route definitions for users and trips |
| `controllers/` | Logic for users and authentication, trips and tasks |

## API

All `/api/trips` routes require a logged-in user, and a user can only access their own trips.

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/user` | Create an account |
| `POST` | `/api/user/login` | Log in |
| `GET` | `/api/user/auth` | Get the current user |
| `POST` | `/api/user/logout` | Log out |
| `GET` | `/api/categories` | List the task categories |
| `GET` | `/api/trips` | List the user's trips |
| `POST` | `/api/trips` | Create a trip (with optional suggested tasks) |
| `GET` | `/api/trips/:id` | Get one trip |
| `PUT` | `/api/trips/:id` | Update a trip |
| `DELETE` | `/api/trips/:id` | Delete a trip and its tasks |
| `GET` | `/api/trips/:id/tasks` | List the tasks of a trip |
| `POST` | `/api/trips/:id/tasks` | Add a task |
| `PUT` | `/api/trips/:id/tasks/:taskId` | Update a task (title, status, category) |
| `DELETE` | `/api/trips/:id/tasks/:taskId` | Delete a task |

## Roadmap

Planned but not implemented yet:

- **Discover:** destination ideas and ready-made itineraries
- **Calendar:** trips on a monthly calendar, with upcoming departures
- **Budget:** budget overview and expense tracking
- User profile and settings
- Sharing trips according to their visibility (Private / Shared with friends / Public)
- Automated tests

## Team

Valentin, Morgane, Erwan, Mathieu