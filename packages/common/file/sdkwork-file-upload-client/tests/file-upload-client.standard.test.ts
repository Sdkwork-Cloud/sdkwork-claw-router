import { describe, expect, it } from "vitest";

import {
  FileUploadClientError,
  createPresignedUploadTransport,
  uploadMultipartWithPresignedParts,
  uploadSinglePartWithPresignedUrl,
} from "../src/index";

describe("SDKWork file upload client", () => {
  it("uploads a single body through a service-issued presigned grant", async () => {
    const calls: RecordedFetchCall[] = [];
    const result = await uploadSinglePartWithPresignedUrl({
      body: new Blob(["hello"]),
      fetchImpl: createRecordingFetch(calls, { etag: "etag-single", status: 200 }),
      now: () => new Date("2026-05-23T08:00:00.000Z"),
      presigned: {
        expiresAt: "2026-05-23T08:10:00.000Z",
        headers: { "Content-Type": "text/plain" },
        method: "PUT",
        url: "https://upload.example.test/presigned",
      },
    });

    expect(result).toEqual({
      etag: "etag-single",
      status: "uploaded",
    });
    expect(calls).toEqual([
      {
        bodySize: 5,
        headers: { "Content-Type": "text/plain" },
        method: "PUT",
        url: "https://upload.example.test/presigned",
      },
    ]);
    expect(result).not.toHaveProperty("url");
    expect(result).not.toHaveProperty("objectKey");
  });

  it("rejects expired presigned grants before sending HTTP requests", async () => {
    const calls: RecordedFetchCall[] = [];

    await expect(
      uploadSinglePartWithPresignedUrl({
        body: new Blob(["hello"]),
        fetchImpl: createRecordingFetch(calls, { status: 200 }),
        now: () => new Date("2026-05-23T08:11:00.000Z"),
        presigned: {
          expiresAt: "2026-05-23T08:10:00.000Z",
          headers: {},
          method: "PUT",
          url: "https://upload.example.test/expired",
        },
      }),
    ).rejects.toMatchObject({
      code: "upload.presigned_expired",
    });
    expect(calls).toEqual([]);
  });

  it("normalizes failed presigned HTTP responses as upload client errors", async () => {
    await expect(
      uploadSinglePartWithPresignedUrl({
        body: new Blob(["hello"]),
        fetchImpl: createRecordingFetch([], { status: 403 }),
        now: () => new Date("2026-05-23T08:00:00.000Z"),
        presigned: {
          expiresAt: "2026-05-23T08:10:00.000Z",
          headers: {},
          method: "PUT",
          url: "https://upload.example.test/denied",
        },
      }),
    ).rejects.toBeInstanceOf(FileUploadClientError);
    await expect(
      uploadSinglePartWithPresignedUrl({
        body: new Blob(["hello"]),
        fetchImpl: createRecordingFetch([], { status: 403 }),
        now: () => new Date("2026-05-23T08:00:00.000Z"),
        presigned: {
          expiresAt: "2026-05-23T08:10:00.000Z",
          headers: {},
          method: "PUT",
          url: "https://upload.example.test/denied",
        },
      }),
    ).rejects.toMatchObject({
      code: "upload.presigned_http_failed",
      details: { status: 403 },
    });
  });

  it("uploads multipart blobs through per-part presigned grants with progress", async () => {
    const calls: RecordedFetchCall[] = [];
    const progress: number[] = [];

    const result = await uploadMultipartWithPresignedParts({
      blob: new Blob(["abcdef"]),
      fetchImpl: createRecordingFetch(calls, { etagByCall: ["etag-1", "etag-2"], status: 200 }),
      now: () => new Date("2026-05-23T08:00:00.000Z"),
      onProgress: (event) => progress.push(event.uploadedBytes),
      partSizeBytes: 3,
      presignPart: async ({ partNumber }) => ({
        partNumber,
        presigned: {
          expiresAt: "2026-05-23T08:10:00.000Z",
          headers: { "x-amz-part-number": String(partNumber) },
          method: "PUT",
          url: `https://upload.example.test/parts/${partNumber}`,
        },
        requestId: `req-part-${partNumber}`,
        sessionId: "upl_1",
      }),
      sessionId: "upl_1",
      totalParts: 2,
    });

    expect(result).toEqual({
      parts: [
        { etag: "etag-1", partNumber: 1, sizeBytes: 3 },
        { etag: "etag-2", partNumber: 2, sizeBytes: 3 },
      ],
      status: "uploaded",
      uploadedBytes: 6,
    });
    expect(progress).toEqual([3, 6]);
    expect(calls.map((call) => [call.url, call.bodySize])).toEqual([
      ["https://upload.example.test/parts/1", 3],
      ["https://upload.example.test/parts/2", 3],
    ]);
  });

  it("creates a standard transport that supports single and multipart upload sessions", async () => {
    const calls: RecordedFetchCall[] = [];
    const transport = createPresignedUploadTransport({
      fetchImpl: createRecordingFetch(calls, { status: 200 }),
      now: () => new Date("2026-05-23T08:00:00.000Z"),
    });

    await transport.uploadFile({
      file: new File(["hello"], "hello.txt", { type: "text/plain" }),
      session: {
        presigned: {
          expiresAt: "2026-05-23T08:10:00.000Z",
          headers: { "Content-Type": "text/plain" },
          method: "PUT",
          url: "https://upload.example.test/single",
        },
        quotaReservationId: "quota_1",
        requestId: "req-create",
        sessionId: "upl_single",
        slotCode: "course.attachment",
        status: "presigned",
        uploadMode: "single_put",
      },
    });

    await transport.uploadFile({
      file: new File(["abcdef"], "large.bin"),
      presignPart: async ({ partNumber }) => ({
        partNumber,
        presigned: {
          expiresAt: "2026-05-23T08:10:00.000Z",
          headers: {},
          method: "PUT",
          url: `https://upload.example.test/multipart/${partNumber}`,
        },
        requestId: `req-part-${partNumber}`,
        sessionId: "upl_multi",
      }),
      session: {
        partSizeBytes: 3,
        quotaReservationId: "quota_2",
        requestId: "req-create-multi",
        sessionId: "upl_multi",
        slotCode: "course.attachment",
        status: "presigned",
        totalParts: 2,
        uploadMode: "multipart",
      },
    });

    expect(calls.map((call) => call.url)).toEqual([
      "https://upload.example.test/single",
      "https://upload.example.test/multipart/1",
      "https://upload.example.test/multipart/2",
    ]);
  });
});

interface RecordedFetchCall {
  bodySize: number;
  headers: Record<string, string>;
  method: string;
  url: string;
}

function createRecordingFetch(
  calls: RecordedFetchCall[],
  options: { etag?: string; etagByCall?: string[]; status: number },
) {
  return async (url: string, init: { body?: BodyInit | null; headers?: Record<string, string>; method?: string }) => {
    calls.push({
      bodySize: await resolveBodySize(init.body),
      headers: init.headers ?? {},
      method: init.method ?? "GET",
      url,
    });
    const etag = options.etagByCall?.[calls.length - 1] ?? options.etag;
    return {
      headers: {
        get(name: string) {
          return name.toLowerCase() === "etag" ? etag ?? null : null;
        },
      },
      ok: options.status >= 200 && options.status < 300,
      status: options.status,
    };
  };
}

async function resolveBodySize(body: BodyInit | null | undefined): Promise<number> {
  if (body instanceof Blob) {
    return body.size;
  }
  if (body instanceof ArrayBuffer) {
    return body.byteLength;
  }
  if (ArrayBuffer.isView(body)) {
    return body.byteLength;
  }
  if (typeof body === "string") {
    return body.length;
  }
  return 0;
}
