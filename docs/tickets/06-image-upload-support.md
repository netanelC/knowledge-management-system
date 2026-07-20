# 06 — Image Upload Support

**What to build:** The UI upload form is extended to accept images. The backend correctly identifies the MIME type, saves the image to S3, and the frontend list differentiates by displaying an image thumbnail.

**Blocked by:** 05 — Asset List UI

**Status:** ready-for-agent

- [ ] UI file picker accepts image formats.
- [ ] Backend reads the MIME type and sets the `Asset.type` to `IMAGE` in the DB.
- [ ] Frontend uses the asset `id` (as the S3 key) to fetch and display an image thumbnail in the list.
