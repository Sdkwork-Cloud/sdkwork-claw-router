import assert from "node:assert/strict";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import { ChannelService, ProviderSecretService } from "./packages/sdkwork-claw-router-admin-channel/src/channelService.ts";
import {
  createChannelInputFromForm,
  createChannelStatusUpdateInput,
  createChannelUpdateInputFromForm,
  createProviderSecretInputFromForm,
  createProviderSecretStatusUpdateInput,
  createProviderSecretUpdateInputFromForm,
} from "./packages/sdkwork-claw-router-admin-channel/src/channelForm.ts";

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

test("admin channel create input does not reuse returned channel view model", () => {
  const input = createChannelInputFromForm({
    name: " OpenAI Primary ",
    vendor: " OpenAI ",
    protocol: " OpenAI ",
    accessType: " Standard API Key ",
    baseUrl: " https://api.openai.com/v1 ",
    secretRef: " vault://providers/openai/account/main ",
    capabilities: ["llm", " image ", "unknown", "llm"],
    models: [" gpt-4o ", " ", "gpt-4o-mini"],
    weight: 125.4,
    status: "active",
  });

  assert.deepEqual(input, {
    name: "OpenAI Primary",
    vendor: "OpenAI",
    protocol: "OpenAI",
    accessType: "Standard API Key",
    baseUrl: "https://api.openai.com/v1",
    secretRef: "vault://providers/openai/account/main",
    capabilities: ["llm", "image"],
    models: ["gpt-4o", "gpt-4o-mini"],
    weight: 125,
    status: "active",
  });
  for (const field of ["id", "isMultimodal", "balance", "errors"]) {
    assert.equal(field in input, false);
  }
});

test("admin channel create input defaults invalid optional values safely", () => {
  assert.deepEqual(createChannelInputFromForm({
    name: " Custom ",
    vendor: " Custom ",
    protocol: " ",
    accessType: " ",
    baseUrl: " ",
    secretRef: " secret://providers/custom/main ",
    capabilities: [],
    models: ["default-custom-model"],
    weight: Number.NaN,
    status: "archived",
  }), {
    name: "Custom",
    vendor: "Custom",
    secretRef: "secret://providers/custom/main",
    models: ["default-custom-model"],
    weight: 100,
    status: "active",
  });
});

test("admin channel update input does not reuse returned channel view model", () => {
  const input = createChannelUpdateInputFromForm({
    name: " Anthropic Backup ",
    vendor: " Anthropic ",
    protocol: " Anthropic ",
    accessType: " Standard API Key ",
    baseUrl: " ",
    secretRef: " ",
    capabilities: ["llm"],
    models: [" claude-3-5-sonnet-20241022 "],
    weight: 20,
    status: "disabled",
  });

  assert.deepEqual(input, {
    name: "Anthropic Backup",
    vendor: "Anthropic",
    protocol: "Anthropic",
    accessType: "Standard API Key",
    capabilities: ["llm"],
    models: ["claude-3-5-sonnet-20241022"],
    weight: 20,
    status: "disabled",
  });
  for (const field of ["id", "isMultimodal", "balance", "errors"]) {
    assert.equal(field in input, false);
  }
});

test("admin channel status update input is a minimal command", () => {
  assert.deepEqual(createChannelStatusUpdateInput("disabled"), { status: "disabled" });
  assert.deepEqual(createChannelStatusUpdateInput("active"), { status: "active" });
});

test("admin provider secret create input does not reuse returned credential fields", () => {
  const input = createProviderSecretInputFromForm({
    providerCode: " openai ",
    name: " OpenAI Primary ",
    authType: " api-key ",
    secretRef: " vault://providers/openai/main ",
    status: "active",
  });

  assert.deepEqual(input, {
    providerCode: "openai",
    name: "OpenAI Primary",
    authType: "api-key",
    secretRef: "vault://providers/openai/main",
    status: "active",
  });
  for (const field of ["id", "accountCode", "maskedLabel", "createdAt", "updatedAt"]) {
    assert.equal(field in input, false);
  }
});

test("admin provider secret update input is a dedicated command", () => {
  const input = createProviderSecretUpdateInputFromForm({
    providerCode: " anthropic ",
    name: " Anthropic Backup ",
    authType: " ",
    secretRef: " secret://providers/anthropic/backup ",
    status: "disabled",
  });

  assert.deepEqual(input, {
    providerCode: "anthropic",
    name: "Anthropic Backup",
    secretRef: "secret://providers/anthropic/backup",
    status: "disabled",
  });
  for (const field of ["id", "accountCode", "maskedLabel", "createdAt", "updatedAt"]) {
    assert.equal(field in input, false);
  }
});

test("admin provider secret status update input is a minimal command", () => {
  assert.deepEqual(createProviderSecretStatusUpdateInput("disabled"), { status: "disabled" });
  assert.deepEqual(createProviderSecretStatusUpdateInput("unexpected"), { status: "active" });
});

test("admin channel service calls generated backend SDK paths and normalizes channel data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/channel/list" && method === "POST") {
        return {
          items: [
            {
              id: "channel-1",
              name: "OpenAI Primary",
              vendor: "OpenAI",
              protocol: "OpenAI",
              accessType: "api-key",
              baseUrl: "https://api.openai.com/v1",
              secretRef: "vault://providers/openai/main",
              models: ["gpt-4o"],
              capabilities: ["llm"],
              isMultimodal: false,
              timeoutMs: "30000",
              retryPolicy: {
                maxAttempts: 3,
                retryableStatusCodes: [429, 500, 418],
                backoffMs: 250,
              },
              weight: "100",
              status: "error",
              balance: "$20.00",
              errors: "2",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/channel" && method === "POST") {
        return {
          item: {
            id: "channel-2",
            name: "Anthropic Backup",
            vendor: "Anthropic",
            protocol: "Anthropic",
            accessType: "api-key",
            baseUrl: "https://api.anthropic.com",
            secretRef: "vault://providers/anthropic/backup",
            models: ["claude-3-5-sonnet"],
            capabilities: ["llm"],
            isMultimodal: false,
            weight: 20,
            status: "active",
            balance: "N/A",
            errors: 0,
          },
        };
      }
      if (url === "/backend/v3/api/channel" && method === "PUT") {
        return {
          item: {
            id: "channel-2",
            name: "Anthropic Updated",
            vendor: "Anthropic",
            protocol: "Anthropic",
            accessType: "api-key",
            models: ["claude-3-5-sonnet"],
            capabilities: ["llm"],
            isMultimodal: false,
            weight: 30,
            status: "disabled",
            balance: "N/A",
            errors: 0,
          },
        };
      }
      if (url === "/backend/v3/api/channel/channel-2/test" && method === "POST") {
        return {
        channelId: "7",
        success: true,
        status: "active",
        latency: "88ms",
        item: {
          id: "7",
          name: "OpenAI Primary",
          vendor: "OpenAI",
          protocol: "OpenAI",
          accessType: "api-key",
          models: ["gpt-4o"],
          capabilities: ["llm"],
          isMultimodal: false,
          weight: 100,
          status: "active",
          balance: "N/A",
          errors: 0,
        },
        };
      }
      if (url === "/backend/v3/api/channel/channel-2" && method === "DELETE") {
        return { deleted: true };
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async (captured) => {
      const channels = await ChannelService.fetchChannels();
      const created = await ChannelService.addChannel({
        name: " Anthropic Backup ",
        vendor: " Anthropic ",
        protocol: "Anthropic",
        accessType: "api-key",
        baseUrl: " https://api.anthropic.com ",
        secretRef: " vault://providers/anthropic/backup ",
        models: [" claude-3-5-sonnet "],
        capabilities: ["llm"],
        weight: 20,
        status: "active",
      });
      const updated = await ChannelService.updateChannel("channel-2", {
        name: "Anthropic Updated",
        weight: 30,
        status: "disabled",
      });
      const tested = await ChannelService.testChannel("channel-2");
      const deleted = await ChannelService.deleteChannel("channel-2");

      assert.equal(channels[0].id, "channel-1");
      assert.equal(channels[0].status, "error");
      assert.equal(channels[0].timeoutMs, 30000);
      assert.deepEqual(channels[0].retryPolicy?.retryableStatusCodes, [429, 500]);
      assert.equal(created.id, "channel-2");
      assert.equal(updated?.status, "disabled");
      assert.equal(tested.channelId, "7");
      assert.equal(tested.success, true);
      assert.equal(deleted, true);
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        [
          "POST /backend/v3/api/channel/list",
          "POST /backend/v3/api/channel",
          "PUT /backend/v3/api/channel",
          "POST /backend/v3/api/channel/channel-2/test",
          "DELETE /backend/v3/api/channel/channel-2",
        ],
      );
      assert.deepEqual(JSON.parse(captured[1].body), {
        name: "Anthropic Backup",
        vendor: "Anthropic",
        protocol: "Anthropic",
        accessType: "api-key",
        baseUrl: "https://api.anthropic.com",
        secretRef: "vault://providers/anthropic/backup",
        models: ["claude-3-5-sonnet"],
        capabilities: ["llm"],
        weight: 20,
        status: "active",
      });
      assert.deepEqual(JSON.parse(captured[2].body), {
        id: "channel-2",
        name: "Anthropic Updated",
        weight: 30,
        status: "disabled",
      });
      assert.equal(captured[1].headers["x-request-id"]?.startsWith("admin-channel-create-"), true);
      assert.equal(captured[2].headers["x-request-id"]?.startsWith("admin-channel-update-"), true);
      assert.equal(captured[3].headers["x-request-id"]?.startsWith("admin-channel-test-"), true);
    },
  );
});

test("admin provider secret service calls generated backend SDK paths and normalizes secret data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/provider-secrets/list" && method === "POST") {
        return {
          items: [
            {
              id: "secret-1",
              providerCode: "openai",
              accountCode: "main",
              name: "OpenAI Primary",
              authType: "api-key",
              secretRef: "vault://providers/openai/main",
              status: "disabled",
              createdAt: "2026-05-05T08:00:00Z",
              updatedAt: "2026-05-05T08:30:00Z",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/provider-secrets" && method === "POST") {
        return {
          item: {
            id: "secret-2",
            providerCode: "anthropic",
            accountCode: "backup",
            name: "Anthropic Backup",
            authType: "api-key",
            secretRef: "vault://providers/anthropic/backup",
            maskedLabel: "ref:***backup",
            status: "active",
            createdAt: "2026-05-05T08:00:00Z",
            updatedAt: "2026-05-05T08:00:00Z",
          },
        };
      }
      if (url === "/backend/v3/api/provider-secrets" && method === "PUT") {
        return {
          item: {
            id: "secret-2",
            providerCode: "anthropic",
            accountCode: "backup",
            name: "Anthropic Updated",
            authType: "api-key",
            secretRef: "vault://providers/anthropic/updated",
            status: "disabled",
            createdAt: "2026-05-05T08:00:00Z",
            updatedAt: "2026-05-05T09:00:00Z",
          },
        };
      }
      if (url === "/backend/v3/api/provider-secrets/secret-2" && method === "DELETE") {
        return { deleted: true };
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async (captured) => {
      const secrets = await ProviderSecretService.fetchProviderSecrets({
        providerCode: " openai ",
        status: "disabled",
      });
      const created = await ProviderSecretService.addProviderSecret({
        providerCode: " anthropic ",
        name: " Anthropic Backup ",
        authType: "api-key",
        secretRef: " vault://providers/anthropic/backup ",
        status: "active",
      });
      const updated = await ProviderSecretService.updateProviderSecret("secret-2", {
        name: "Anthropic Updated",
        secretRef: " vault://providers/anthropic/updated ",
        status: "disabled",
      });
      const deleted = await ProviderSecretService.deleteProviderSecret("secret-2");

      assert.equal(secrets[0].id, "secret-1");
      assert.equal(secrets[0].maskedLabel, "ref:***main");
      assert.equal(created.id, "secret-2");
      assert.equal(updated?.maskedLabel, "ref:***updated");
      assert.equal(deleted, true);
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        [
          "POST /backend/v3/api/provider-secrets/list",
          "POST /backend/v3/api/provider-secrets",
          "PUT /backend/v3/api/provider-secrets",
          "DELETE /backend/v3/api/provider-secrets/secret-2",
        ],
      );
      assert.deepEqual(JSON.parse(captured[0].body), {
        providerCode: "openai",
        status: "disabled",
      });
      assert.deepEqual(JSON.parse(captured[1].body), {
        providerCode: "anthropic",
        name: "Anthropic Backup",
        authType: "api-key",
        secretRef: "vault://providers/anthropic/backup",
        status: "active",
      });
      assert.deepEqual(JSON.parse(captured[2].body), {
        id: "secret-2",
        name: "Anthropic Updated",
        secretRef: "vault://providers/anthropic/updated",
        status: "disabled",
      });
      assert.equal(captured[1].headers["x-request-id"]?.startsWith("admin-provider-secret-create-"), true);
      assert.equal(captured[2].headers["x-request-id"]?.startsWith("admin-provider-secret-update-"), true);
    },
  );
});

test("admin channel service rejects invalid commands before calling generated backend SDK", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for invalid channel commands");
    },
    async (captured) => {
      await assert.rejects(
        () =>
          ChannelService.addChannel({
            name: "",
            vendor: "OpenAI",
            secretRef: "vault://providers/openai/main",
            models: ["gpt-4o"],
          }),
        /name is required/,
      );
      await assert.rejects(
        () =>
          ChannelService.addChannel({
            name: "OpenAI",
            vendor: "OpenAI",
            secretRef: " ",
            models: ["gpt-4o"],
          }),
        /secretRef is required/,
      );
      await assert.rejects(
        () =>
          ChannelService.addChannel({
            name: "OpenAI",
            vendor: "OpenAI",
            secretRef: "vault://providers/openai/main",
            models: [],
          }),
        /models must include at least one item/,
      );
      await assert.rejects(
        () =>
          ProviderSecretService.addProviderSecret({
            providerCode: "",
            name: "OpenAI Primary",
            authType: "api-key",
            secretRef: "vault://providers/openai/main",
          }),
        /providerCode is required/,
      );
      await assert.rejects(
        () =>
          ProviderSecretService.addProviderSecret({
            providerCode: "openai",
            name: "OpenAI Primary",
            authType: "api-key",
            secretRef: "",
          }),
        /secretRef is required/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin channel service rejects unsafe SDK path ids before calling generated backend SDK", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("backend SDK must not be called for unsafe channel path ids");
    },
    async (captured) => {
      await assert.rejects(
        () => ChannelService.updateChannel("channel/2", { name: "Updated" }),
        /channelId must be a safe path segment/,
      );
      await assert.rejects(
        () => ChannelService.deleteChannel("../channel-2"),
        /channelId must be a safe path segment/,
      );
      await assert.rejects(
        () => ChannelService.testChannel("channel?debug=true"),
        /channelId must be a safe path segment/,
      );
      await assert.rejects(
        () => ProviderSecretService.updateProviderSecret("secret/2", { name: "Updated" }),
        /providerSecretId must be a safe path segment/,
      );
      await assert.rejects(
        () => ProviderSecretService.deleteProviderSecret("secret?debug=true"),
        /providerSecretId must be a safe path segment/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin channel test fails closed when backend success response omits the tested channel item", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/channel/channel-2/test" && init?.method === "POST") {
        return {
          channelId: "channel-2",
          success: true,
          status: "active",
          latency: "88ms",
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ChannelService.testChannel("channel-2"),
        /Channel test response is missing channel data/,
      );
    },
  );
});

test("admin channel list fails closed when backend omits stable channel ids", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/channel/list" && init?.method === "POST") {
        return {
          items: [
            {
              name: "Missing Id Channel",
              vendor: "OpenAI",
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              models: ["gpt-4o"],
              capabilities: ["llm"],
              isMultimodal: false,
              weight: 100,
              status: "active",
              balance: "N/A",
              errors: 0,
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ChannelService.fetchChannels(),
        /Channel id is required/,
      );
    },
  );
});

test("admin channel list fails closed when backend returns malformed channel rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/channel/list" && init?.method === "POST") {
        return {
          items: [
            {
              id: "channel-1",
              name: "OpenAI Primary",
              vendor: "OpenAI",
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              models: ["gpt-4o"],
              capabilities: ["llm"],
              isMultimodal: false,
              weight: 100,
              status: "active",
              balance: "N/A",
              errors: 0,
            },
            "malformed-channel-row",
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ChannelService.fetchChannels(),
        /Channel record is required/,
      );
    },
  );
});

test("admin channel list fails closed when backend omits channel models", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/channel/list" && init?.method === "POST") {
        return {
          items: [
            {
              id: "channel-1",
              name: "OpenAI Primary",
              vendor: "OpenAI",
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              capabilities: ["llm"],
              isMultimodal: false,
              weight: 100,
              status: "active",
              balance: "N/A",
              errors: 0,
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ChannelService.fetchChannels(),
        /Channel models are required/,
      );
    },
  );
});

test("admin channel list fails closed when backend returns unsupported channel status", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/channel/list" && init?.method === "POST") {
        return {
          items: [
            {
              id: "channel-1",
              name: "OpenAI Primary",
              vendor: "OpenAI",
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              models: ["gpt-4o"],
              capabilities: ["llm"],
              isMultimodal: false,
              weight: 100,
              status: "archived",
              balance: "N/A",
              errors: 0,
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ChannelService.fetchChannels(),
        /Unsupported channel status: archived/,
      );
    },
  );
});

test("admin provider secret list fails closed when backend omits stable credential ids", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/provider-secrets/list" && init?.method === "POST") {
        return {
          items: [
            {
              providerCode: "openai",
              accountCode: "main",
              name: "OpenAI Primary",
              authType: "api-key",
              secretRef: "vault://providers/openai/main",
              status: "active",
              createdAt: "2026-05-05T08:00:00Z",
              updatedAt: "2026-05-05T08:00:00Z",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ProviderSecretService.fetchProviderSecrets(),
        /Provider credential id is required/,
      );
    },
  );
});

test("admin provider secret list fails closed when backend returns malformed credential rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/provider-secrets/list" && init?.method === "POST") {
        return {
          items: ["malformed-provider-secret-row"],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ProviderSecretService.fetchProviderSecrets(),
        /Provider credential record is required/,
      );
    },
  );
});

test("admin provider secret list fails closed when backend omits secret references", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/provider-secrets/list" && init?.method === "POST") {
        return {
          items: [
            {
              id: "secret-1",
              providerCode: "openai",
              accountCode: "main",
              name: "OpenAI Primary",
              authType: "api-key",
              status: "active",
              createdAt: "2026-05-05T08:00:00Z",
              updatedAt: "2026-05-05T08:00:00Z",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ProviderSecretService.fetchProviderSecrets(),
        /Provider credential secret reference is required/,
      );
    },
  );
});

test("admin provider secret list fails closed when backend returns unsupported credential status", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/provider-secrets/list" && init?.method === "POST") {
        return {
          items: [
            {
              id: "secret-1",
              providerCode: "openai",
              accountCode: "main",
              name: "OpenAI Primary",
              authType: "api-key",
              secretRef: "vault://providers/openai/main",
              status: "archived",
              createdAt: "2026-05-05T08:00:00Z",
              updatedAt: "2026-05-05T08:00:00Z",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ProviderSecretService.fetchProviderSecrets(),
        /Unsupported provider credential status: archived/,
      );
    },
  );
});
