# 08 — AI Metadata Generation (Documents)

**What to build:** The backend sends the extracted document text to the Gemini API to generate a `description` and `keywords`. It saves an `AssetMetadata` record, and the frontend displays these tags next to the document in the list.

**Blocked by:** 07 — Text Document Extraction

**Status:** done

- [x] Backend integrates the Gemini SDK.
- [x] Backend prompts Gemini with the extracted text to summarize and generate tags.
- [x] Backend creates an `AssetMetadata` record linked to the `Asset`.
- [x] Frontend fetches and displays the description and keywords in the list.
