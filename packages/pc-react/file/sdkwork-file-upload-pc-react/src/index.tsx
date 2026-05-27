import React, { useId, useRef, useState } from "react";
import type { SdkworkFileRef } from "../../../../common/file/sdkwork-file-contracts/src/index";
import { createPresignedUploadTransport } from "../../../../common/file/sdkwork-file-upload-client/src/index";
import type {
  FilePlatformService,
  ManagedUploadSessionResult,
} from "../../../../common/file/sdkwork-file-service/src/index";
import type { FileUploadTarget } from "../../../../common/file/sdkwork-file-sdk-ports/src/index";

export type FileUploadButtonStatus =
  | "completed"
  | "completing"
  | "creating"
  | "failed"
  | "idle"
  | "uploading";

export interface FileUploadTransportInput {
  file: File;
  service: FilePlatformService;
  session: ManagedUploadSessionResult;
}

export interface FileUploadTransport {
  uploadFile(input: FileUploadTransportInput): Promise<void>;
}

export interface FileUploadButtonCompletedResult {
  fileRef: SdkworkFileRef;
  sessionId: string;
}

export interface FileUploadButtonProps {
  accept?: string;
  disabled?: boolean;
  idempotencyKeyFactory?: (file: File) => string;
  label?: string;
  onCompleted?: (result: FileUploadButtonCompletedResult) => void;
  onError?: (error: Error) => void;
  requestIdFactory?: (phase: "complete" | "create", file: File) => string;
  service: FilePlatformService;
  slotCode: string;
  target: FileUploadTarget;
  uploadTransport?: FileUploadTransport;
}

export type FileUploadQueueItemStatus =
  | "completed"
  | "failed"
  | "queued"
  | "uploading";

export interface FileUploadQueueItem {
  filename: string;
  id: string;
  progress: number;
  status: FileUploadQueueItemStatus;
}

export interface FileUploadQueueProps {
  items: readonly FileUploadQueueItem[];
  title?: string;
}

export function FileUploadButton({
  accept,
  disabled = false,
  idempotencyKeyFactory = defaultIdempotencyKey,
  label = "Upload file",
  onCompleted,
  onError,
  requestIdFactory = defaultRequestId,
  service,
  slotCode,
  target,
  uploadTransport = defaultUploadTransport,
}: FileUploadButtonProps): React.ReactElement {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<FileUploadButtonStatus>("idle");

  async function handleFile(file: File): Promise<void> {
    try {
      setStatus("creating");
      const session = await service.createUploadSession({
        contentType: file.type || "application/octet-stream",
        filename: file.name,
        idempotencyKey: idempotencyKeyFactory(file),
        requestId: requestIdFactory("create", file),
        sizeBytes: file.size,
        slotCode,
        target,
      });

      setStatus("uploading");
      await uploadTransport.uploadFile({ file, service, session });

      setStatus("completing");
      const completed = await service.completeUpload({
        idempotencyKey: `${idempotencyKeyFactory(file)}:complete`,
        requestId: requestIdFactory("complete", file),
        sessionId: session.sessionId,
        slotCode,
      });

      setStatus("completed");
      onCompleted?.({
        fileRef: completed.fileRef,
        sessionId: session.sessionId,
      });
    } catch (error) {
      const normalized = normalizeError(error);
      setStatus("failed");
      onError?.(normalized);
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (file) {
      void handleFile(file);
    }
  }

  return (
    <>
      <button
        data-upload-status={status}
        disabled={disabled || status === "creating" || status === "uploading" || status === "completing"}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {label}
      </button>
      <input
        accept={accept}
        aria-label={`${label} input`}
        id={inputId}
        onChange={handleInputChange}
        ref={inputRef}
        style={{ display: "none" }}
        type="file"
      />
    </>
  );
}

export function FileUploadQueue({
  items,
  title = "File uploads",
}: FileUploadQueueProps): React.ReactElement {
  return (
    <section aria-label={title}>
      <ul aria-label={title}>
        {items.map((item) => (
          <li data-upload-status={item.status} key={item.id}>
            <span>{item.filename}</span>
            <span>{item.status}</span>
            <span>{formatProgress(item.progress)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const defaultUploadTransport: FileUploadTransport = {
  async uploadFile({ file, service, session }) {
    const transport = createPresignedUploadTransport();
    await transport.uploadFile({
      file,
      presignPart: async ({ partNumber, sessionId }) => service.presignUploadPart({
        partNumber,
        requestId: `file-upload:part:${sessionId}:${partNumber}`,
        sessionId,
      }),
      session,
    });
  },
};

function defaultIdempotencyKey(file: File): string {
  return `upload:${file.name}:${file.size}:${file.lastModified}`;
}

function defaultRequestId(phase: "complete" | "create", file: File): string {
  return `file-upload:${phase}:${file.name}:${file.size}:${file.lastModified}`;
}

function formatProgress(progress: number): string {
  const bounded = Math.max(0, Math.min(100, Math.round(progress)));
  return `${bounded}%`;
}

function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
