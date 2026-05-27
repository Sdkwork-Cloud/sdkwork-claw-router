# SDKWork File Upload PC React

Slot-based upload building blocks for PC React applications.

Business callers provide a `slotCode` and target object. Components delegate
policy, quota, upload session, and completion work through `@sdkwork/file-service`.

The default transport delegates to `@sdkwork/file-upload-client`, performs only
short-lived presigned upload operations issued by the service, and can request
multipart part grants through `service.presignUploadPart`. Completed business
state is returned as a stable `FileRef`.
