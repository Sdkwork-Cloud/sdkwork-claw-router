# SDKWork File Picker PC React

Embeddable file picker components for business pages.

The picker loads files through `@sdkwork/file-service` and returns stable
`FileRef` values. It does not expose object storage keys, bucket names, or
presigned URLs.

Business pages configure `slotCode`, optional target, and selection mode. The
component remains a reusable file-platform block instead of a storage-specific
browser.
