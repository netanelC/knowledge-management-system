# 03 — Database Asset Persistence

**What to build:** Upon text upload, the backend creates the actual `Asset` record in the database using Prisma (temporarily storing a dummy `s3Key` or null). The frontend displays the newly generated database UUID.

**Blocked by:** 02 — Basic File Selection (In-Memory)

**Status:** ready-for-agent

- [ ] Backend validates the uploaded file.
- [ ] Backend creates an `Asset` record in PostgreSQL using Prisma.
- [ ] Backend returns the newly created `Asset` object.
- [ ] Frontend displays the database-generated `id` confirming persistence.
