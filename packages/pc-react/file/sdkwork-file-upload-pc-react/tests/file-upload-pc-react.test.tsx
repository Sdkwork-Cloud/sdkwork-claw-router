import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import type { FilePlatformService } from "../../../common/file/sdkwork-file-service/src/index";
import { FileUploadButton, FileUploadQueue, type FileUploadQueueItem } from "../src/index";

afterEach(() => {
  cleanup();
});

describe("SDKWork file upload PC React blocks", () => {
  it("uploads through the file service with only slot and target business inputs", async () => {
    const events: string[] = [];
    const service = createRecordingService(events);

    render(
      <FileUploadButton
        accept="image/png"
        label="Upload icon"
        service={service}
        slotCode="app.icon"
        target={{ id: "app_1", type: "app" }}
        uploadTransport={{
          async uploadFile({ file, session }) {
            events.push(`transport.upload:${file.name}:${session.sessionId}`);
          },
        }}
        onCompleted={(result) => events.push(`completed:${result.fileRef.fileId}:${result.fileRef.purpose}`)}
      />,
    );

    const input = screen.getByLabelText("Upload icon input") as HTMLInputElement;
    const file = new File(["icon"], "icon.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(events).toEqual([
        "service.createUploadSession:app.icon:icon.png",
        "transport.upload:icon.png:upl_1",
        "service.completeUpload:app.icon:upl_1",
        "completed:file_1:app.icon",
      ]);
    });

    expect(screen.getByRole("button", { name: "Upload icon" }).getAttribute("data-upload-status")).toBe("completed");
  });

  it("reports upload failures without leaking storage internals", async () => {
    const events: string[] = [];
    const service = createRecordingService(events);

    render(
      <FileUploadButton
        label="Upload file"
        service={service}
        slotCode="app.icon"
        target={{ id: "app_1", type: "app" }}
        uploadTransport={{
          async uploadFile() {
            throw new Error("network failed");
          },
        }}
        onError={(error) => events.push(`error:${error.message}`)}
      />,
    );

    const input = screen.getByLabelText("Upload file input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [new File(["x"], "x.png", { type: "image/png" })] } });

    await waitFor(() => {
      expect(events).toEqual([
        "service.createUploadSession:app.icon:x.png",
        "error:network failed",
      ]);
    });

    expect(screen.getByRole("button", { name: "Upload file" }).getAttribute("data-upload-status")).toBe("failed");
    expect(screen.queryByText(/objectKey|bucket|presigned/i)).toBeNull();
  });

  it("passes the file service into upload transport for multipart part presigning", async () => {
    const events: string[] = [];
    const service = createMultipartRecordingService(events);

    render(
      <FileUploadButton
        label="Upload large file"
        service={service}
        slotCode="course.video"
        target={{ id: "course_1", type: "course" }}
        uploadTransport={{
          async uploadFile({ file, service: uploadService, session }) {
            events.push(`transport.multipart:${file.name}:${session.sessionId}:${session.totalParts}`);
            const part = await uploadService.presignUploadPart({
              partNumber: 1,
              requestId: "req-part-1",
              sessionId: session.sessionId,
            });
            events.push(`transport.part:${part.partNumber}:${part.presigned.url}`);
          },
        }}
      />,
    );

    const input = screen.getByLabelText("Upload large file input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [new File(["abcdef"], "video.mp4", { type: "video/mp4" })] } });

    await waitFor(() => {
      expect(events).toEqual([
        "service.createUploadSession:course.video:video.mp4",
        "transport.multipart:video.mp4:upl_multi:2",
        "service.presignUploadPart:upl_multi:1",
        "transport.part:1:memory://upload/upl_multi/parts/1",
        "service.completeUpload:course.video:upl_multi",
      ]);
    });
  });

  it("renders stable upload queue state for host applications", () => {
    const items: FileUploadQueueItem[] = [
      { id: "1", filename: "icon.png", progress: 100, status: "completed" },
      { id: "2", filename: "video.mp4", progress: 42, status: "uploading" },
    ];

    render(<FileUploadQueue items={items} title="Uploads" />);

    expect(screen.getByRole("list", { name: "Uploads" })).not.toBeNull();
    expect(screen.getByText("icon.png")).not.toBeNull();
    expect(screen.getByText("completed")).not.toBeNull();
    expect(screen.getByText("42%")).not.toBeNull();
  });
});

function createRecordingService(events: string[]): FilePlatformService {
  return {
    async abortUpload(input) {
      events.push(`service.abortUpload:${input.sessionId}`);
      return { requestId: input.requestId, sessionId: input.sessionId, status: "aborted" };
    },
    async bindFile(input) {
      return {
        fileRef: {
          fileId: input.fileId,
          purpose: input.slotCode,
          visibility: "private",
        },
        requestId: input.requestId,
      };
    },
    async completeUpload(input) {
      events.push(`service.completeUpload:${input.slotCode}:${input.sessionId}`);
      return {
        fileRef: {
          fileId: "file_1",
          purpose: input.slotCode,
          visibility: "private",
        },
        requestId: input.requestId,
        sessionId: input.sessionId,
        status: "active",
      };
    },
    async createUploadSession(input) {
      events.push(`service.createUploadSession:${input.slotCode}:${input.filename}`);
      return {
        presigned: {
          expiresAt: "2026-05-23T08:10:00.000Z",
          headers: { "Content-Type": input.contentType },
          method: "PUT",
          url: "memory://upload/upl_1",
        },
        quotaReservationId: "quota_1",
        requestId: input.requestId,
        sessionId: "upl_1",
        slotCode: input.slotCode,
        status: "presigned",
        uploadMode: "single_put",
      };
    },
    getSlot() {
      return undefined;
    },
  };
}

function createMultipartRecordingService(events: string[]): FilePlatformService {
  return {
    ...createRecordingService(events),
    async createUploadSession(input) {
      events.push(`service.createUploadSession:${input.slotCode}:${input.filename}`);
      return {
        partSizeBytes: 3,
        quotaReservationId: "quota_multi",
        requestId: input.requestId,
        sessionId: "upl_multi",
        slotCode: input.slotCode,
        status: "presigned",
        totalParts: 2,
        uploadMode: "multipart",
      };
    },
    async presignUploadPart(input) {
      events.push(`service.presignUploadPart:${input.sessionId}:${input.partNumber}`);
      return {
        partNumber: input.partNumber,
        presigned: {
          expiresAt: "2026-05-23T08:10:00.000Z",
          headers: {},
          method: "PUT",
          url: `memory://upload/${input.sessionId}/parts/${input.partNumber}`,
        },
        requestId: input.requestId,
        sessionId: input.sessionId,
      };
    },
  };
}
