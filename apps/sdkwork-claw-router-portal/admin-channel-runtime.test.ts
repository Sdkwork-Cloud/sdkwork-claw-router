import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
  resolveAuthTypeFormValue,
  resolveAuthTypeSubmitValue,
  resolveChannelSelectFormValue,
  resolveChannelSelectSubmitValue,
} from "./packages/sdkwork-claw-router-admin-channel/src/channelForm.ts";
import { knownModelVendors, protocolsList } from "./packages/sdkwork-claw-router-admin-channel/src/channelOptions.tsx";

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
    value: { dispatchEvent: () => true },
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
    apiKey: " sk-live-openai ",
    capabilities: ["llm", " image ", "llm"],
    models: [" gpt-4o ", " ", "gpt-4o-mini"],
    circuitBreakerEnabled: true,
    circuitBreakerFailureThreshold: "4",
    weight: 125,
    status: "active",
  });

  assert.deepEqual(input, {
    name: "OpenAI Primary",
    vendor: "OpenAI",
    protocol: "OpenAI",
    accessType: "Standard API Key",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "sk-live-openai",
    capabilities: ["llm", "image"],
    models: ["gpt-4o", "gpt-4o-mini"],
    circuitBreakerPolicy: { failureThreshold: 4 },
    weight: 125,
    status: "active",
  });
  for (const field of ["id", "isMultimodal", "balance", "errors"]) {
    assert.equal(field in input, false);
  }
});

test("admin channel create input rejects invalid optional values before persistence", () => {
  assert.throws(
    () =>
      createChannelInputFromForm({
        name: " Custom ",
        vendor: " Custom ",
        protocol: " ",
        accessType: " ",
        baseUrl: " ",
        apiKey: " sk-custom ",
        capabilities: [],
        models: ["default-custom-model"],
        circuitBreakerEnabled: true,
        circuitBreakerFailureThreshold: "0",
        weight: Number.NaN,
        status: "active",
      }),
    /weight must be a positive integer/,
  );
  assert.throws(
    () =>
      createChannelInputFromForm({
        name: " Custom ",
        vendor: " Custom ",
        protocol: " ",
        accessType: " ",
        baseUrl: " ",
        apiKey: " sk-custom ",
        capabilities: [],
        models: ["default-custom-model"],
        weight: 100,
        status: "archived",
      }),
    /Unsupported channel status: archived/,
  );
  assert.throws(
    () =>
      createChannelInputFromForm({
        name: " Custom ",
        vendor: " Custom ",
        protocol: " ",
        accessType: " ",
        baseUrl: " ",
        apiKey: " sk-custom ",
        capabilities: ["llm", "unknown"],
        models: ["default-custom-model"],
        weight: 100,
        status: "active",
      }),
    /Unsupported channel capability: unknown/,
  );
});

test("admin channel form normalizes and validates circuit breaker policy", () => {
  assert.deepEqual(
    createChannelInputFromForm({
      name: "OpenAI",
      vendor: "OpenAI",
      protocol: "OpenAI",
      accessType: "api-key",
      baseUrl: "https://api.openai.com/v1",
      secretRef: "vault://providers/openai/main",
      capabilities: ["llm"],
      models: ["gpt-4o"],
      circuitBreakerEnabled: true,
      circuitBreakerFailureThreshold: "2",
      weight: 100,
      status: "active",
    }).circuitBreakerPolicy,
    { failureThreshold: 2 },
  );
  assert.equal(
    createChannelInputFromForm({
      name: "OpenAI",
      vendor: "OpenAI",
      protocol: "OpenAI",
      accessType: "api-key",
      baseUrl: "https://api.openai.com/v1",
      secretRef: "vault://providers/openai/main",
      capabilities: ["llm"],
      models: ["gpt-4o"],
      circuitBreakerEnabled: false,
      circuitBreakerFailureThreshold: "2",
      weight: 100,
      status: "active",
    }).circuitBreakerPolicy,
    undefined,
  );
  assert.deepEqual(
    createChannelUpdateInputFromForm({
      name: "OpenAI",
      vendor: "OpenAI",
      protocol: "OpenAI",
      accessType: "api-key",
      baseUrl: "https://api.openai.com/v1",
      secretRef: "vault://providers/openai/main",
      capabilities: ["llm"],
      models: ["gpt-4o"],
      circuitBreakerEnabled: false,
      circuitBreakerFailureThreshold: "",
      weight: 100,
      status: "active",
    }).circuitBreakerPolicy,
    null,
  );
  assert.throws(
    () =>
      createChannelInputFromForm({
        name: "OpenAI",
        vendor: "OpenAI",
        protocol: "OpenAI",
        accessType: "api-key",
        baseUrl: "https://api.openai.com/v1",
        secretRef: "vault://providers/openai/main",
        capabilities: ["llm"],
        models: ["gpt-4o"],
        circuitBreakerEnabled: true,
        circuitBreakerFailureThreshold: "101",
        weight: 100,
        status: "active",
      }),
    /circuitBreakerPolicy.failureThreshold must be between 1 and 100/,
  );
});

test("admin channel update input does not reuse returned channel view model", () => {
  const input = createChannelUpdateInputFromForm({
    name: " Anthropic Backup ",
    vendor: " Anthropic ",
    protocol: " Anthropic ",
    accessType: " Standard API Key ",
    baseUrl: " ",
    apiKey: " ",
    capabilities: ["llm"],
    models: [" claude-3-5-sonnet-20241022 "],
    circuitBreakerEnabled: false,
    circuitBreakerFailureThreshold: "",
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
    circuitBreakerPolicy: null,
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

test("admin channel modal rejects invalid traffic weight instead of defaulting it", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /readPositiveIntegerFormValue\(formData, 'weight'/);
  assert.doesNotMatch(source, /Number\.parseInt\(String\(formData\.get\('weight'\) \?\? '100'\), 10\)/);
  assert.doesNotMatch(source, /weight:\s*Number\.isFinite\(weight\) && weight > 0 \? weight : 100/);
});

test("admin channel modal does not expose unsupported per-channel model mapping controls", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /Model mapping/);
  assert.doesNotMatch(source, /Only the target model values are persisted for this channel/);
  assert.doesNotMatch(source, /Add mapping/);
  assert.doesNotMatch(source, /modelMode === 'mapping'/);
  assert.doesNotMatch(source, /setMappings|addMapping|updateMapping/);
  assert.doesNotMatch(source, /Gateway model|Provider model/);
  assert.match(source, /const models = whitelist\.map/);
  assert.match(source, /admin\.channel\.validation\.modelRequired/);
});

test("admin channel visible account copy is routed through i18n resources", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );
  const optionsSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/channelOptions.tsx", import.meta.url),
    "utf8",
  );
  const i18nSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-i18n/src/index.ts", import.meta.url),
    "utf8",
  );

  const hardcodedVisiblePhrases = [
    "Edit channel account",
    "Add channel account",
    "Channel name",
    "Credential mode",
    "Secret reference",
    "Manual reference",
    "Traffic weight",
    "Model allowlist",
    "Bind the provider models supported by this channel.",
    "At least one model must be bound to the channel.",
    "Credential name",
    "Auth type",
    "Credential references",
    "Vault/KMS handles used by provider channel accounts.",
    "Loading credential references...",
    "Credential references could not be loaded",
    "No credential references registered",
    "Add a vault or KMS reference before binding provider channels.",
    "Failed to fetch channel accounts.",
    "Delete channel account?",
    "from provider routing. Active traffic should be moved before confirming.",
    "Channel updated.",
    "Channel created.",
    "Channel disabled.",
    "Channel enabled.",
    "Channel test passed",
    "Channel test failed",
    "Channel deleted.",
    "Credential reference updated.",
    "Credential reference created.",
    "Credential reference enabled.",
    "Credential reference disabled.",
    "Credential reference deleted.",
    "Provider routing accounts, model bindings, weights, and credential references.",
    "Search channels",
    "Loading channel accounts...",
    "Channel accounts could not be loaded",
    "No channels found",
    "Add a provider channel account to start routing model traffic.",
    "Adjust the search query or provider filter to find matching channel accounts.",
  ];
  for (const phrase of hardcodedVisiblePhrases) {
    assert.equal(
      source.includes(phrase),
      false,
      `expected visible phrase to use i18n instead of hardcoding: ${phrase}`,
    );
  }

  for (const phrase of [
    "OpenAI compatible",
    "Ollama native",
    "Custom protocol",
    "Standard API Key",
    "Bearer token via secretRef",
    "Setup token",
  ]) {
    assert.equal(
      optionsSource.includes(phrase),
      false,
      `expected channel option phrase to use i18n metadata instead of hardcoding: ${phrase}`,
    );
  }

  const requiredKeys = [
    "admin.channel.title",
    "admin.channel.subtitle",
    "admin.channel.searchPlaceholder",
    "admin.channel.fields.channelName",
    "admin.channel.fields.vendor",
    "admin.channel.fields.protocol",
    "admin.channel.fields.credentialMode",
    "admin.channel.fields.baseUrl",
    "admin.channel.fields.apiKey",
    "admin.channel.fields.trafficWeight",
    "admin.channel.fields.capabilities",
    "admin.channel.fields.modelAllowlist",
    "admin.channel.fields.addModel",
    "admin.channel.fields.credentialName",
    "admin.channel.fields.authType",
    "admin.channel.fields.status",
    "admin.channel.table.channel",
    "admin.channel.table.provider",
    "admin.channel.table.models",
    "admin.channel.table.weight",
    "admin.channel.table.status",
    "admin.channel.table.actions",
    "admin.channel.states.loadingChannels",
    "admin.channel.states.channelsLoadErrorTitle",
    "admin.channel.states.emptyChannelsTitle",
    "admin.channel.states.emptyChannelsDescription",
    "admin.channel.states.emptySearchDescription",
    "admin.channel.credentials.title",
    "admin.channel.credentials.description",
    "admin.channel.credentials.loading",
    "admin.channel.credentials.loadErrorTitle",
    "admin.channel.credentials.emptyTitle",
    "admin.channel.credentials.emptyDescription",
    "admin.channel.confirm.deleteChannelTitle",
    "admin.channel.confirm.deleteChannelDescription",
    "admin.channel.confirm.deleteCredentialTitle",
    "admin.channel.confirm.deleteCredentialDescription",
    "admin.channel.messages.channelCreated",
    "admin.channel.messages.channelUpdated",
    "admin.channel.messages.channelEnabled",
    "admin.channel.messages.channelDisabled",
    "admin.channel.messages.channelDeleted",
    "admin.channel.messages.channelTestPassed",
    "admin.channel.messages.channelTestFailed",
    "admin.channel.messages.credentialCreated",
    "admin.channel.messages.credentialUpdated",
    "admin.channel.messages.credentialEnabled",
    "admin.channel.messages.credentialDisabled",
    "admin.channel.messages.credentialDeleted",
    "admin.channel.pagination.total",
    "admin.channel.pagination.page",
    "admin.channel.status.active",
    "admin.channel.status.disabled",
    "admin.channel.status.errors",
    "admin.channel.options.protocol.openai",
    "admin.channel.options.auth.apiKey.title",
    "admin.channel.options.auth.apiKey.description",
  ];
  for (const key of requiredKeys) {
    const occurrences = i18nSource.match(new RegExp(`"${key.replaceAll(".", "\\.")}"`, "g"))?.length ?? 0;
    assert.equal(occurrences, 2, `expected ${key} to exist in English and Chinese resources`);
  }
});

test("admin channel credentials are viewed from account row actions instead of a standalone table", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.equal((source.match(/<table\b/g) ?? []).length, 1);
  assert.doesNotMatch(source, /name="secretRef"/);
  assert.doesNotMatch(source, /setSecretRef/);
  assert.doesNotMatch(source, /availableSecrets/);
  assert.doesNotMatch(source, /providerSecrets=\{providerSecrets\}/);
  assert.match(source, /name="apiKey"/);
  assert.match(source, /admin\.channel\.fields\.apiKey/);
  assert.match(source, /admin\.channel\.placeholders\.apiKey/);
  assert.doesNotMatch(source, /function CredentialReferencePanel/);
  assert.doesNotMatch(source, /<CredentialReferencePanel/);
  assert.doesNotMatch(source, /function ProviderSecretModal/);
  assert.doesNotMatch(source, /secretModalMode/);
  assert.doesNotMatch(source, /createProviderSecretInputFromForm/);
  assert.match(source, /function CredentialDetailsModal/);
  assert.match(source, /viewingCredentialChannel/);
  assert.match(source, /findCredentialForChannel/);
  assert.match(source, /admin\.channel\.actions\.viewCredential/);
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

test("admin channel auth type helpers preserve unknown backend auth types", () => {
  const knownAuthTypes = [
    { id: "api-key", title: "Standard API Key" },
    { id: "aws-bedrock", title: "AWS Bedrock" },
  ];

  assert.equal(resolveAuthTypeFormValue(" Standard API Key ", knownAuthTypes), "api-key");
  assert.equal(resolveAuthTypeFormValue("custom-sigv4", knownAuthTypes), "custom-sigv4");
  assert.equal(resolveAuthTypeSubmitValue("api-key", knownAuthTypes), "Standard API Key");
  assert.equal(resolveAuthTypeSubmitValue("custom-sigv4", knownAuthTypes), "custom-sigv4");
  assert.throws(
    () => resolveAuthTypeSubmitValue(" ", knownAuthTypes),
    /authType is required/,
  );
});

test("admin channel select helpers preserve custom vendors and protocols", () => {
  assert.equal(resolveChannelSelectFormValue(undefined, knownModelVendors, "OpenAI"), "OpenAI");
  assert.equal(resolveChannelSelectFormValue(" DeepSeek ", knownModelVendors, "OpenAI"), "DeepSeek");
  assert.equal(resolveChannelSelectFormValue("acme-ai", knownModelVendors, "OpenAI"), "acme-ai");

  assert.equal(resolveChannelSelectFormValue("OpenAI compatible", protocolsList, "OpenAI"), "OpenAI");
  assert.equal(resolveChannelSelectFormValue("Acme RPC", protocolsList, "OpenAI"), "Acme RPC");

  assert.equal(resolveChannelSelectSubmitValue("OpenAI", protocolsList, "protocol"), "OpenAI");
  assert.equal(resolveChannelSelectSubmitValue("OpenAI compatible", protocolsList, "protocol"), "OpenAI");
  assert.equal(resolveChannelSelectSubmitValue("Acme RPC", protocolsList, "protocol"), "Acme RPC");
  assert.throws(
    () => resolveChannelSelectSubmitValue(" ", protocolsList, "protocol"),
    /protocol is required/,
  );
});

test("admin provider secret status update input is a minimal command", () => {
  assert.deepEqual(createProviderSecretStatusUpdateInput("disabled"), { status: "disabled" });
  assert.deepEqual(createProviderSecretStatusUpdateInput("active"), { status: "active" });
  assert.throws(
    () => createProviderSecretStatusUpdateInput("unexpected"),
    /Unsupported provider credential status: unexpected/,
  );
});

test("admin channel service persists and clears circuit breaker policy through backend SDK contract", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/integration/channels" && method === "POST") {
        return {
          item: {
            id: "channel-circuit",
            name: "OpenAI Circuit",
            vendor: "OpenAI",
            protocol: "OpenAI",
            accessType: "api-key",
            baseUrl: "https://api.openai.com/v1",
            secretRef: "vault://providers/openai/main",
            models: ["gpt-4o"],
            capabilities: ["llm"],
            isMultimodal: false,
            circuitBreakerPolicy: {
              failureThreshold: 4,
            },
            weight: 100,
            status: "active",
            balance: "N/A",
            errors: 0,
          },
        };
      }
      if (url === "/backend/v3/api/integration/channels" && method === "PUT") {
        return {
          item: {
            id: "channel-circuit",
            name: "OpenAI Circuit",
            vendor: "OpenAI",
            protocol: "OpenAI",
            accessType: "api-key",
            baseUrl: "https://api.openai.com/v1",
            secretRef: "vault://providers/openai/main",
            models: ["gpt-4o"],
            capabilities: ["llm"],
            isMultimodal: false,
            circuitBreakerPolicy: null,
            weight: 100,
            status: "active",
            balance: "N/A",
            errors: 0,
          },
        };
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async (captured) => {
      const created = await ChannelService.addChannel({
        name: "OpenAI Circuit",
        vendor: "OpenAI",
        protocol: "OpenAI",
        accessType: "api-key",
        baseUrl: "https://api.openai.com/v1",
        secretRef: "vault://providers/openai/main",
        models: ["gpt-4o"],
        capabilities: ["llm"],
        circuitBreakerPolicy: { failureThreshold: 4 },
        weight: 100,
        status: "active",
      });
      const updated = await ChannelService.updateChannel("channel-circuit", {
        circuitBreakerPolicy: null,
      });

      assert.deepEqual(created.circuitBreakerPolicy, { failureThreshold: 4 });
      assert.equal(updated.circuitBreakerPolicy, undefined);
      assert.deepEqual(JSON.parse(captured[0].body).circuitBreakerPolicy, { failureThreshold: 4 });
      assert.equal(JSON.parse(captured[1].body).circuitBreakerPolicy, null);
    },
  );
});

test("admin channel list fails closed when backend returns malformed circuit breaker policy", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/integration/channels" && init?.method === "GET") {
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
              circuitBreakerPolicy: {
                failureThreshold: 0,
              },
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
        /Channel circuitBreakerPolicy.failureThreshold must be between 1 and 100/,
      );
    },
  );
});

test("admin channel service calls generated backend SDK paths and normalizes channel data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/integration/channels" && method === "GET") {
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
                retryableStatusCodes: [429, 500],
                backoffMs: 250,
              },
              circuitBreakerPolicy: {
                failureThreshold: 2,
              },
              weight: "100",
              status: "error",
              balance: "$20.00",
              errors: "2",
            },
          ],
        };
      }
      if (url === "/backend/v3/api/integration/channels" && method === "POST") {
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
            circuitBreakerPolicy: {
              failureThreshold: 4,
            },
            weight: 20,
            status: "active",
            balance: "N/A",
            errors: 0,
          },
        };
      }
      if (url === "/backend/v3/api/integration/channels" && method === "PUT") {
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
            circuitBreakerPolicy: null,
            weight: 30,
            status: "disabled",
            balance: "N/A",
            errors: 0,
          },
        };
      }
      if (url === "/backend/v3/api/integration/channels/channel-2/verify" && method === "POST") {
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
      if (url === "/backend/v3/api/integration/channels/channel-2" && method === "DELETE") {
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
        apiKey: " sk-ant-live-secret ",
        models: [" claude-3-5-sonnet "],
        capabilities: ["llm"],
        weight: 20,
        circuitBreakerPolicy: { failureThreshold: 4 },
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
      assert.deepEqual(channels[0].circuitBreakerPolicy, { failureThreshold: 2 });
      assert.equal(created.id, "channel-2");
      assert.deepEqual(created.circuitBreakerPolicy, { failureThreshold: 4 });
      assert.equal(updated?.status, "disabled");
      assert.equal(updated?.circuitBreakerPolicy, undefined);
      assert.equal(tested.channelId, "7");
      assert.equal(tested.success, true);
      assert.equal(deleted, true);
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        [
          "GET /backend/v3/api/integration/channels",
          "POST /backend/v3/api/integration/channels",
          "PUT /backend/v3/api/integration/channels",
          "POST /backend/v3/api/integration/channels/channel-2/verify",
          "DELETE /backend/v3/api/integration/channels/channel-2",
        ],
      );
      assert.deepEqual(JSON.parse(captured[1].body), {
        name: "Anthropic Backup",
        vendor: "Anthropic",
        protocol: "Anthropic",
        accessType: "api-key",
        baseUrl: "https://api.anthropic.com",
        apiKey: "sk-ant-live-secret",
        models: ["claude-3-5-sonnet"],
        capabilities: ["llm"],
        circuitBreakerPolicy: { failureThreshold: 4 },
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
      if (url === "/backend/v3/api/integration/provider_secrets?provider_code=openai&status=disabled" && method === "GET") {
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
      if (url === "/backend/v3/api/integration/provider_secrets" && method === "POST") {
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
      if (url === "/backend/v3/api/integration/provider_secrets" && method === "PUT") {
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
      if (url === "/backend/v3/api/integration/provider_secrets/secret-2" && method === "DELETE") {
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
          "GET /backend/v3/api/integration/provider_secrets?provider_code=openai&status=disabled",
          "POST /backend/v3/api/integration/provider_secrets",
          "PUT /backend/v3/api/integration/provider_secrets",
          "DELETE /backend/v3/api/integration/provider_secrets/secret-2",
        ],
      );
      assert.equal(captured[0].body, "");
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
            apiKey: "sk-openai",
            models: ["gpt-4o"],
          }),
        /name is required/,
      );
      await assert.rejects(
        () =>
          ChannelService.addChannel({
            name: "OpenAI",
            vendor: "OpenAI",
            apiKey: " ",
            models: ["gpt-4o"],
          }),
        /apiKey is required/,
      );
      await assert.rejects(
        () =>
          ChannelService.addChannel({
            name: "OpenAI",
            vendor: "OpenAI",
            apiKey: "sk-openai",
            models: [],
          }),
        /models must include at least one item/,
      );
      await assert.rejects(
        () =>
          ChannelService.addChannel({
            name: "OpenAI",
            vendor: "OpenAI",
            apiKey: "sk-openai",
            models: ["gpt-4o"],
            capabilities: ["llm", "unknown"],
          }),
        /Unsupported channel capability: unknown/,
      );
      await assert.rejects(
        () =>
          ChannelService.addChannel({
            name: "OpenAI",
            vendor: "OpenAI",
            apiKey: "sk-openai",
            models: ["gpt-4o"],
            weight: 1.5,
          }),
        /value must be a positive integer/,
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
      if (url === "/backend/v3/api/integration/channels/channel-2/verify" && init?.method === "POST") {
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

test("admin channel test fails closed when backend omits required test metadata", async () => {
  const baseItem = {
    id: "channel-2",
    name: "Anthropic Backup",
    vendor: "Anthropic",
    protocol: "Anthropic",
    accessType: "api-key",
    models: ["claude-3-5-sonnet"],
    capabilities: ["llm"],
    isMultimodal: false,
    weight: 20,
    status: "active",
    balance: "N/A",
    errors: 0,
  };

  for (const [field, message] of [
    ["channelId", /Channel test channel id is required/],
    ["success", /Channel test success flag is required/],
    ["latency", /Channel test latency is required/],
  ] as const) {
    await withBackendSdkFetch(
      (url, init) => {
        if (url === "/backend/v3/api/integration/channels/channel-2/verify" && init?.method === "POST") {
          const response = {
            channelId: "channel-2",
            success: true,
            status: "active",
            latency: "88ms",
            item: baseItem,
          } as Record<string, unknown>;
          delete response[field];
          return response;
        }
        throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
      },
      async () => {
        await assert.rejects(
          () => ChannelService.testChannel("channel-2"),
          message,
        );
      },
    );
  }
});

test("admin channel list fails closed when backend omits stable channel ids", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/integration/channels" && init?.method === "GET") {
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
      if (url === "/backend/v3/api/integration/channels" && init?.method === "GET") {
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
      if (url === "/backend/v3/api/integration/channels" && init?.method === "GET") {
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
      if (url === "/backend/v3/api/integration/channels" && init?.method === "GET") {
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

test("admin channel delete fails closed when backend omits delete confirmation", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/integration/channels/channel-2" && init?.method === "DELETE") {
        return {};
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ChannelService.deleteChannel("channel-2"),
        /Channel delete confirmation is required/,
      );
    },
  );
});

test("admin provider secret delete fails closed when backend omits delete confirmation", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/integration/provider_secrets/secret-2" && init?.method === "DELETE") {
        return {};
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ProviderSecretService.deleteProviderSecret("secret-2"),
        /Provider credential delete confirmation is required/,
      );
    },
  );
});

test("admin channel list fails closed when backend returns incomplete retry policy", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/integration/channels" && init?.method === "GET") {
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
              retryPolicy: {
                retryableStatusCodes: [429],
              },
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
        /Channel retryPolicy.maxAttempts is required/,
      );
    },
  );
});

test("admin channel list fails closed when backend returns unsupported retry statuses", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/integration/channels" && init?.method === "GET") {
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
              retryPolicy: {
                maxAttempts: 3,
                retryableStatusCodes: [429, 418],
              },
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
        /Channel retryPolicy\.retryableStatusCodes contains unsupported status: 418/,
      );
    },
  );
});

test("admin provider secret list fails closed when backend omits stable credential ids", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/integration/provider_secrets" && init?.method === "GET") {
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
      if (url === "/backend/v3/api/integration/provider_secrets" && init?.method === "GET") {
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
      if (url === "/backend/v3/api/integration/provider_secrets" && init?.method === "GET") {
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
      if (url === "/backend/v3/api/integration/provider_secrets" && init?.method === "GET") {
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
