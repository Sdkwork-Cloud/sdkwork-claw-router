import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { GroupService } from "./packages/sdkwork-claw-router-admin-group/src/groupService.ts";
import {
  createGroupInputFromForm,
  createGroupUpdateInputFromForm,
  displayGroupStatus,
  displayGroupType,
} from "./packages/sdkwork-claw-router-admin-group/src/groupForm.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedBackendRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
};

async function withBackendSdkFetch<T>(
  handler: (url: string, init?: RequestInit) => unknown,
  fn: (captured: CapturedBackendRequest[]) => Promise<T>,
): Promise<T> {
  const captured: CapturedBackendRequest[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    enumerable: true,
    value: {},
  });
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const body = typeof init?.body === "string" ? init.body : "";
    const headers = Object.fromEntries(new Headers(init?.headers).entries());
    captured.push({
      url,
      method: init?.method ?? "GET",
      headers,
      body,
    });
    const result = handler(url, init);
    return new Response(JSON.stringify({ code: "2000", data: result }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  clearStoredAppSessionToken();
  resetClawRouterSdkClients();

  try {
    return await fn(captured);
  } finally {
    clearStoredAppSessionToken();
    resetClawRouterSdkClients();
    globalThis.fetch = originalFetch;
    if (originalWindowDescriptor) {
      Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    } else {
      delete (globalThis as { window?: Window }).window;
    }
  }
}

test("admin group create input does not fabricate client persistence ids", () => {
  const form = new FormData();
  form.set("name", " Default Enterprise ");
  form.set("platform", " OpenAI ");
  form.set("billingType", "subscription quota");
  form.set("rateMultiplier", "2.5");
  form.set("isPublic", "on");

  const input = createGroupInputFromForm(form);

  assert.deepEqual(input, {
    name: "Default Enterprise",
    platform: "OpenAI",
    billingType: "subscription quota",
    rateMultiplier: 2.5,
    type: "public",
    capacity: { total: 100 },
    status: "active",
  });
  assert.equal("id" in input, false);
  assert.equal("accountCount" in input, false);
  assert.equal("usage" in input, false);
});

test("admin group create input defaults invalid numeric and private group values safely", () => {
  const form = new FormData();
  form.set("name", " Dedicated ");
  form.set("platform", " Anthropic ");
  form.set("billingType", "standard");
  form.set("rateMultiplier", "not-a-number");

  assert.deepEqual(createGroupInputFromForm(form), {
    name: "Dedicated",
    platform: "Anthropic",
    billingType: "standard",
    rateMultiplier: 1,
    type: "dedicated",
    capacity: { total: 100 },
    status: "active",
  });
});

test("admin group update input does not reuse returned group view model", () => {
  const form = new FormData();
  form.set("name", " Enterprise Tier ");
  form.set("platform", " OpenAI ");
  form.set("billingType", "subscription quota");
  form.set("rateMultiplier", "1.75");
  form.set("isPublic", "on");

  const input = createGroupUpdateInputFromForm(form);

  assert.deepEqual(input, {
    name: "Enterprise Tier",
    platform: "OpenAI",
    billingType: "subscription quota",
    rateMultiplier: 1.75,
    type: "public",
    capacity: { total: 100 },
    status: "active",
  });
  for (const field of ["id", "accountCount", "usage"]) {
    assert.equal(field in input, false);
  }
});

test("admin group display labels are stable domain labels", () => {
  assert.equal(displayGroupType("public"), "public");
  assert.equal(displayGroupType("dedicated"), "dedicated");
  assert.equal(displayGroupStatus("active"), "active");
  assert.equal(displayGroupStatus("disabled"), "disabled");
});

test("admin group service calls generated backend SDK paths and normalizes group data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/iam/access_groups" && method === "GET") {
        return {
          items: [
            {
              id: "group-1",
              name: "Default Enterprise",
              platform: "OpenAI",
              billingType: "subscription",
              rateMultiplier: "2.5",
              type: "dedicated",
              accountCount: { available: "3", total: 5 },
              capacity: { used: "10", total: 200 },
              usage: { today: "6", total: 600 },
              status: "disabled",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/iam/access_groups" && method === "POST") {
        return {
          item: {
            id: "group-2",
            name: "Created Group",
            platform: "Anthropic",
            billingType: "standard",
            rateMultiplier: 1.25,
            type: "public",
            accountCount: { available: 0, total: 0 },
            capacity: { used: 0, total: 100 },
            usage: { today: 0, total: 0 },
            status: "active",
          },
        };
      }
      if (url === "/backend/v3/api/iam/access_groups/group-2" && method === "PATCH") {
        return {
          item: {
            id: "group-2",
            name: "Updated Group",
            platform: "Anthropic",
            billingType: "subscription",
            rateMultiplier: 1.5,
            type: "dedicated",
            accountCount: { available: 0, total: 0 },
            capacity: { used: 0, total: 150 },
            usage: { today: 0, total: 0 },
            status: "disabled",
          },
        };
      }
      if (url === "/backend/v3/api/iam/access_groups/group-2" && method === "DELETE") {
        return { deleted: true };
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async (captured) => {
      const groups = await GroupService.fetchGroups();
      const created = await GroupService.addGroup({
        name: " Created Group ",
        platform: " Anthropic ",
        billingType: "standard",
        rateMultiplier: 1.25,
        type: "public",
        capacity: { total: 100 },
        status: "active",
      });
      const updated = await GroupService.updateGroup("group-2", {
        name: " Updated Group ",
        billingType: "subscription quota",
        rateMultiplier: 1.5,
        type: "dedicated",
        capacity: { total: 150 },
        status: "disabled",
      });
      const deleted = await GroupService.deleteGroup("group-2");

      assert.equal(groups[0].id, "group-1");
      assert.equal(groups[0].rateMultiplier, 2.5);
      assert.equal(groups[0].accountCount.available, 3);
      assert.equal(created.id, "group-2");
      assert.equal(updated?.status, "disabled");
      assert.equal(deleted, true);
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        [
          "GET /backend/v3/api/iam/access_groups",
          "POST /backend/v3/api/iam/access_groups",
          "PATCH /backend/v3/api/iam/access_groups/group-2",
          "DELETE /backend/v3/api/iam/access_groups/group-2",
        ],
      );
      assert.deepEqual(JSON.parse(captured[1].body), {
        name: "Created Group",
        platform: "Anthropic",
        billingType: "standard",
        rateMultiplier: 1.25,
        type: "public",
        capacity: { total: 100 },
        status: "active",
      });
      assert.equal(captured[1].headers["x-request-id"]?.startsWith("admin-group-create-"), true);
      assert.equal(captured[2].headers["x-request-id"]?.startsWith("admin-group-update-"), true);
    },
  );
});

test("admin group service rejects invalid command values before calling backend SDK", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for invalid group commands");
    },
    async (captured) => {
      await assert.rejects(
        () =>
          GroupService.addGroup({
            name: " ",
            platform: "OpenAI",
            billingType: "standard",
            rateMultiplier: 1,
            type: "public",
            capacity: { total: 100 },
            status: "active",
          }),
        /name is required/,
      );
      await assert.rejects(
        () =>
          GroupService.addGroup({
            name: "Invalid Capacity",
            platform: "OpenAI",
            billingType: "standard",
            rateMultiplier: 1,
            type: "public",
            capacity: { total: 0 },
            status: "active",
          }),
        /capacity.total must be a positive integer/,
      );
      await assert.rejects(
        () => GroupService.updateGroup("group-1", { rateMultiplier: -1 }),
        /rateMultiplier must be greater than zero/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin group service rejects unsafe SDK path ids before calling backend SDK", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for unsafe group path ids");
    },
    async (captured) => {
      await assert.rejects(
        () => GroupService.updateGroup("group/2", { status: "disabled" }),
        /groupId must be a safe path segment/,
      );
      await assert.rejects(
        () => GroupService.deleteGroup("group?debug=true"),
        /groupId must be a safe path segment/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin group update fails closed when backend success response omits the updated entity", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/iam/access_groups/group-2" && init?.method === "PATCH") {
        return { updated: true };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => GroupService.updateGroup("group-2", { status: "disabled" }),
        /Updated group response is missing data/,
      );
    },
  );
});

test("admin group list fails closed when backend omits stable group ids", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/iam/access_groups" && (init?.method ?? "GET") === "GET") {
        return {
          items: [
            {
              name: "Missing Id Group",
              platform: "OpenAI",
              billingType: "standard",
              rateMultiplier: 1,
              type: "public",
              accountCount: { available: 0, total: 0 },
              capacity: { used: 0, total: 100 },
              usage: { today: 0, total: 0 },
              status: "active",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => GroupService.fetchGroups(),
        /Group id is required/,
      );
    },
  );
});

test("admin group list fails closed when backend returns malformed group rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/iam/access_groups" && (init?.method ?? "GET") === "GET") {
        return { items: ["not-a-group-record"] };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => GroupService.fetchGroups(),
        /Group record is required/,
      );
    },
  );
});

test("admin group list fails closed when backend omits required group fields", async () => {
  for (const [field, message] of [
    ["name", /Group name is required/],
    ["rateMultiplier", /Group rate multiplier is required/],
    ["capacity", /Group capacity is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url, init) => {
        if (url === "/backend/v3/api/iam/access_groups" && (init?.method ?? "GET") === "GET") {
          const group = {
            id: "group-1",
            name: "Default Enterprise",
            platform: "OpenAI",
            billingType: "subscription",
            rateMultiplier: "2.5",
            type: "dedicated",
            accountCount: { available: "3", total: 5 },
            capacity: { used: "10", total: 200 },
            usage: { today: "6", total: 600 },
            status: "disabled",
          } as Record<string, unknown>;
          delete group[field];
          return { items: [group] };
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => GroupService.fetchGroups(),
          message,
        );
      },
    );
  }
});

test("admin group list fails closed when backend returns unsupported group enums", async () => {
  for (const [field, value, message] of [
    ["type", "enterprise", /Unsupported group type: enterprise/],
    ["status", "archived", /Unsupported group status: archived/],
  ] as const) {
    await withBackendSdkFetch(
      (url, init) => {
        if (url === "/backend/v3/api/iam/access_groups" && (init?.method ?? "GET") === "GET") {
          const group = {
            id: "group-1",
            name: "Default Enterprise",
            platform: "OpenAI",
            billingType: "subscription",
            rateMultiplier: "2.5",
            type: "dedicated",
            accountCount: { available: "3", total: 5 },
            capacity: { used: "10", total: 200 },
            usage: { today: "6", total: 600 },
            status: "disabled",
          } as Record<string, unknown>;
          group[field] = value;
          return { items: [group] };
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => GroupService.fetchGroups(),
          message,
        );
      },
    );
  }
});
