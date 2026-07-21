# Decision Logs

## Ticket 04 - S3 Storage Integration

- Decided to upload to S3 using a readable stream of the buffer to avoid memory ballooning and meet spec requirements.
- Implemented database record rollback inside a try/catch if S3 upload fails to prevent stranding records, as requested by the Spec Reviewer.
- Handled mock types properly in vitest for AWS SDK to comply with Node/TS Testing best practices.
