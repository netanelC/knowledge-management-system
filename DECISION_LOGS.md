# Decision Logs

## Ticket 04 - S3 Storage Integration

- Decided to upload to S3 using a readable stream of the buffer to satisfy AWS SDK types, but noted that since `multer` uses memory storage, the file is already in memory so memory ballooning is not prevented at this stage. (True streaming would require `multer` configuration changes).
- Implemented database record rollback inside a try/catch if S3 upload fails to prevent stranding records, as requested by the Spec Reviewer.
- Handled mock types properly in vitest for AWS SDK to comply with Node/TS Testing best practices.
- Fixed AWS credentials instantiation to allow default fallback when env vars are empty, complying with standard AWS IAM usage in production.
