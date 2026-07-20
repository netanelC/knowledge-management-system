# 01 — Hello World Fullstack (Foundation)

**What to build:** The Turborepo is configured (`frontend`, `backend`, `types`). The React app makes a `GET /api/health` call to Express. Express reads a simple value from the PostgreSQL database (using Prisma) and returns it. React displays it on screen.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Turborepo with `frontend`, `backend`, and `types` packages is configured and starts up.
- [ ] Database connection is established via Prisma.
- [ ] Backend serves a `/api/health` endpoint that queries the DB.
- [ ] Frontend successfully calls `/api/health` and displays the result.
