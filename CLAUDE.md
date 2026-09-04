# CLAUDE.md

Guidance for Claude Code (or any agent) working in this repository.

## Project

JobologyX backend — a REST API for a job portal, consumed by two sibling
client repos: `jobologyx_reactjs` (web) and `jobologyx_flutter` (mobile).
Same endpoints, same JWT auth, same roles, same database for both clients.
No client-specific endpoints or logic belong here.

Three roles: `job_seeker`, `recruiter`, `admin`. Admin accounts are never
created via public registration — only via the seed script.

## Tech stack (do not add to this list without being asked)

Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs, Multer (memory storage
only — never disk), Cloudinary, Helmet, CORS, express-rate-limit,
express-validator, dotenv, swagger-jsdoc, swagger-ui-express.

Explicitly out of scope: NestJS, Redis, Kafka, GraphQL, WebSockets,
microservices, Docker, Elasticsearch, payment gateways, AI recommendations,
automated test suites (Jest/Supertest intentionally skipped for this phase).

## Architecture

```
src/
  config/       env, db, cloudinary, swagger setup
  controllers/  req/res only — no business logic here
  middleware/   auth, roles, upload, error handling, rate limiting
  models/       User, Job, Application (Mongoose schemas)
  routes/       route wiring + Swagger JSDoc annotations
  services/     business logic + DB operations (controllers call these)
  validators/   express-validator rule sets
  utils/        asyncHandler, apiResponse (ApiError + sendSuccess), generateToken
  app.js        Express app wiring (no listen())
  server.js     connects DB, then starts the HTTP listener
seed/seed.js    demo data: 1 admin, 2 recruiters, 5 job seekers, 10 jobs, applications
postman/        exported Postman collection
env/            environment files — see "Environment files" below
```

Keep the controller/service split strict: controllers translate HTTP <->
service calls; services own all Mongoose queries and business rules.
Route files carry the Swagger `@openapi` JSDoc blocks — update them
whenever a route's request/response shape changes, since they're the
source of truth for `/api/v1/docs`.

## Response contract

Every response — success or error — is `{ success, message, data }`.
Never `{ error: ... }`. Use `sendSuccess()` from `utils/apiResponse.js` for
success responses and throw `ApiError(statusCode, message)` for failures —
the centralized `errorMiddleware` converts thrown errors (including
Mongoose CastError/ValidationError/duplicate-key and Multer errors) into
that same shape. Never leak stack traces outside development.

## Environment files

Environment variables live under `env/`, split by target:

- `env/.env.test` — local/test credentials (gitignored, never pushed)
- `env/.env.production` — production credentials (gitignored, never pushed)
- `env/.env.test.example` / `env/.env.production.example` — tracked templates

`src/config/env.js` picks the file based on `NODE_ENV`: `production` loads
`env/.env.production`, anything else loads `env/.env.test`. When adding a
new required variable, update **both** example files and this mapping
logic stays untouched — don't reintroduce a root-level `.env`.

## Conventions

- CommonJS (`require`/`module.exports`), not ESM.
- API is versioned under `/api/v1` — every new route goes there.
- Pagination: `page`/`limit` query params, response includes
  `{ page, limit, total, totalPages }`; cap `limit` at a sane max (see
  `MAX_LIMIT` in the relevant service).
- A recruiter may only ever act on jobs/applications where they are the
  owner (`job.createdBy` / `application.recruiter`) — admin bypasses this,
  no one else does.
- Don't add validation, abstractions, or config knobs beyond what's
  actually used — this is meant to stay interview-explainable, not
  enterprise-scaled.

## Local development

```bash
npm install
npm run dev     # nodemon, loads env/.env.test (NODE_ENV defaults to development)
npm run seed    # wipes and reseeds Users/Jobs/Applications
```

Swagger UI: `http://localhost:<PORT>/api/v1/docs`.

To run against production config locally (rare — normally only the
deploy target does this): set `NODE_ENV=production` before starting, which
switches the loaded file to `env/.env.production`.

## Branching

`master` is production. Work lands on `test` first; only merge to `master`
once it's been verified end-to-end (manual pass per the README's test
checklist — there is no automated test suite for this phase).
