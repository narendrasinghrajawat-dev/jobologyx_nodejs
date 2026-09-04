# JobologyX — Backend API

A production-style Job Portal REST API built with Node.js, Express, and MongoDB. It is the single backend consumed by both the **JobologyX React web app** (`jobologyx_reactjs`) and the **JobologyX Flutter mobile app** (`jobologyx_flutter`) — same endpoints, same auth, same roles, same database.

## 1. Project Overview

JobologyX connects three kinds of users:

- **Job Seekers** — search/browse jobs, apply, upload resumes, track applications.
- **Recruiters** — post and manage jobs, review applications, update application status.
- **Admins** — manage users, jobs, and applications, and view platform-wide stats.

## 2. Features

- JWT authentication with role-based authorization (`job_seeker`, `recruiter`, `admin`)
- Job CRUD with search, filtering, sorting, and pagination
- Job applications with duplicate-prevention and status tracking
- File uploads (profile image, resume, company logo) via Multer (memory storage) → Cloudinary
- Admin dashboard with aggregated platform statistics
- Centralized error handling with a consistent JSON response shape
- Security: Helmet, CORS (web-only), rate limiting, bcrypt password hashing
- Swagger/OpenAPI documentation
- Seed script with realistic demo data

## 3. Tech Stack

Node.js, Express.js, MongoDB (Atlas), Mongoose, JWT, bcryptjs, Multer, Cloudinary, Helmet, CORS, express-rate-limit, express-validator, dotenv, swagger-jsdoc, swagger-ui-express.

## 4. Installation

```bash
npm install
```

## 5. Environment Variables

Environment files live under `env/`, split by target, and are picked automatically based on `NODE_ENV`:

| File | Loaded when | Tracked in git? |
|---|---|---|
| `env/.env.test` | `NODE_ENV` is unset or anything other than `production` (default for `npm run dev`) | No — gitignored |
| `env/.env.production` | `NODE_ENV=production` | No — gitignored |
| `env/.env.test.example` | — (template only) | Yes |
| `env/.env.production.example` | — (template only) | Yes |

Copy the relevant example to its real filename and fill in credentials:

```bash
cp env/.env.test.example env/.env.test
cp env/.env.production.example env/.env.production
```

```
NODE_ENV=development
PORT=5000

MONGODB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

WEB_CLIENT_URL=
```

- `WEB_CLIENT_URL` accepts a comma-separated list (e.g. local + deployed React URLs). The Flutter app is a native client and does not need a CORS entry.
- The real `env/.env.test` and `env/.env.production` files are never pushed — they hold live credentials. Only the `.example` templates are committed.
- To run locally against the production file (rare), set `NODE_ENV=production` before starting the server.

## 6. Database Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist your IP (or `0.0.0.0/0` for development).
3. Copy the connection string into `MONGODB_URI` in `env/.env.test` (and `env/.env.production` for your production cluster).

## 7. Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the dashboard, copy `Cloud Name`, `API Key`, and `API Secret` into `env/.env.test` / `env/.env.production`.

## 8. Running Locally

```bash
# development (auto-restart)
npm run dev

# production
npm start
```

Server starts on `http://localhost:5000` (or your configured `PORT`).

## 9. Seed Data

```bash
npm run seed
```

Creates 1 admin, 2 recruiters, 5 job seekers, 10 jobs, and several applications. See console output for login credentials.

| Role | Email | Password |
|---|---|---|
| Admin | admin@jobologyx.example.com | Admin@123 |
| Recruiter | neha.recruiter@example.com | Recruiter@123 |
| Recruiter | karan.recruiter@example.com | Recruiter@123 |
| Job Seeker | aarav.seeker@example.com | Seeker@123 |

> Admin accounts can only be created via this seed script — public registration only allows `job_seeker` or `recruiter`.

## 10. API Documentation

Interactive Swagger UI: **`http://localhost:5000/api/v1/docs`**

A Postman collection is also included at [`postman/JobologyX.postman_collection.json`](postman/JobologyX.postman_collection.json) — import it and set the `baseUrl` and `token` collection variables.

## 11. Authentication

1. `POST /api/v1/auth/register` or `/auth/login` returns a JWT.
2. Send it on subsequent requests: `Authorization: Bearer <token>`.
3. JWT payload contains `userId` and `role`; expiry controlled by `JWT_EXPIRES_IN`.

## 12. User Roles

| Role | Can do |
|---|---|
| `job_seeker` | Browse/search jobs, apply, manage own profile/resume, view own applications |
| `recruiter` | Create/update/delete own jobs, manage applications for own jobs, manage own company profile |
| `admin` | Manage all users, jobs, and applications; view dashboard stats |

## 13. API Endpoints

All routes are prefixed with `/api/v1`.

### Auth
| Method | Route | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Authenticated |

### Users
| Method | Route | Access |
|---|---|---|
| GET | `/users/me` | Authenticated |
| PATCH | `/users/me` | Authenticated |
| POST | `/users/me/profile-image` | Authenticated (all roles) |
| POST | `/users/me/resume` | Authenticated (job seeker only) |

### Jobs
| Method | Route | Access |
|---|---|---|
| GET | `/jobs` | Public — supports `search`, `location`, `jobType`, `workMode`, `category`, `experience`, `salaryMin`, `salaryMax`, `status`, `sort`, `page`, `limit` |
| GET | `/jobs/:id` | Public |
| POST | `/jobs` | Recruiter |
| PATCH | `/jobs/:id` | Recruiter (own job) |
| DELETE | `/jobs/:id` | Recruiter (own job) |

### Applications
| Method | Route | Access |
|---|---|---|
| POST | `/applications` | Job seeker |
| GET | `/applications/my` | Job seeker |
| GET | `/applications/recruiter` | Recruiter |
| GET | `/applications/:id` | Owner applicant, owning recruiter, or admin |
| PATCH | `/applications/:id/status` | Recruiter (owning job) |

### Admin
| Method | Route | Access |
|---|---|---|
| GET | `/admin/dashboard` | Admin |
| GET | `/admin/users` | Admin |
| PATCH | `/admin/users/:id/status` | Admin |
| DELETE | `/admin/users/:id` | Admin |
| GET | `/admin/jobs` | Admin |
| PATCH | `/admin/jobs/:id/status` | Admin |
| DELETE | `/admin/jobs/:id` | Admin |
| GET | `/admin/applications` | Admin |

## 14. Sample Requests / Responses

**Register**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "job_seeker"
}
```
```json
{
  "success": true,
  "message": "Registration successful",
  "data": { "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "job_seeker" }, "token": "eyJhbGciOi..." }
}
```

**Login**
```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "jane@example.com", "password": "password123" }
```
```json
{
  "success": true,
  "message": "Login successful",
  "data": { "user": {}, "token": "JWT_TOKEN" }
}
```

**Error response shape**
```json
{ "success": false, "message": "Invalid email or password", "data": null }
```

## 15. Project Structure

```
src/
  config/        # env, db, cloudinary, swagger
  controllers/    # request/response handling only
  middleware/     # auth, roles, upload, error, rate limit
  models/         # User, Job, Application
  routes/         # route definitions + Swagger JSDoc
  services/       # business logic + DB operations
  validators/     # express-validator rules
  utils/          # asyncHandler, apiResponse, generateToken
  app.js
  server.js
seed/
  seed.js
postman/
  JobologyX.postman_collection.json
env/
  .env.test.example
  .env.production.example
  .env.test          # gitignored, real credentials
  .env.production     # gitignored, real credentials
```

## 16. Architecture Notes

- **Controller/Service split**: controllers only handle req/res; all business logic and DB access lives in `services/`.
- **Storage abstraction**: `services/storageService.js` wraps Cloudinary uploads behind a generic `uploadBuffer()` function, so swapping to AWS S3/MinIO later only touches this one file.
- **No local disk writes**: Multer uses memory storage — file buffers stream directly to Cloudinary.
