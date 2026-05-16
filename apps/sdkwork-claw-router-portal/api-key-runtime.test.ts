import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  createApiKeyInputsFromForm,
  createApiKeyInputFromForm,
  type ApiKeyFormValues,
} from "./packages/sdkwork-claw-router-console-api-keys/src/apiKeyForm.ts";
import { ApiKeyService } from "./packages/sdkwork-claw-router-console-api-keys/src/apiKeyService.ts";

const originalFetch = globalThis.fetch;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type CapturedSdkRequest = {
  url: string;
  method: string;
  body: string;
  headers: Record<string, string>;
};

async function withApiKeySdkResponse<T>(
  responseBody: unknown,
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
    return new Response(JSON.stringify(responseBody), {
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

test("console api key form values normalize into a single create command", () => {
  const values: ApiKeyFormValues & Record<string, unknown> = {
    id: "view-key",
    maskedKey: "sk-****",
    usedQuota: "999",
    status: "enabled",
    name: "  Production Key  ",
    group: " default ",
    quota: " 123.450000 ",
    isUnlimitedQuota: false,
    modalities: ["text", "image", "text"],
    ipLimit: " 10.0.0.0/24, 192.168.1.10 ",
    expires: " 2026-06-01T08:30 ",
    createCount: 2,
  };

  const input = createApiKeyInputFromForm(values, 1);

  assert.deepEqual(input, {
    name: "Production Key",
    group: "default",
    quota: "123.450000",
    isUnlimitedQuota: false,
    modalities: ["text", "image"],
    ipLimit: "10.0.0.0/24, 192.168.1.10",
    expires: "2026-06-01T08:30",
  });
  assert.equal("id" in input, false);
  assert.equal("maskedKey" in input, false);
  assert.equal("usedQuota" in input, false);
  assert.equal("status" in input, false);
});

test("console api key batch form values create deterministic names", () => {
  const values: ApiKeyFormValues = {
    name: " Key ",
    group: " standard ",
    quota: "",
    isUnlimitedQuota: true,
    modalities: ["text"],
    ipLimit: "",
    expires: "",
    createCount: 2,
  };

  const inputs = createApiKeyInputsFromForm(values);

  assert.equal(inputs.length, 2);
  assert.equal(inputs[0].name, "Key 1");
  assert.equal(inputs[1].name, "Key 2");
  assert.deepEqual(inputs[0], {
    name: "Key 1",
    group: "standard",
    quota: "0.000000",
    isUnlimitedQuota: true,
    modalities: ["text"],
    ipLimit: "unrestricted",
    expires: "never",
  });
});

test("console api key form values reject blank or invalid command fields", () => {
  const values: ApiKeyFormValues = {
    name: "Production",
    group: "default",
    quota: "100",
    isUnlimitedQuota: false,
    modalities: ["text"],
    ipLimit: "",
    expires: "",
    createCount: 1,
  };

  assert.throws(() => createApiKeyInputFromForm({ ...values, name: "" }), /name is required/);
  assert.throws(() => createApiKeyInputFromForm({ ...values, group: "" }), /group is required/);
  assert.throws(() => createApiKeyInputFromForm({ ...values, quota: "not-a-number" }), /quota must be a non-negative decimal/);
  assert.throws(() => createApiKeyInputFromForm({ ...values, modalities: ["text", "unknown"] }), /Unsupported API key modality: unknown/);
  assert.throws(() => createApiKeyInputFromForm({ ...values, modalities: [] }), /modalities must include at least one item/);
  assert.throws(() => createApiKeyInputsFromForm({ ...values, createCount: 150 }), /createCount must be between 1 and 100/);
});

test("console api key service fetches keys through the generated app SDK and normalizes envelope data", async () => {
  await withApiKeySdkResponse(
    {
      code: "2000",
      msg: "success",
      data: {
        items: [
          {
            id: "key-1",
            name: "Production",
            maskedKey: "sk-****abcd",
            group: "default",
            rate: "0.25",
            quota: "100.000000",
            usedQuota: "3.500000",
            modalities: ["text", "image"],
            ipLimit: "unrestricted",
            created: "2026-05-05T09:00:00Z",
            expires: "never",
            status: "enabled",
          },
        ],
        groups: [{ id: "group-1", code: "default", name: "Default", rate: null }],
      },
    },
    async (captured) => {
      const result = await ApiKeyService.fetchKeys();

      assert.equal(captured.length, 1);
      assert.equal(captured[0].url, "/app/v3/api/iam/api_keys");
      assert.equal(captured[0].method, "GET");
      assert.deepEqual(result.keys.map((key) => key.id), ["key-1"]);
      assert.deepEqual(result.groups.map((group) => group.code), ["default"]);
    },
  );
});

test("console api key service creates keys through the generated app SDK with request tokens", async () => {
  await withApiKeySdkResponse(
    {
      code: "2000",
      data: {
        item: {
          id: "key-2",
          name: "Created",
          maskedKey: "sk-****wxyz",
          group: "default",
          rate: null,
          quota: "0.000000",
          usedQuota: "0.000000",
          modalities: ["text"],
          ipLimit: "unrestricted",
          created: "2026-05-05T09:00:00Z",
          expires: "never",
          status: "enabled",
        },
        rawKey: "sk-live-created-secret",
      },
    },
    async (captured) => {
      const result = await ApiKeyService.createKey({
        name: "Created",
        group: "default",
        quota: "0.000000",
        isUnlimitedQuota: true,
        modalities: ["text"],
        ipLimit: "unrestricted",
        expires: "never",
      });

      assert.equal(result.rawKey, "sk-live-created-secret");
      assert.equal(result.key.id, "key-2");
      assert.equal(captured.length, 1);
      assert.equal(captured[0].url, "/app/v3/api/iam/api_keys");
      assert.equal(captured[0].method, "POST");
      assert.match(captured[0].body, /"name":"Created"/);
      assert.match(captured[0].headers["idempotency-key"], /^create-api-key-/);
      assert.match(captured[0].headers["x-request-id"], /^request-/);
    },
  );
});

test("console api key service fails closed when fetched key rows omit stable ids", async () => {
  await withApiKeySdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            name: "Missing Id",
            maskedKey: "sk-****abcd",
            group: "default",
          },
        ],
        groups: [{ id: "group-1", code: "default", name: "Default", rate: null }],
      },
    },
    async () => {
      await assert.rejects(
        () => ApiKeyService.fetchKeys(),
        /API key id is required/,
      );
    },
  );
});

test("console api key service fails closed when fetched key rows omit masked key material", async () => {
  await withApiKeySdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "key-1",
            name: "Missing Mask",
            group: "default",
          },
        ],
        groups: [{ id: "group-1", code: "default", name: "Default", rate: null }],
      },
    },
    async () => {
      await assert.rejects(
        () => ApiKeyService.fetchKeys(),
        /API key masked value is required/,
      );
    },
  );
});

test("console api key service fails closed when fetched groups omit stable codes", async () => {
  await withApiKeySdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "key-1",
            name: "Production",
            maskedKey: "sk-****abcd",
            group: "default",
            rate: null,
            quota: "100.000000",
            usedQuota: "3.500000",
            modalities: ["text"],
            ipLimit: "unrestricted",
            created: "2026-05-05T09:00:00Z",
            expires: "never",
            status: "enabled",
          },
        ],
        groups: [{ id: "group-1", name: "Missing Code" }],
      },
    },
    async () => {
      await assert.rejects(
        () => ApiKeyService.fetchKeys(),
        /API key group code is required/,
      );
    },
  );
});

test("console api key service fails closed when fetched keys contain unsupported modalities", async () => {
  await withApiKeySdkResponse(
    {
      code: "2000",
      data: {
        items: [
          {
            id: "key-1",
            name: "Production",
            maskedKey: "sk-****abcd",
            group: "default",
            rate: null,
            quota: "100.000000",
            usedQuota: "3.500000",
            modalities: ["text", "unknown"],
            ipLimit: "unrestricted",
            created: "2026-05-05T09:00:00Z",
            expires: "never",
            status: "enabled",
          },
        ],
        groups: [{ id: "group-1", code: "default", name: "Default", rate: null }],
      },
    },
    async () => {
      await assert.rejects(
        () => ApiKeyService.fetchKeys(),
        /Unsupported API key modality: unknown/,
      );
    },
  );
});

test("console api key creation fails closed when response omits stable key entity", async () => {
  await withApiKeySdkResponse(
    {
      code: "2000",
      data: {
        rawKey: "sk-live-created-secret",
      },
    },
    async () => {
      await assert.rejects(
        () =>
          ApiKeyService.createKey({
            name: "Created",
            group: "default",
            quota: "0.000000",
            isUnlimitedQuota: true,
            modalities: ["text"],
            ipLimit: "unrestricted",
            expires: "never",
          }),
        /API key creation response is missing key data/,
      );
    },
  );
});

test("console api key creation fails closed when response omits raw key material", async () => {
  await withApiKeySdkResponse(
    {
      code: "2000",
      data: {
        item: {
          id: "key-2",
          name: "Created",
          maskedKey: "sk-****wxyz",
          group: "default",
          rate: null,
          quota: "0.000000",
          usedQuota: "0.000000",
          modalities: ["text"],
          ipLimit: "unrestricted",
          created: "2026-05-05T09:00:00Z",
          expires: "never",
          status: "enabled",
        },
      },
    },
    async () => {
      await assert.rejects(
        () =>
          ApiKeyService.createKey({
            name: "Created",
            group: "default",
            quota: "0.000000",
            isUnlimitedQuota: true,
            modalities: ["text"],
            ipLimit: "unrestricted",
            expires: "never",
          }),
        /API key creation response is missing key material/,
      );
    },
  );
});

test("console api key service rejects invalid create commands before calling generated app SDK", async () => {
  await withApiKeySdkResponse(
    {
      code: "2000",
      data: {
        item: {
          id: "unexpected",
          maskedKey: "sk-****unexpected",
        },
        rawKey: "sk-unexpected",
      },
    },
    async (captured) => {
      await assert.rejects(
        () =>
          ApiKeyService.createKey({
            name: "",
            group: "default",
            quota: "0.000000",
            isUnlimitedQuota: true,
            modalities: ["text"],
            ipLimit: "unrestricted",
            expires: "never",
          }),
        /name is required/,
      );
      await assert.rejects(
        () =>
          ApiKeyService.createKey({
            name: "Production",
            group: "",
            quota: "0.000000",
            isUnlimitedQuota: true,
            modalities: [],
            ipLimit: "unrestricted",
            expires: "never",
          }),
        /group is required/,
      );
      await assert.rejects(
        () =>
          ApiKeyService.createKey({
            name: "Production",
            group: "default",
            quota: "-1",
            isUnlimitedQuota: false,
            modalities: ["text"],
            ipLimit: "unrestricted",
            expires: "never",
          }),
        /quota must be a non-negative decimal/,
      );
      await assert.rejects(
        () =>
          ApiKeyService.createKey({
            name: "Production",
            group: "default",
            quota: "0.000000",
            isUnlimitedQuota: true,
            modalities: [],
            ipLimit: "unrestricted",
            expires: "never",
          }),
        /modalities must include at least one item/,
      );
      await assert.rejects(
        () =>
          ApiKeyService.createKey({
            name: "Production",
            group: "default",
            quota: "0.000000",
            isUnlimitedQuota: true,
            modalities: ["unknown"],
            ipLimit: "unrestricted",
            expires: "never",
          }),
        /Unsupported API key modality: unknown/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("console api key service rejects API business failures with the backend message", async () => {
  await withApiKeySdkResponse(
    { code: "4001", msg: "API key quota exceeded", data: null },
    async () => {
      await assert.rejects(
        () => ApiKeyService.fetchKeys(),
        /API key quota exceeded/,
      );
    },
  );
});

test("console api key service fails closed for non-API envelope responses", async () => {
  await withApiKeySdkResponse(
    { data: { items: [], groups: [] } },
    async () => {
      await assert.rejects(
        () => ApiKeyService.fetchKeys(),
        /Failed to fetch API keys/,
      );
    },
  );
});
