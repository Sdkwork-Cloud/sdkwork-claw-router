import type {
  PresignUploadPartResult,
  PresignedUploadGrant,
} from "../../sdkwork-file-sdk-ports/src/index";

export type FileUploadClientStatus = "uploaded";

export interface FileUploadClientResponse {
  headers: {
    get(name: string): string | null;
  };
  ok: boolean;
  status: number;
}

export interface FileUploadClientFetchInit {
  body?: BodyInit | null;
  headers?: Record<string, string>;
  method?: string;
}

export type FileUploadClientFetch = (
  url: string,
  init: FileUploadClientFetchInit,
) => Promise<FileUploadClientResponse>;

export interface UploadSinglePartInput {
  body: BodyInit;
  fetchImpl?: FileUploadClientFetch;
  now?: () => Date;
  presigned: PresignedUploadGrant;
}

export interface UploadSinglePartResult {
  etag?: string;
  status: FileUploadClientStatus;
}

export interface UploadMultipartProgressEvent {
  partNumber: number;
  totalBytes: number;
  totalParts: number;
  uploadedBytes: number;
}

export interface UploadMultipartInput {
  blob: Blob;
  fetchImpl?: FileUploadClientFetch;
  now?: () => Date;
  onProgress?: (event: UploadMultipartProgressEvent) => void;
  partSizeBytes: number;
  presignPart: (input: { partNumber: number; sessionId: string }) => Promise<PresignUploadPartResult>;
  sessionId: string;
  totalParts: number;
}

export interface UploadedMultipartPart {
  etag?: string;
  partNumber: number;
  sizeBytes: number;
}

export interface UploadMultipartResult {
  parts: UploadedMultipartPart[];
  status: FileUploadClientStatus;
  uploadedBytes: number;
}

export interface PresignedUploadTransportSession {
  partSizeBytes?: number;
  presigned?: PresignedUploadGrant;
  sessionId: string;
  totalParts?: number;
  uploadMode: string;
}

export interface PresignedUploadTransportInput {
  file: Blob;
  presignPart?: (input: { partNumber: number; sessionId: string }) => Promise<PresignUploadPartResult>;
  session: PresignedUploadTransportSession;
}

export interface PresignedUploadTransport {
  uploadFile(input: PresignedUploadTransportInput): Promise<void>;
}

export interface CreatePresignedUploadTransportOptions {
  fetchImpl?: FileUploadClientFetch;
  now?: () => Date;
}

export class FileUploadClientError extends Error {
  readonly code: string;
  readonly details: Record<string, unknown>;

  constructor(code: string, message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = "FileUploadClientError";
    this.code = code;
    this.details = { ...details };
  }
}

export function createPresignedUploadTransport({
  fetchImpl = defaultFetch,
  now = () => new Date(),
}: CreatePresignedUploadTransportOptions = {}): PresignedUploadTransport {
  return {
    async uploadFile({ file, presignPart, session }) {
      if (session.uploadMode === "multipart") {
        if (!presignPart) {
          throw new FileUploadClientError(
            "upload.multipart_presigner_required",
            "Multipart upload requires a part presigner.",
            { sessionId: session.sessionId },
          );
        }
        await uploadMultipartWithPresignedParts({
          blob: file,
          fetchImpl,
          now,
          partSizeBytes: requiredPositiveNumber(session.partSizeBytes, "Multipart upload requires partSizeBytes."),
          presignPart,
          sessionId: session.sessionId,
          totalParts: requiredPositiveNumber(session.totalParts, "Multipart upload requires totalParts."),
        });
        return;
      }

      if (!session.presigned) {
        throw new FileUploadClientError(
          "upload.presigned_required",
          "Upload session did not include a presigned upload grant.",
          { sessionId: session.sessionId, uploadMode: session.uploadMode },
        );
      }
      await uploadSinglePartWithPresignedUrl({
        body: file,
        fetchImpl,
        now,
        presigned: session.presigned,
      });
    },
  };
}

export async function uploadSinglePartWithPresignedUrl({
  body,
  fetchImpl = defaultFetch,
  now = () => new Date(),
  presigned,
}: UploadSinglePartInput): Promise<UploadSinglePartResult> {
  validatePresignedGrant(presigned, now);
  const response = await fetchImpl(presigned.url, {
    body,
    headers: { ...presigned.headers },
    method: presigned.method,
  });
  assertUploadResponse(response, "single");
  const etag = response.headers.get("ETag") ?? undefined;
  return {
    ...(etag ? { etag } : {}),
    status: "uploaded",
  };
}

export async function uploadMultipartWithPresignedParts({
  blob,
  fetchImpl = defaultFetch,
  now = () => new Date(),
  onProgress,
  partSizeBytes,
  presignPart,
  sessionId,
  totalParts,
}: UploadMultipartInput): Promise<UploadMultipartResult> {
  if (partSizeBytes <= 0 || totalParts <= 0) {
    throw new FileUploadClientError("upload.multipart_invalid", "Multipart upload part size and total parts must be positive.", {
      partSizeBytes,
      totalParts,
    });
  }

  const parts: UploadedMultipartPart[] = [];
  let uploadedBytes = 0;

  for (let partNumber = 1; partNumber <= totalParts; partNumber += 1) {
    const start = (partNumber - 1) * partSizeBytes;
    const end = Math.min(start + partSizeBytes, blob.size);
    const partBody = blob.slice(start, end);
    const partGrant = await presignPart({ partNumber, sessionId });
    validatePresignedGrant(partGrant.presigned, now);

    const response = await fetchImpl(partGrant.presigned.url, {
      body: partBody,
      headers: { ...partGrant.presigned.headers },
      method: partGrant.presigned.method,
    });
    assertUploadResponse(response, `part ${partNumber}`);

    const sizeBytes = partBody.size;
    uploadedBytes += sizeBytes;
    const etag = response.headers.get("ETag") ?? undefined;
    parts.push({
      ...(etag ? { etag } : {}),
      partNumber,
      sizeBytes,
    });
    onProgress?.({
      partNumber,
      totalBytes: blob.size,
      totalParts,
      uploadedBytes,
    });
  }

  return {
    parts,
    status: "uploaded",
    uploadedBytes,
  };
}

function validatePresignedGrant(presigned: PresignedUploadGrant, now: () => Date): void {
  if (presigned.method !== "PUT" && presigned.method !== "POST") {
    throw new FileUploadClientError("upload.presigned_method_unsupported", "Presigned upload method is not supported.", {
      method: presigned.method,
    });
  }
  if (new Date(presigned.expiresAt).getTime() <= now().getTime()) {
    throw new FileUploadClientError("upload.presigned_expired", "Presigned upload grant has expired.", {
      expiresAt: presigned.expiresAt,
    });
  }
}

function assertUploadResponse(response: FileUploadClientResponse, phase: string): void {
  if (!response.ok) {
    throw new FileUploadClientError("upload.presigned_http_failed", "Presigned upload request failed.", {
      phase,
      status: response.status,
    });
  }
}

function requiredPositiveNumber(value: number | undefined, message: string): number {
  if (value === undefined || value <= 0) {
    throw new FileUploadClientError("upload.multipart_invalid", message, { value });
  }
  return value;
}

const defaultFetch: FileUploadClientFetch = async (url, init) => {
  const response = await fetch(url, init);
  return {
    headers: response.headers,
    ok: response.ok,
    status: response.status,
  };
};
