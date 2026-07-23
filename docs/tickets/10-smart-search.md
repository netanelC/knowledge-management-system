# 10 — Smart Search

**What to build:** A search bar is added to the UI. Typing a query performs a database search against `filename`, `extractedText`, `description`, and `keywords`, instantly filtering the displayed asset list.

**Blocked by:** 09 — AI Metadata Generation (Images)

**Status:** done

- [x] UI adds a search input field.
- [x] Backend `GET /api/assets` accepts an optional `q` query string parameter.
- [x] Prisma executes a search query across the relevant string fields.
- [x] Frontend dynamically updates the list based on the search results.
