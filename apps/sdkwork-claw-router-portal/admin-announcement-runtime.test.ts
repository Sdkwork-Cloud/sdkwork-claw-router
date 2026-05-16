import assert from "node:assert/strict";
import test from "node:test";

import {
  createAnnouncementInputFromForm,
  createAnnouncementPublishInput,
  createAnnouncementUpdateInputFromForm,
} from "./packages/sdkwork-claw-router-admin-announcement/src/announcementForm.ts";
import { AnnouncementService } from "./packages/sdkwork-claw-router-admin-announcement/src/announcementService.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  body: string;
  headers: Record<string, string>;
};

async function withBackendSdkFetch<T>(
  handler: (url: string, init?: RequestInit) => unknown,
  fn: (captured: CapturedSdkRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedSdkRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    captured.push({
      url,
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? init.body : "",
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
    });
    const result = handler(url, init);
    return new Response(JSON.stringify({ code: "2000", data: result }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  resetClawRouterSdkClients();

  try {
    return await fn(captured);
  } finally {
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

test("admin announcement create input does not reuse returned announcement view model", () => {
  const input = createAnnouncementInputFromForm({
    title: " Platform maintenance ",
    target: " VIP ",
    status: " Draft ",
    content: " Scheduled work window ",
  });

  assert.deepEqual(input, {
    title: "Platform maintenance",
    target: "vip",
    status: "draft",
    content: "Scheduled work window",
  });
  for (const field of ["id", "date"]) {
    assert.equal(field in input, false);
  }
});

test("admin announcement create input rejects unsupported enums instead of widening audience", () => {
  assert.throws(
    () => createAnnouncementInputFromForm({
      title: " Migration ",
      target: "legacy-users",
      status: "draft",
      content: " Details ",
    }),
    /target must be one of all, vip, free, beta/,
  );
  assert.throws(
    () => createAnnouncementInputFromForm({
      title: " Migration ",
      target: "all",
      status: "archived",
      content: " Details ",
    }),
    /status must be one of published, draft/,
  );
});

test("admin announcement update input normalizes editable fields only", () => {
  const input = createAnnouncementUpdateInputFromForm({
    title: " API migration ",
    target: " Beta ",
    status: " Draft ",
    content: " Follow the migration guide. ",
  });

  assert.deepEqual(input, {
    title: "API migration",
    target: "beta",
    status: "draft",
    content: "Follow the migration guide.",
  });
  for (const field of ["id", "date"]) {
    assert.equal(field in input, false);
  }
});

test("admin announcement publish input is a minimal status command", () => {
  const input = createAnnouncementPublishInput();

  assert.deepEqual(input, { status: "published" });
  for (const field of ["id", "title", "target", "date", "content"]) {
    assert.equal(field in input, false);
  }
});

test("admin announcement service uses generated backend SDK paths and normalized data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/content/announcements" && method === "GET") {
        return {
          items: [
            {
              id: "ann-1",
              title: "Migration",
              target: "vip",
              status: "draft",
              date: "2026-05-05",
              content: "Prepare migration.",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/content/announcements" && method === "POST") {
        return {
          item: {
            id: "ann-2",
            title: "Migration",
            target: "vip",
            status: "draft",
            date: "2026-05-05",
            content: "Prepare migration.",
          },
        };
      }
      if (url === "/backend/v3/api/content/announcements/ann-1" && method === "PATCH") {
        return {
          item: {
            id: "ann-1",
            title: "Migration Updated",
            target: "all",
            status: "published",
            date: "2026-05-05",
            content: "Migration complete.",
          },
        };
      }
      if (url === "/backend/v3/api/content/announcements/ann-1" && method === "DELETE") {
        return { deleted: true };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async (captured) => {
      const list = await AnnouncementService.fetchAnnouncements();
      const created = await AnnouncementService.addAnnouncement({
        title: "Migration",
        target: "vip",
        status: "draft",
        content: "Prepare migration.",
      });
      const updated = await AnnouncementService.updateAnnouncement("ann-1", {
        title: "Migration Updated",
        target: "all",
        status: "published",
      });
      const deleted = await AnnouncementService.deleteAnnouncement("ann-1");

      assert.deepEqual(captured.map((request) => `${request.method} ${request.url}`), [
        "GET /backend/v3/api/content/announcements",
        "POST /backend/v3/api/content/announcements",
        "PATCH /backend/v3/api/content/announcements/ann-1",
        "DELETE /backend/v3/api/content/announcements/ann-1",
      ]);
      assert.match(captured[1].headers["x-request-id"], /^admin-announcement-create-/);
      assert.match(captured[1].body, /"target":"vip"/);
      assert.match(captured[2].headers["x-request-id"], /^admin-announcement-update-/);
      assert.match(captured[2].body, /"status":"published"/);
      assert.equal(list[0].status, "draft");
      assert.equal(created.title, "Migration");
      assert.equal(updated?.status, "published");
      assert.equal(deleted, true);
    },
  );
});

test("admin announcement service rejects unsafe SDK path ids before calling generated backend SDK", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for unsafe announcement path ids");
    },
    async (captured) => {
      await assert.rejects(
        () => AnnouncementService.updateAnnouncement("ann/1", { status: "published" }),
        /announcementId must be a safe path segment/,
      );
      await assert.rejects(
        () => AnnouncementService.deleteAnnouncement("../ann-1"),
        /announcementId must be a safe path segment/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin announcement delete fails closed unless backend confirms deletion", async () => {
  for (const response of [{}, { deleted: false }]) {
    await withBackendSdkFetch(
      (url, init) => {
        if (url === "/backend/v3/api/content/announcements/ann-1" && init?.method === "DELETE") {
          return response;
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => AnnouncementService.deleteAnnouncement("ann-1"),
          /Announcement delete confirmation is required/,
        );
      },
    );
  }
});

test("admin announcement list fails closed when backend omits stable announcement ids", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/content/announcements" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              title: "Missing Id Announcement",
              target: "all",
              status: "published",
              date: "2026-05-05",
              content: "Invalid contract",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AnnouncementService.fetchAnnouncements(),
        /Announcement id is required/,
      );
    },
  );
});

test("admin announcement list fails closed when backend returns malformed announcement rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/content/announcements" && (init?.method ?? "GET") === "GET") {
        return { items: ["not-an-announcement-record"] };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AnnouncementService.fetchAnnouncements(),
        /Announcement record is required/,
      );
    },
  );
});

test("admin announcement list fails closed when backend omits required announcement fields", async () => {
  for (const [field, message] of [
    ["title", /Announcement title is required/],
    ["target", /Announcement target is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url, init) => {
        if (url === "/backend/v3/api/content/announcements" && (init?.method ?? "GET") === "GET") {
          const announcement = {
            id: "ann-1",
            title: "Migration",
            target: "vip",
            status: "draft",
            date: "2026-05-05",
            content: "Prepare migration.",
          } as Record<string, unknown>;
          delete announcement[field];
          return { items: [announcement] };
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => AnnouncementService.fetchAnnouncements(),
          message,
        );
      },
    );
  }
});

test("admin announcement list fails closed when backend returns unsupported announcement status", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/content/announcements" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "ann-1",
              title: "Migration",
              target: "vip",
              status: "archived",
              date: "2026-05-05",
              content: "Prepare migration.",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AnnouncementService.fetchAnnouncements(),
        /Unsupported announcement status: archived/,
      );
    },
  );
});

test("admin announcement list fails closed when backend returns unsupported announcement target", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/content/announcements" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              id: "ann-1",
              title: "Migration",
              target: "legacy-users",
              status: "draft",
              date: "2026-05-05",
              content: "Prepare migration.",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => AnnouncementService.fetchAnnouncements(),
        /Unsupported announcement target: legacy-users/,
      );
    },
  );
});
