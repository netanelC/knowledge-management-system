# 07 — Text Document Extraction

**What to build:** When a text file is uploaded, the backend extracts the raw string content and persists it to the `extractedText` column in the database.

**Blocked by:** 05 — Asset List UI

**Status:** ready-for-agent

- [x] Backend converts the uploaded text file buffer to a string.
- [x] Backend saves this string into the `extractedText` field of the `Asset` record.
