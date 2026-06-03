import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createAnnouncementInputFromForm,
  createAnnouncementStatusInput,
  createAnnouncementUpdateInputFromForm,
} from "./packages/sdkwork-claw-router-admin-announcement/src/announcementForm.ts";
import { AnnouncementService } from "./packages/sdkwork-claw-router-admin-announcement/src/announcementService.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

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

test("admin announcement page localizes page copy, form placeholders, and modal text", () => {
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-admin-announcement/src/index.tsx");
  const announcementI18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/admin/announcement.ts");
  const commonI18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/shared/common.ts");

  for (const key of [
    "admin.announcement.searchPlaceholder",
    "admin.announcement.state.loading",
    "admin.announcement.state.loadErrorTitle",
    "admin.announcement.state.emptyTitle",
    "admin.announcement.state.emptyDescription",
    "admin.announcement.table.title",
    "admin.announcement.table.audience",
    "admin.announcement.table.status",
    "admin.announcement.table.popupDisplay",
    "admin.announcement.table.publishedAt",
    "admin.announcement.table.actions",
    "admin.announcement.modals.createTitle",
    "admin.announcement.modals.editTitle",
    "admin.announcement.modals.createDescription",
    "admin.announcement.modals.editDescription",
    "admin.announcement.fields.title",
    "admin.announcement.fields.audience",
    "admin.announcement.fields.publication",
    "admin.announcement.fields.popupDisplay",
    "admin.announcement.fields.content",
    "admin.announcement.fields.markdown",
    "admin.announcement.help.title",
    "admin.announcement.help.audience",
    "admin.announcement.help.publication",
    "admin.announcement.help.popupDisplay",
    "admin.announcement.preview.title",
    "admin.announcement.preview.emptyTitle",
    "admin.announcement.preview.emptyContent",
    "admin.announcement.preview.defaultSource",
    "admin.announcement.placeholders.title",
    "admin.announcement.content.default",
    "admin.announcement.targets.all",
    "admin.announcement.targets.vip",
    "admin.announcement.targets.free",
    "admin.announcement.targets.beta",
    "admin.announcement.status.published",
    "admin.announcement.status.draft",
    "admin.announcement.publication.publishNow",
    "admin.announcement.publication.saveDraft",
    "admin.announcement.popup.enabled",
    "admin.announcement.popup.disabled",
    "admin.announcement.errors.loadFallback",
    "admin.announcement.errors.saveFallback",
    "admin.announcement.errors.deleteFallback",
    "admin.announcement.errors.statusUpdateFallback",
    "admin.announcement.confirm.deleteTitle",
    "admin.announcement.confirm.deleteDescription",
    "admin.announcement.confirm.deleteConfirm",
    "admin.announcement.actions.moveToDraft",
    "common.actions.newAnnouncement",
    "common.actions.retry",
    "common.actions.edit",
    "common.actions.delete",
    "common.actions.publish",
    "common.actions.cancel",
    "common.actions.save",
  ]) {
    const escaped = key.replaceAll(".", "\\.");
    const i18nSource = key.startsWith("common.") ? commonI18nSource : announcementI18nSource;
    assert.match(pageSource, new RegExp(escaped), `${key} must be consumed by AnnouncementAdmin`);
    assert.match(i18nSource, new RegExp(`"${escaped}"`), `${key} must exist in i18n resources`);
  }

  assert.doesNotMatch(pageSource, /admin\.announcement\.title/);
  assert.doesNotMatch(pageSource, /admin\.announcement\.subtitle/);

  for (const hardcodedText of [
    "Announcement Management",
    "Publish operational notices to selected customer cohorts.",
    "Search announcements...",
    "Loading announcements...",
    "Announcements could not be loaded",
    "No announcements found",
    "Create an announcement or adjust the search keyword.",
    "New announcement",
    "Edit Announcement",
    "Create Announcement",
    "Compose a concise operational notice",
    "Platform API endpoint migration notice",
    "Preview",
    "Untitled announcement",
    "Delete announcement?",
    "Delete announcement",
    "All users",
    "VIP groups",
    "Free tier users",
    "Beta cohort",
    "Published",
    "Draft",
    "Publish now",
    "Save as draft",
    "Content",
    "Title",
    "Audience",
    "Status",
    "Popup display",
    "Published At",
    "Actions",
  ]) {
    assert.doesNotMatch(pageSource, new RegExp(`['"\`]${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"\`]`));
    assert.doesNotMatch(pageSource, new RegExp(`>\\s*${hardcodedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*<`));
  }
});

test("admin announcement page exposes publish, move to draft, edit, and delete row actions", () => {
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-admin-announcement/src/index.tsx");

  assert.match(pageSource, /createAnnouncementStatusInput/, "status actions must use the shared status update input");
  assert.doesNotMatch(pageSource, /handlePublish/, "page must not keep a draft-only publish action handler");
  assert.doesNotMatch(pageSource, /createAnnouncementPublishInput/, "row actions must not be hard-wired to publish only");
  assert.match(pageSource, /'published'/, "draft rows must expose a transition to published");
  assert.match(pageSource, /'draft'/, "published rows must expose a transition back to draft");
  assert.match(pageSource, /admin\.announcement\.actions\.moveToDraft/, "published rows must show a localized move-to-draft action");
  assert.match(pageSource, /common\.actions\.publish/, "draft rows must show a localized publish action");
  assert.match(pageSource, /common\.actions\.edit/, "row actions must keep edit available");
  assert.match(pageSource, /common\.actions\.delete/, "row actions must keep delete available");
});

test("admin announcement table fills the available admin viewport", () => {
  const pageSource = readPortalFile("./packages/sdkwork-claw-router-admin-announcement/src/index.tsx");

  for (const expected of [
    "AdminTableShell",
    "data-admin-announcement-table-card",
    "data-admin-announcement-table-viewport",
    "flex h-full min-h-0 w-full flex-col",
    "className=\"flex-1 min-h-0 rounded-xl dark:bg-[#1a1a1a]\"",
    "viewportClassName=\"min-h-0 flex-1\"",
    "sticky top-0 z-10",
  ]) {
    assert.ok(pageSource.includes(expected), `missing adaptive admin announcement table marker: ${expected}`);
  }
});

test("admin announcement create input does not reuse returned announcement view model", () => {
  const input = createAnnouncementInputFromForm({
    title: " Platform maintenance ",
    target: " VIP ",
    status: " Draft ",
    showAsPopup: true,
    content: " Scheduled work window ",
  });

  assert.deepEqual(input, {
    title: "Platform maintenance",
    target: "vip",
    status: "draft",
    showAsPopup: true,
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
      showAsPopup: false,
      content: " Details ",
    }),
    /target must be one of all, vip, free, beta/,
  );
  assert.throws(
    () => createAnnouncementInputFromForm({
      title: " Migration ",
      target: "all",
      status: "archived",
      showAsPopup: false,
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
    showAsPopup: false,
    content: " Follow the migration guide. ",
  });

  assert.deepEqual(input, {
    title: "API migration",
    target: "beta",
    status: "draft",
    showAsPopup: false,
    content: "Follow the migration guide.",
  });
  for (const field of ["id", "date"]) {
    assert.equal(field in input, false);
  }
});

test("admin announcement status input builds a minimal publish command", () => {
  const input = createAnnouncementStatusInput("published");

  assert.deepEqual(input, { status: "published" });
  for (const field of ["id", "title", "target", "date", "content"]) {
    assert.equal(field in input, false);
  }
});

test("admin announcement status input supports publish and draft state transitions", () => {
  assert.deepEqual(createAnnouncementStatusInput("published"), { status: "published" });
  assert.deepEqual(createAnnouncementStatusInput("draft"), { status: "draft" });
});

test("admin announcement popup display flag is preserved in create, update, and list models", async () => {
  const formInput = createAnnouncementInputFromForm({
    title: " Popup maintenance ",
    target: " all ",
    status: " published ",
    showAsPopup: true,
    content: " Read before using the console. ",
  });
  const updateInput = createAnnouncementUpdateInputFromForm({
    title: " Popup maintenance ",
    target: " all ",
    status: " draft ",
    showAsPopup: false,
    content: " Updated content. ",
  });

  assert.equal(formInput.showAsPopup, true);
  assert.equal(updateInput.showAsPopup, false);

  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/content/announcements" && method === "GET") {
        return {
          items: [
            {
              id: "ann-1",
              title: "Popup",
              target: "all",
              status: "published",
              date: "2026-05-05",
              content: "Popup content.",
              showAsPopup: true,
            },
            {
              id: "ann-2",
              title: "Legacy",
              target: "all",
              status: "published",
              date: "2026-05-05",
              content: "Legacy content.",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/content/announcements" && method === "POST") {
        return {
          item: {
            id: "ann-3",
            title: "Popup maintenance",
            target: "all",
            status: "published",
            date: "2026-05-05",
            content: "Read before using the console.",
            showAsPopup: true,
          },
        };
      }
      if (url === "/backend/v3/api/content/announcements/ann-3" && method === "PATCH") {
        return {
          item: {
            id: "ann-3",
            title: "Popup maintenance",
            target: "all",
            status: "draft",
            date: "2026-05-05",
            content: "Updated content.",
            showAsPopup: false,
          },
        };
      }
      throw new Error(`unexpected SDK URL: ${url}`);
    },
    async (captured) => {
      const list = await AnnouncementService.fetchAnnouncements();
      const created = await AnnouncementService.addAnnouncement(formInput);
      const updated = await AnnouncementService.updateAnnouncement("ann-3", updateInput);

      assert.equal(list[0].showAsPopup, true);
      assert.equal(list[1].showAsPopup, false);
      assert.equal(created.showAsPopup, true);
      assert.equal(updated.showAsPopup, false);
      assert.match(captured[1].body, /"showAsPopup":true/);
      assert.match(captured[2].body, /"showAsPopup":false/);
    },
  );
});

test("admin announcement backend SDK request contracts expose popup display flag", () => {
  const createTypeSource = readFileSync(
    new URL("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/types/admin-announcement-create-request.ts", import.meta.url),
    "utf8",
  );
  const updateTypeSource = readFileSync(
    new URL("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/types/admin-announcement-update-request.ts", import.meta.url),
    "utf8",
  );

  assert.match(createTypeSource, /showAsPopup: boolean;/);
  assert.match(updateTypeSource, /showAsPopup\?: boolean;/);
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
              showAsPopup: true,
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
            showAsPopup: false,
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
            showAsPopup: false,
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
        showAsPopup: false,
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
      for (const request of captured) {
        assert.equal(request.headers["x-request-id"], undefined);
      }
      assert.match(captured[1].body, /"target":"vip"/);
      assert.match(captured[1].body, /"showAsPopup":false/);
      assert.match(captured[2].body, /"status":"published"/);
      assert.equal(list[0].status, "draft");
      assert.equal(list[0].showAsPopup, true);
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
            showAsPopup: false,
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
            showAsPopup: false,
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
              showAsPopup: false,
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
              showAsPopup: false,
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
