# Decision Logs

## Ticket 04 - S3 Storage Integration

- Decided to upload to S3 using a readable stream of the buffer to satisfy AWS SDK types, but noted that since `multer` uses memory storage, the file is already in memory so memory ballooning is not prevented at this stage. (True streaming would require `multer` configuration changes).
- Implemented database record rollback inside a try/catch if S3 upload fails to prevent stranding records, as requested by the Spec Reviewer.
- Handled mock types properly in vitest for AWS SDK to comply with Node/TS Testing best practices.
- Fixed AWS credentials instantiation to allow default fallback when env vars are empty, complying with standard AWS IAM usage in production.

## Ticket 05 - Asset List UI

- Added auto-refresh mechanism to fetch assets immediately after a new file is uploaded (`onUploadSuccess` and `refreshKey` in React). Although not strictly in the spec, this provides essential user experience feedback.
- Added `orderBy: { createdAt: 'desc' }` to backend API so newly uploaded assets appear first.
- Extracted common duplicated code (`getErrorMessage`, SVG Document Icon, Date formatting) following Fowler's Duplicate Code smell.
- Included an extensive UI overhaul with animations and a glassmorphism layout grid to fulfill the systemic instruction to use "Rich Aesthetics" and "Dynamic Design".

## Ticket 06 - Image Upload Support

- Created an `AssetType` enum in Prisma (`DOCUMENT`, `IMAGE`) to persist the mime-type categorization.
- Created `GET /api/assets/:id/download` endpoint to proxy the S3 asset stream through the backend. This avoids the need for presigned URLs or complex bucket policies while allowing the frontend to easily fetch the image thumbnail using standard `<img>` tags.

## Ticket 07 - Text Document Extraction

- Added `extractedText` field to `Asset` model in Prisma.
- Backend converts the uploaded text file buffer to a string in `service.ts` if the file is a document, and persists it in the `extractedText` column upon creation.
- Used `Buffer.toString('utf-8')` to decode the text since `file.buffer` is available via `multer` memory storage.
