# 02 — Basic File Selection (In-Memory)

**What to build:** The UI features a file picker and an upload button. The backend receives the file buffer via a `POST /api/assets` endpoint using `multer` and simply echoes the file's metadata (name/size) back to the UI.

**Blocked by:** 01 — Hello World Fullstack (Foundation)

**Status:** ready-for-agent

- [ ] UI features a file picker and an "Upload" button for text files.
- [ ] Backend exposes `POST /api/assets` and parses `multipart/form-data` using `multer`.
- [ ] Backend returns the file's metadata (e.g., original filename) as a JSON response.
- [ ] Frontend displays the success response.
