# SDKWork File Service

Service orchestration for the SDKWork file platform.

The service validates business file slots, reserves quota, delegates upload and
binding work through SDK ports, and returns stable file references. It does not
perform raw HTTP requests or object-storage operations directly.

Multipart uploads request per-part presigned grants through `presignUploadPart`.
The HTTP transfer itself belongs to `@sdkwork/file-upload-client` or a host
provided transport.

It also exposes file listing, file binding management, short-lived file access
URL issuance, drive browsing, and scoped storage usage reads for UI building
blocks while preserving the rule that business callers never handle buckets,
object keys, provider internals, or presigned URLs as durable data.

`bindFile` enforces slot cardinality before creating a binding, so single and
bounded multi-file slots cannot be overfilled by callers that bypass UI
components.
