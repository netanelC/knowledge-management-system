# 09 — AI Metadata Generation (Images)

**What to build:** The backend passes the uploaded image buffer to the Gemini Vision API to generate visual metadata. It saves the `AssetMetadata` record, and the frontend displays these visual tags next to the image thumbnail.

**Blocked by:** 06 — Image Upload Support, 08 — AI Metadata Generation (Documents)

**Status:** ready-for-agent

- [ ] Backend converts the image buffer for Gemini Vision compatibility.
- [ ] Backend prompts Gemini to describe the image visually.
- [ ] Backend saves the resulting `AssetMetadata`.
- [ ] Frontend displays the tags next to the image thumbnail.
