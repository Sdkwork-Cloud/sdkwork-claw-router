import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { clearStoredAppSessionToken } from "./packages/sdkwork-claw-router-commons/src/app-session-token.ts";
import { resetClawRouterSdkClients } from "./packages/sdkwork-claw-router-commons/src/sdk-clients.ts";
import {
  ChannelAiResourceService,
  ChannelModelCatalogService,
  ChannelService,
  ChannelEndpointService,
  ProviderSecretService,
} from "./packages/sdkwork-claw-router-admin-channel/src/channelService.ts";
import {
  createAiResourceInputFromForm,
  createAiResourceUpdateInputFromForm,
  createChannelInputFromForm,
  createChannelCopyDraft,
  createChannelEditDraft,
  createChannelStatusUpdateInput,
  createChannelUpdateInputFromForm,
  createProviderSecretInputFromForm,
  createChannelEndpointInputFromForm,
  createChannelEndpointUpdateInputFromForm,
  createProviderSecretStatusUpdateInput,
  createProviderSecretUpdateInputFromForm,
  resolveAuthTypeFormValue,
  resolveAuthTypeSubmitValue,
  resolveChannelSelectFormValue,
  resolveChannelSelectSubmitValue,
} from "./packages/sdkwork-claw-router-admin-channel/src/channelForm.ts";
import {
  deriveChannelTargetVendorCodes,
  reconcileChannelVendorSelection,
} from "./packages/sdkwork-claw-router-admin-channel/src/channelVendorSelection.ts";
import { knownModelVendors, protocolsList } from "./packages/sdkwork-claw-router-admin-channel/src/channelOptions.ts";

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

function channelContractDefaults() {
  return {
    channelId: "9001",
    channelType: "official",
    resourceCodes: [],
  } as const;
}

test("admin channel create input does not reuse returned channel view model", () => {
  const input = createChannelInputFromForm({
    name: " OpenAI Primary ",
    vendor: " OpenAI ",
    channelType: " relay ",
    protocol: " OpenAI ",
    accessType: " Standard API Key ",
    baseUrl: " https://api.openai.com/v1 ",
    apiKey: " sk-live-openai ",
    expiresAt: " 2026-06-30T08:00:00Z ",
    capabilities: ["llm", " image ", "llm"],
    resourceCodes: [" Bundle.OpenRouter.OpenAI.Chat ", "bundle.openrouter.openai.chat"],
    models: [" gpt-4o ", " ", "gpt-4o-mini"],
    circuitBreakerEnabled: true,
    circuitBreakerFailureThreshold: "4",
    weight: 125,
    status: "active",
  });

  assert.deepEqual(input, {
    name: "OpenAI Primary",
    vendor: "OpenAI",
    channelType: "relay",
    protocol: "OpenAI",
    accessType: "Standard API Key",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "sk-live-openai",
    expiresAt: "2026-06-30T08:00:00Z",
    capabilities: ["llm", "image"],
    resourceCodes: ["bundle.openrouter.openai.chat"],
    models: ["gpt-4o", "gpt-4o-mini"],
    circuitBreakerPolicy: { failureThreshold: 4 },
    weight: 125,
    status: "active",
  });
  for (const field of ["id", "isMultimodal", "balance", "errors"]) {
    assert.equal(field in input, false);
  }
});

test("admin channel form treats empty expiration as never expires by default", () => {
  const createInput = createChannelInputFromForm({
    name: "OpenAI",
    vendor: "OpenAI",
    protocol: "OpenAI",
    accessType: "api-key",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "sk-openai",
    expiresAt: " ",
    capabilities: ["llm"],
    models: ["gpt-4o"],
    weight: 100,
    status: "active",
  });
  assert.equal("expiresAt" in createInput, false);

  const updateInput = createChannelUpdateInputFromForm({
    name: "OpenAI",
    vendor: "OpenAI",
    protocol: "OpenAI",
    accessType: "api-key",
    baseUrl: "https://api.openai.com/v1",
    apiKey: " ",
    expiresAt: " ",
    capabilities: ["llm"],
    models: ["gpt-4o"],
    weight: 100,
    status: "active",
  });
  assert.equal(updateInput.expiresAt, null);

  const updateWithExpiry = createChannelUpdateInputFromForm({
    name: "OpenAI",
    vendor: "OpenAI",
    protocol: "OpenAI",
    accessType: "api-key",
    baseUrl: "https://api.openai.com/v1",
    apiKey: " ",
    expiresAt: " 2026-07-01T00:00:00Z ",
    capabilities: ["llm"],
    models: ["gpt-4o"],
    weight: 100,
    status: "active",
  });
  assert.equal(updateWithExpiry.expiresAt, "2026-07-01T00:00:00Z");
});

test("admin channel vendor selection supports official single vendor and relay multi vendor resources", () => {
  assert.deepEqual(
    deriveChannelTargetVendorCodes({
      channelType: "official",
      accountVendor: "OpenAI",
      models: ["anthropic/global/claude-3-5-sonnet"],
      resourceCodes: ["vendor.anthropic"],
    }),
    ["openai"],
  );
  assert.deepEqual(
    deriveChannelTargetVendorCodes({
      channelType: "relay",
      accountVendor: "OpenRouter",
      models: ["openai/global/gpt-4o", "anthropic/global/claude-3-5-sonnet"],
      resourceCodes: ["vendor.google"],
    }),
    ["openai", "anthropic", "google"],
  );

  assert.deepEqual(
    reconcileChannelVendorSelection({
      channelType: "official",
      accountVendor: "OpenAI",
      selectedVendorCodes: ["openai", "anthropic"],
      selectedResourceCodes: ["vendor.anthropic", "bundle.openrouter.openai.chat"],
      availableResourceCodes: ["vendor.openai", "vendor.anthropic"],
    }),
    {
      selectedVendorCodes: ["openai"],
      selectedResourceCodes: ["bundle.openrouter.openai.chat", "vendor.openai"],
    },
  );

  assert.deepEqual(
    reconcileChannelVendorSelection({
      channelType: "relay",
      accountVendor: "OpenRouter",
      selectedVendorCodes: ["openai", "anthropic"],
      selectedResourceCodes: ["vendor.google", "bundle.openrouter.openai.chat"],
      availableResourceCodes: ["vendor.openai", "vendor.anthropic", "vendor.google"],
    }),
    {
      selectedVendorCodes: ["openai", "anthropic"],
      selectedResourceCodes: ["bundle.openrouter.openai.chat", "vendor.openai", "vendor.anthropic"],
    },
  );
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
    channelType: " official ",
    protocol: " Anthropic ",
    accessType: " Standard API Key ",
    baseUrl: " ",
    apiKey: " ",
    capabilities: ["llm"],
    resourceCodes: [" Vendor.Anthropic.Chat "],
    models: [" claude-3-5-sonnet-20241022 "],
    circuitBreakerEnabled: false,
    circuitBreakerFailureThreshold: "",
    weight: 20,
    status: "disabled",
  });

  assert.deepEqual(input, {
    name: "Anthropic Backup",
    vendor: "Anthropic",
    channelType: "official",
    protocol: "Anthropic",
    accessType: "Standard API Key",
    capabilities: ["llm"],
    resourceCodes: ["vendor.anthropic.chat"],
    models: ["claude-3-5-sonnet-20241022"],
    circuitBreakerPolicy: null,
    weight: 20,
    status: "disabled",
  });
  for (const field of ["id", "isMultimodal", "balance", "errors"]) {
    assert.equal(field in input, false);
  }
});

test("admin channel update input preserves an explicit empty AI resource list", () => {
  const input = createChannelUpdateInputFromForm({
    name: "OpenAI Primary",
    vendor: "OpenAI",
    channelType: "official",
    protocol: "OpenAI",
    accessType: "api-key",
    baseUrl: "https://api.openai.com/v1",
    apiKey: " ",
    capabilities: ["llm"],
    resourceCodes: [],
    models: ["openai/global/gpt-4o"],
    circuitBreakerEnabled: false,
    circuitBreakerFailureThreshold: "",
    weight: 100,
    status: "active",
  });

  assert.equal("resourceCodes" in input, true);
  assert.deepEqual(input.resourceCodes, []);
});

test("admin channel copy-create draft reuses routing settings but clears secret material", () => {
  const sourceChannel = {
    id: "channel-1",
    name: "OpenAI Primary",
    vendor: "OpenAI",
    ...channelContractDefaults(),
    protocol: "OpenAI",
    accessType: "api-key",
    baseUrl: "https://api.openai.com/v1",
    secretRef: "vault://providers/openai/main",
    apiKey: "sk-live-openai",
    createdAt: "2026-05-05T08:00:00Z",
    expiresAt: "2026-06-30T08:00:00Z",
    models: ["openai/global/gpt-4o"],
    capabilities: ["llm", "image"],
    isMultimodal: true,
    circuitBreakerPolicy: { failureThreshold: 2 },
    weight: 100,
    status: "error" as const,
    balance: "$20.00",
    errors: 2,
  };

  const editDraft = createChannelEditDraft(sourceChannel);
  const copyDraft = createChannelCopyDraft(sourceChannel);

  assert.deepEqual(editDraft, {
    name: "OpenAI Primary",
    vendor: "OpenAI",
    channelType: "official",
    protocol: "OpenAI",
    accessType: "api-key",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "",
    expiresAt: "2026-06-30T08:00:00Z",
    capabilities: ["llm", "image"],
    resourceCodes: [],
    models: ["openai/global/gpt-4o"],
    circuitBreakerEnabled: true,
    circuitBreakerFailureThreshold: 2,
    weight: 100,
    status: "error",
  });
  assert.deepEqual(copyDraft, {
    name: "OpenAI Primary",
    vendor: "OpenAI",
    channelType: "official",
    protocol: "OpenAI",
    accessType: "api-key",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "",
    expiresAt: "2026-06-30T08:00:00Z",
    capabilities: ["llm", "image"],
    resourceCodes: [],
    models: ["openai/global/gpt-4o"],
    circuitBreakerEnabled: true,
    circuitBreakerFailureThreshold: 2,
    weight: 100,
    status: "disabled",
  });
  assert.notEqual(copyDraft.models, sourceChannel.models);
  assert.notEqual(copyDraft.capabilities, sourceChannel.capabilities);
  assert.equal("id" in copyDraft, false);
  assert.equal("secretRef" in copyDraft, false);
});

test("admin channel account form normalizes channel type and AI resource codes", () => {
  assert.throws(
    () =>
      createChannelInputFromForm({
        name: "Relay",
        vendor: "OpenRouter",
        channelType: "aggregator",
        protocol: "OpenAI",
        accessType: "api-key",
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey: "sk-relay",
        capabilities: ["llm"],
        resourceCodes: ["bundle.openrouter.openai.chat"],
        models: ["openai/global/gpt-5.5"],
        weight: 100,
        status: "active",
      }),
    /Unsupported channel type: aggregator/,
  );
  assert.throws(
    () =>
      createChannelInputFromForm({
        name: "Relay",
        vendor: "OpenRouter",
        channelType: "relay",
        protocol: "OpenAI",
        accessType: "api-key",
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey: "sk-relay",
        capabilities: ["llm"],
        resourceCodes: ["bundle/openrouter/openai/chat"],
        models: ["openai/global/gpt-5.5"],
        weight: 100,
        status: "active",
      }),
    /Unsupported AI resource code: bundle\/openrouter\/openai\/chat/,
  );
});

test("admin channel status update input is a minimal command", () => {
  assert.deepEqual(createChannelStatusUpdateInput("disabled"), { status: "disabled" });
  assert.deepEqual(createChannelStatusUpdateInput("active"), { status: "active" });
});

test("admin AI resource form creates structured commands and preserves optional field semantics", () => {
  const createInput = createAiResourceInputFromForm({
    resourceCode: " Bundle.OpenRouter.OpenAI.Chat ",
    resourceType: " bundle ",
    displayName: " OpenRouter OpenAI Chat ",
    vendorCode: " OpenAI ",
    modalityCode: " Chat ",
    apiEndpointCode: " Chat_Completions ",
    catalogKey: " openai/global/gpt-5.5 ",
    model: " gpt-5.5 ",
    providerNativeModel: " gpt-5.5 ",
    compositionMode: " any ",
    status: " active ",
    sortOrder: "10",
    membersText: [
      " Model.OpenAI.GPT-5.5.Chat | included | true | 1 ",
      "model.openai.gpt-4o-mini.chat|fallback|false|2",
    ].join("\n"),
  });

  assert.deepEqual(createInput, {
    resourceCode: "Bundle.OpenRouter.OpenAI.Chat",
    resourceType: "bundle",
    displayName: "OpenRouter OpenAI Chat",
    vendorCode: "OpenAI",
    modalityCode: "Chat",
    apiEndpointCode: "Chat_Completions",
    catalogKey: "openai/global/gpt-5.5",
    model: "gpt-5.5",
    providerNativeModel: "gpt-5.5",
    compositionMode: "any",
    status: "active",
    sortOrder: 10,
    members: [
      {
        memberResourceCode: "Model.OpenAI.GPT-5.5.Chat",
        memberRole: "included",
        required: true,
        sortOrder: 1,
      },
      {
        memberResourceCode: "model.openai.gpt-4o-mini.chat",
        memberRole: "fallback",
        required: false,
        sortOrder: 2,
      },
    ],
  });

  const updateInput = createAiResourceUpdateInputFromForm({
    resourceCode: " ",
    resourceType: " ",
    displayName: " OpenRouter Realtime ",
    vendorCode: " ",
    modalityCode: " ",
    apiEndpointCode: " ",
    catalogKey: " ",
    model: " ",
    providerNativeModel: " ",
    compositionMode: " ",
    status: " disabled ",
    sortOrder: " ",
    membersText: " ",
  });

  assert.deepEqual(updateInput, {
    displayName: "OpenRouter Realtime",
    vendorCode: null,
    modalityCode: null,
    apiEndpointCode: null,
    catalogKey: null,
    model: null,
    providerNativeModel: null,
    status: "disabled",
    sortOrder: null,
    members: [],
  });
});

test("admin AI resource form rejects malformed member lines", () => {
  assert.throws(
    () => createAiResourceInputFromForm({
      resourceCode: "bundle.openrouter.openai.chat",
      resourceType: "bundle",
      displayName: "OpenRouter OpenAI Chat",
      membersText: "model.openai.gpt-5.5.chat | unknown | true | 1",
    }),
    /Unsupported AI resource member role: unknown/,
  );
  assert.throws(
    () => createAiResourceInputFromForm({
      resourceCode: "bundle.openrouter.openai.chat",
      resourceType: "bundle",
      displayName: "OpenRouter OpenAI Chat",
      membersText: "model.openai.gpt-5.5.chat | included | maybe | 1",
    }),
    /members\[0\]\.required must be true or false/,
  );
  assert.throws(
    () => createAiResourceInputFromForm({
      resourceCode: "bundle.openrouter.openai.chat",
      resourceType: "bundle",
      displayName: "OpenRouter OpenAI Chat",
      sortOrder: "-1",
    }),
    /sortOrder must be a non-negative integer/,
  );
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

test("admin channel modal keeps api key input on its own row with plaintext visibility controls", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /const \[apiKeyVisible, setApiKeyVisible\] = useState\(false\)/);
  assert.match(source, /className="grid grid-cols-1 gap-4"\s*>\s*<div>\s*<label[^>]*>\{t\('admin\.channel\.fields\.baseUrl'\)\}/s);
  assert.match(source, /<button\s+type="button"\s+onClick=\{\(\) => setApiKeyVisible\(\(current\) => !current\)\}/);
  assert.match(source, /type=\{apiKeyVisible \? 'text' : 'password'\}/);
  assert.match(source, /apiKeyVisible \? <EyeOff className="h-4 w-4" \/> : <Eye className="h-4 w-4" \/>/);
});

test("admin channel credential details can reveal returned plaintext api key", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /const \[apiKeyVisible, setApiKeyVisible\] = useState\(false\)/);
  assert.match(source, /label=\{t\('admin\.channel\.fields\.apiKey'\)\}/);
  assert.match(source, /const apiKeyDisplayValue = apiKeyVisible[\s\S]*resolveVisibleApiKey\(channel\)[\s\S]*maskApiKeyForDisplay\(channel\.apiKey\)/);
  assert.match(source, /function resolveVisibleApiKey\(channel: ChannelItem\): string/);
  assert.match(source, /value=\{apiKeyDisplayValue\}/);
  assert.doesNotMatch(source, /value=\{apiKeyVisible \? channel\.apiKey : maskApiKeyForDisplay\(channel\.apiKey\)\}/);
  assert.match(source, /onToggleVisibility=\{\(\) => setApiKeyVisible\(\(current\) => !current\)\}/);
  assert.match(source, /admin\.channel\.credentials\.apiKeyUnavailable/);
});

test("admin channel account lifetime fields are shown with never-expires default copy", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );
  const i18nSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-i18n/src/resources/admin/channel.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /name="expiresAt"/);
  assert.match(source, /type="datetime-local"/);
  assert.match(source, /admin\.channel\.fields\.createdAt/);
  assert.match(source, /admin\.channel\.fields\.expiresAt/);
  assert.match(source, /admin\.channel\.table\.createdAt/);
  assert.match(source, /admin\.channel\.table\.expiresAt/);
  assert.match(source, /admin\.channel\.expiration\.never/);
  assert.match(source, /<BusinessStateTableRow colSpan=\{9\}/);
  assert.match(source, /label=\{t\('admin\.channel\.fields\.createdAt'\)\} value=\{displayChannelTime\(channel\.createdAt/);
  assert.match(source, /label=\{t\('admin\.channel\.fields\.expiresAt'\)\}[\s\S]+admin\.channel\.expiration\.never/);

  for (const key of [
    "admin.channel.fields.createdAt",
    "admin.channel.fields.expiresAt",
    "admin.channel.table.createdAt",
    "admin.channel.table.expiresAt",
    "admin.channel.expiration.never",
    "admin.channel.help.expiresAt",
  ]) {
    const occurrences = i18nSource.match(new RegExp(`"${key.replaceAll(".", "\\.")}"`, "g"))?.length ?? 0;
    assert.equal(occurrences, 2, `expected ${key} to exist in English and Chinese resources`);
  }
});

test("admin channel list keeps model cells compact and shows actions by default", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /<ChannelModelsCell models=\{channel\.models\} \/>/);
  assert.match(source, /function ChannelModelsCell\(\{ models \}: \{ models: string\[\] \}\)/);
  assert.match(source, /t\('admin\.channel\.modelCount', \{ count: models\.length \}\)/);
  assert.match(source, /models\.map\(\(model\) =>/);
  assert.doesNotMatch(source, /channel\.models\.slice\(0, 3\)\.map/);
  assert.doesNotMatch(source, /\+{channel\.models\.length - 3}/);
  assert.doesNotMatch(source, /opacity-0 group-hover:opacity-100/);
  assert.match(source, /className="flex items-center justify-end gap-1"/);
});

test("admin channel row actions expose copy-create without copying credentials", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );
  const i18nSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-i18n/src/resources/admin/channel.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /type ModalMode = 'create' \| 'copy' \| 'edit'/);
  assert.match(source, /const openCopyCreateModal = \(channel: ChannelItem\) =>/);
  assert.match(source, /setChannelFormDraft\(createChannelCopyDraft\(channel\)\)/);
  assert.match(source, /mode === 'copy'\s+\? t\('admin\.channel\.modals\.copyChannelTitle'\)/);
  assert.match(source, /title=\{t\('admin\.channel\.actions\.copyCreateChannel'\)\}/);
  assert.match(source, /onClick=\{\(\) => openCopyCreateModal\(channel\)\}/);
  assert.match(source, /<Copy className="w-4 h-4" \/>/);
  assert.doesNotMatch(source, /defaultValue=\{initialValues\?\.apiKey/);

  for (const key of [
    "admin.channel.actions.copyCreateChannel",
    "admin.channel.modals.copyChannelTitle",
  ]) {
    const occurrences = i18nSource.match(new RegExp(`"${key.replaceAll(".", "\\.")}"`, "g"))?.length ?? 0;
    assert.equal(occurrences, 2, `expected ${key} to exist in English and Chinese resources`);
  }
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

test("admin channel modal does not expose protocol as a product routing control", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /showProtocolOptions/);
  assert.doesNotMatch(source, /setSelectedProtocol/);
  assert.doesNotMatch(source, /protocolsList\.map/);
  assert.doesNotMatch(source, /admin\.channel\.vendorPicker\.protocolAuto/);
  assert.doesNotMatch(source, /CredentialDetailField label=\{t\('admin\.channel\.fields\.protocol'\)\}/);
  assert.doesNotMatch(source, /\{channel\.protocol\}/);
  assert.match(source, /protocol: inferProtocolForVendor\(modelVendor\)/);
});

test("admin channel visible account copy is routed through i18n resources", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );
  const optionsSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/channelOptions.ts", import.meta.url),
    "utf8",
  );
  const i18nSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-i18n/src/resources/admin/channel.ts", import.meta.url),
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

test("admin channel AI resources belong to AI channel management navigation", () => {
  const registrySource = readFileSync(
    new URL("./src/adminModuleRegistry.ts", import.meta.url),
    "utf8",
  );
  const appSource = readFileSync(
    new URL("./src/App.tsx", import.meta.url),
    "utf8",
  );

  assert.match(registrySource, /groupBlock\('admin\.menu\.home\.accountPoolManagement'[\s\S]*\/admin\/channel\/resources/);
  assert.match(registrySource, /labelKey: 'admin\.menu\.aiResources'/);
  assert.match(appSource, /path="channel\/resources"/);
  assert.doesNotMatch(registrySource, /\/admin\/model\/capabilities/);
  assert.doesNotMatch(appSource, /path="model\/capabilities"/);
});

test("admin channel endpoints belong to AI channel management navigation", () => {
  const registrySource = readFileSync(
    new URL("./src/adminModuleRegistry.ts", import.meta.url),
    "utf8",
  );
  const appSource = readFileSync(
    new URL("./src/App.tsx", import.meta.url),
    "utf8",
  );

  assert.match(registrySource, /groupBlock\('admin\.menu\.home\.accountPoolManagement'[\s\S]*\/admin\/channel\/endpoints/);
  assert.match(registrySource, /labelKey: 'admin\.menu\.channelEndpoints'/);
  assert.match(appSource, /const ChannelEndpointAdmin = lazyRoute\(\(\) => import\('sdkwork-claw-router-admin-channel'\), 'ChannelEndpointAdmin'\)/);
  assert.match(appSource, /path="channel\/endpoints"/);
});

test("admin channel account modal supports account type and reusable AI resource binding", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );
  const packageManifest = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/package.json", import.meta.url),
    "utf8",
  );

  assert.match(source, /ChannelAiResourceService\.fetchAiResources\(\)/);
  assert.doesNotMatch(source, /sdkwork-claw-router-admin-model/);
  assert.doesNotMatch(packageManifest, /sdkwork-claw-router-admin-model/);
  assert.match(source, /channelType/);
  assert.match(source, /resourceCodes/);
  assert.match(source, /admin\.channel\.fields\.channelType/);
  assert.match(source, /admin\.channel\.fields\.aiResources/);
  assert.match(source, /admin\.channel\.channelType\.official/);
  assert.match(source, /admin\.channel\.channelType\.relay/);
});

test("admin channel credentials are viewed from account row actions instead of a standalone table", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.ok((source.match(/<table\b/g) ?? []).length >= 2);
  assert.match(source, /export function AiResourceAdmin/);
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

test("admin channel endpoint admin exposes regional endpoint management", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );
  const i18nSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-i18n/src/resources/admin/channel.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /export function ChannelEndpointAdmin/);
  assert.match(source, /function ChannelEndpointFormModal/);
  assert.match(source, /ChannelEndpointService\.fetchChannelEndpoints\(\)/);
  assert.match(source, /ChannelEndpointService\.createChannelEndpoint/);
  assert.match(source, /ChannelEndpointService\.updateChannelEndpoint/);
  assert.match(source, /ChannelService\.fetchChannelEndpointOptions\(\)/);
  assert.match(source, /channelId/);
  assert.match(source, /name="channelId"/);
  assert.match(source, /name="vendorCode"/);
  assert.match(source, /name="regionCode"/);
  assert.match(source, /name="apiEndpointCode"/);
  assert.match(source, /name="baseUrl"/);
  assert.match(source, /admin\.channel\.channelEndpoints\.actions\.add/);
  assert.match(source, /admin\.channel\.channelEndpoints\.actions\.edit/);
  assert.match(source, /admin\.channel\.channelEndpoints\.actions\.disable/);
  assert.match(source, /admin\.channel\.channelEndpoints\.actions\.enable/);
  assert.doesNotMatch(source, /name="providerCode"[\s\S]*ChannelEndpointFormModal/s);
  assert.doesNotMatch(source, /name="accountCode"[\s\S]*ChannelEndpointFormModal/s);
  assert.doesNotMatch(source, /name="channelType"[\s\S]*ChannelEndpointFormModal/s);

  for (const key of [
    "admin.channel.channelEndpoints.title",
    "admin.channel.channelEndpoints.subtitle",
    "admin.channel.channelEndpoints.actions.add",
    "admin.channel.channelEndpoints.actions.edit",
    "admin.channel.channelEndpoints.actions.disable",
    "admin.channel.channelEndpoints.actions.enable",
    "admin.channel.channelEndpoints.messages.created",
    "admin.channel.channelEndpoints.messages.updated",
    "admin.channel.channelEndpoints.messages.disabled",
    "admin.channel.channelEndpoints.messages.enabled",
    "admin.channel.channelEndpoints.modals.createTitle",
    "admin.channel.channelEndpoints.modals.editTitle",
  ]) {
    const occurrences = i18nSource.match(new RegExp(`"${key.replaceAll(".", "\\.")}"`, "g"))?.length ?? 0;
    assert.equal(occurrences, 2, `expected ${key} to exist in English and Chinese resources`);
  }
});

test("admin channel AI resource service calls generated backend SDK path and normalizes data", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ai/resources" && method === "GET") {
        return {
          items: [
            {
              id: "cap-1",
              resourceCode: "bundle.openrouter.openai.chat",
              resourceType: "bundle",
              displayName: "OpenRouter OpenAI Chat",
              vendorCode: "openai",
              modalityCode: "chat",
              apiEndpointCode: "chat_completions",
              catalogKey: "openai/global/gpt-5.5",
              model: "gpt-5.5",
              providerNativeModel: "gpt-5.5",
              compositionMode: "any",
              status: "active",
              sortOrder: 10,
              members: [
                {
                  parentResourceCode: "bundle.openrouter.openai.chat",
                  memberResourceCode: "model.openai.gpt-5.5.chat_completions",
                  memberRole: "included",
                  required: true,
                  sortOrder: 1,
                },
              ],
            },
          ],
        };
      }
      throw new Error(`Unexpected ${method} ${url}`);
    },
    async (captured) => {
      const resources = await ChannelAiResourceService.fetchAiResources();

      assert.equal(captured.length, 1);
      assert.equal(captured[0].url, "/backend/v3/api/ai/resources");
      assert.deepEqual(resources, [
        {
          id: "cap-1",
          resourceCode: "bundle.openrouter.openai.chat",
          resourceType: "bundle",
          displayName: "OpenRouter OpenAI Chat",
          vendorCode: "openai",
          modalityCode: "chat",
          apiEndpointCode: "chat_completions",
          catalogKey: "openai/global/gpt-5.5",
          model: "gpt-5.5",
          providerNativeModel: "gpt-5.5",
          compositionMode: "any",
          status: "active",
          sortOrder: 10,
          members: [
            {
              parentResourceCode: "bundle.openrouter.openai.chat",
              memberResourceCode: "model.openai.gpt-5.5.chat_completions",
              memberRole: "included",
              required: true,
              sortOrder: 1,
            },
          ],
        },
      ]);
    },
  );
});

test("admin channel AI resource service creates and updates through generated backend SDK", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      if (url === "/backend/v3/api/ai/resources" && method === "POST") {
        assert.deepEqual(body, {
          resourceCode: "bundle.openrouter.openai.standard",
          resourceType: "bundle",
          displayName: "OpenRouter OpenAI Standard",
          vendorCode: "openai",
          compositionMode: "all",
          status: "active",
          sortOrder: 5,
          members: [
            {
              memberResourceCode: "model.openai.gpt-4o-mini.chat",
              memberRole: "included",
              required: true,
              sortOrder: 1,
            },
          ],
        });
        return {
          item: {
            id: "resource-5",
            ...body,
            modalityCode: body.modalityCode ?? null,
            apiEndpointCode: body.apiEndpointCode ?? null,
            catalogKey: body.catalogKey ?? null,
            model: body.model ?? null,
            providerNativeModel: body.providerNativeModel ?? null,
            members: body.members.map((member: Record<string, unknown>) => ({
              parentResourceCode: body.resourceCode,
              ...member,
            })),
          },
        };
      }
      if (url === "/backend/v3/api/ai/resources/resource-5" && method === "PUT") {
        return {
          item: {
            id: "resource-5",
            resourceCode: "bundle.openrouter.openai.standard",
            resourceType: "bundle",
            displayName: body.displayName ?? "OpenRouter OpenAI Standard",
            vendorCode: body.vendorCode,
            modalityCode: null,
            apiEndpointCode: null,
            catalogKey: null,
            model: null,
            providerNativeModel: null,
            compositionMode: body.compositionMode ?? "all",
            status: body.status ?? "active",
            sortOrder: body.sortOrder,
            members: body.members ?? [],
          },
        };
      }
      throw new Error(`Unexpected ${method} ${url}`);
    },
    async (captured) => {
      const created = await ChannelAiResourceService.createAiResource({
        resourceCode: " Bundle.OpenRouter.OpenAI.Standard ",
        resourceType: "bundle",
        displayName: " OpenRouter OpenAI Standard ",
        vendorCode: " OpenAI ",
        compositionMode: "all",
        status: "active",
        sortOrder: 5,
        members: [
          {
            memberResourceCode: " Model.OpenAI.GPT-4o-Mini.Chat ",
            memberRole: "included",
            required: true,
            sortOrder: 1,
          },
        ],
      });
      const updated = await ChannelAiResourceService.updateAiResource("resource-5", {
        displayName: " OpenRouter OpenAI Realtime ",
        vendorCode: null,
        sortOrder: null,
        members: [],
      });
      await ChannelAiResourceService.updateAiResource("resource-5", { status: "disabled" });

      assert.equal(created.id, "resource-5");
      assert.equal(updated.vendorCode, undefined);
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        [
          "POST /backend/v3/api/ai/resources",
          "PUT /backend/v3/api/ai/resources/resource-5",
          "PUT /backend/v3/api/ai/resources/resource-5",
        ],
      );
      assert.deepEqual(JSON.parse(captured[1].body), {
        displayName: "OpenRouter OpenAI Realtime",
        vendorCode: null,
        sortOrder: null,
        members: [],
      });
      assert.deepEqual(JSON.parse(captured[2].body), { status: "disabled" });
    },
  );
});

test("admin channel AI resource service rejects unsafe mutation input before SDK calls", async () => {
  await withBackendSdkFetch(
    () => {
      throw new Error("SDK fetch should not be called for invalid AI resource input");
    },
    async (captured) => {
      await assert.rejects(
        () => ChannelAiResourceService.updateAiResource("resource/5", { status: "active" }),
        /aiResourceId must be a safe path segment/,
      );
      await assert.rejects(
        () => ChannelAiResourceService.createAiResource({
          resourceCode: "bundle/openrouter/openai/chat",
          resourceType: "bundle",
          displayName: "OpenRouter OpenAI Chat",
        }),
        /resourceCode must be an AI resource code/,
      );
      assert.equal(captured.length, 0);
    },
  );
});

test("admin channel AI resource admin exposes create edit and status actions", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );
  const i18nSource = readFileSync(
    new URL("./packages/sdkwork-claw-router-i18n/src/resources/admin/channel.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /function AiResourceFormModal/);
  assert.match(source, /ChannelAiResourceService\.createAiResource/);
  assert.match(source, /ChannelAiResourceService\.updateAiResource/);
  assert.match(source, /name="resourceCode"/);
  assert.match(source, /name="resourceType"/);
  assert.match(source, /name="membersText"/);
  assert.match(source, /admin\.channel\.aiResources\.actions\.add/);
  assert.match(source, /admin\.channel\.aiResources\.actions\.edit/);
  assert.match(source, /admin\.channel\.aiResources\.actions\.disable/);
  assert.match(source, /admin\.channel\.aiResources\.actions\.enable/);

  for (const key of [
    "admin.channel.aiResources.actions.add",
    "admin.channel.aiResources.actions.edit",
    "admin.channel.aiResources.actions.disable",
    "admin.channel.aiResources.actions.enable",
    "admin.channel.aiResources.messages.created",
    "admin.channel.aiResources.messages.updated",
    "admin.channel.aiResources.messages.disabled",
    "admin.channel.aiResources.messages.enabled",
    "admin.channel.aiResources.modals.createTitle",
    "admin.channel.aiResources.modals.editTitle",
  ]) {
    const occurrences = i18nSource.match(new RegExp(`"${key.replaceAll(".", "\\.")}"`, "g"))?.length ?? 0;
    assert.equal(occurrences, 2, `expected ${key} to exist in English and Chinese resources`);
  }
});

test("admin channel AI resource create and update submit paths stay strongly typed", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /onCreateSubmit:\s*\(input:\s*AiResourceCreateInput\)\s*=>\s*Promise<void>/);
  assert.match(source, /onUpdateSubmit:\s*\(input:\s*AiResourceUpdateInput\)\s*=>\s*Promise<void>/);
  assert.match(source, /const handleCreateResource = async \(input: AiResourceCreateInput\)/);
  assert.match(source, /const handleUpdateResource = async \(input: AiResourceUpdateInput\)/);
  assert.doesNotMatch(source, /createAiResource\(input as AiResourceCreateInput\)/);
});

test("admin channel AI resource modal uses catalog and resource selectors instead of raw model and member text entry", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /availableModels:\s*ChannelModelCatalogItem\[\]/);
  assert.match(source, /availableResources:\s*AiResource\[\]/);
  assert.match(source, /function AiResourceModelSelector/);
  assert.match(source, /function AiResourceMemberSelector/);
  assert.match(source, /data-ai-resource-model-selector/);
  assert.match(source, /data-ai-resource-member-selector/);
  assert.match(source, /<select[\s\S]*name="catalogKey"/s);
  assert.match(source, /name="providerNativeModel"[\s\S]*readOnly/s);
  assert.match(source, /name="membersText"[\s\S]*className="sr-only"/s);
  assert.match(source, /availableModels=\{modelCatalog\}/);
  assert.match(source, /availableResources=\{resources\}/);
});

test("admin channel AI resource service fails closed for malformed rows", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ai/resources" && method === "GET") {
        return {
          items: [
            {
              id: "cap-1",
              resourceCode: "bundle/openrouter/openai/chat",
              resourceType: "bundle",
              displayName: "OpenRouter OpenAI Chat",
              compositionMode: "any",
              status: "active",
              members: [],
            },
          ],
        };
      }
      throw new Error(`Unexpected ${method} ${url}`);
    },
    async () => {
      await assert.rejects(
        () => ChannelAiResourceService.fetchAiResources(),
        /resourceCode must be an AI resource code/,
      );
    },
  );
});

test("admin channel model catalog maps runtime ids instead of display aliases", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/ai/models" && method === "GET") {
        return {
          items: [
            {
              id: "model-1",
              vendorId: "vendor-1",
              vendorCode: "openai",
              model: "gpt-4o-mini",
              displayName: "GPT-4o Mini",
              name: "GPT-4o Mini",
              type: "Chat",
              priceIn: "0.1500",
              priceOut: "0.6000",
              cacheReadPrice: "0.0750",
              cacheWritePrice: "0.1500",
              status: "active",
              calls: "42",
              description: null,
              modalities: ["text"],
              inputModalities: ["text"],
              outputModalities: ["text"],
              apiFormat: "openai_responses",
              capabilityIntro: null,
              limitations: [],
              supportedLanguages: [],
              useCases: [],
              trainingDataCutoff: null,
              contextTokens: 128000,
              maxOutputTokens: null,
              supportsStreaming: true,
              supportsTools: true,
              supportsJsonSchema: true,
              releaseStage: 1,
              shelfState: 1,
              routingState: 1,
              replacementModel: null,
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async () => {
      const models = await ChannelModelCatalogService.fetchModels();

      assert.deepEqual(models, [
        {
          catalogKey: "openai/global/gpt-4o-mini",
          model: "gpt-4o-mini",
          displayName: "GPT-4o Mini",
          vendorCode: "openai",
          regionCode: "global",
        },
      ]);
    },
  );
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

test("admin channel endpoint form creates dedicated commands without derived account identity", () => {
  const createInput = createChannelEndpointInputFromForm({
    channelId: " 9002 ",
    vendorCode: " OpenAI ",
    regionCode: " Global ",
    apiEndpointCode: " Chat_Completions ",
    baseUrl: " https://api.openai.com/v1 ",
    priority: "10",
    weight: "20",
    status: "active",
    effectiveFrom: "",
    effectiveTo: " 2026-06-30T08:00:00Z ",
  });
  assert.deepEqual(createInput, {
    channelId: "9002",
    vendorCode: "openai",
    regionCode: "global",
    apiEndpointCode: "chat_completions",
    baseUrl: "https://api.openai.com/v1",
    priority: 10,
    weight: 20,
    status: "active",
    effectiveTo: "2026-06-30T08:00:00Z",
  });
  assert.equal("providerCode" in createInput, false);
  assert.equal("accountCode" in createInput, false);
  assert.equal("channelType" in createInput, false);

  const updateInput = createChannelEndpointUpdateInputFromForm({
    vendorCode: " OpenAI ",
    regionCode: " us-east-1 ",
    apiEndpointCode: " responses ",
    baseUrl: " https://api.openai.com/v1 ",
    priority: 30,
    weight: 40,
    status: "disabled",
    effectiveFrom: "",
    effectiveTo: "",
  });
  assert.deepEqual(updateInput, {
    vendorCode: "openai",
    regionCode: "us-east-1",
    apiEndpointCode: "responses",
    baseUrl: "https://api.openai.com/v1",
    priority: 30,
    weight: 40,
    status: "disabled",
    effectiveFrom: null,
    effectiveTo: null,
  });

  assert.throws(
    () => createChannelEndpointInputFromForm({
      channelId: "channel-1",
      vendorCode: "openai",
      regionCode: "global",
      apiEndpointCode: "chat_completions",
      baseUrl: "https://api.openai.com/v1",
    }),
    /channelId must be a positive integer/,
  );
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
            ...channelContractDefaults(),
            protocol: "OpenAI",
            accessType: "api-key",
            baseUrl: "https://api.openai.com/v1",
            secretRef: "vault://providers/openai/main",
            createdAt: "2026-05-05T08:00:00Z",
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
            ...channelContractDefaults(),
            protocol: "OpenAI",
            accessType: "api-key",
            baseUrl: "https://api.openai.com/v1",
            secretRef: "vault://providers/openai/main",
            createdAt: "2026-05-05T08:00:00Z",
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

test("admin channel service sends an empty AI resource list when clearing bindings", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      if (url === "/backend/v3/api/integration/channels" && method === "PUT") {
        return {
          item: {
            id: "channel-clear-resources",
            name: "OpenAI Primary",
            vendor: "OpenAI",
            ...channelContractDefaults(),
            protocol: "OpenAI",
            accessType: "api-key",
            baseUrl: "https://api.openai.com/v1",
            secretRef: "vault://providers/openai/main",
            createdAt: "2026-05-05T08:00:00Z",
            models: ["openai/global/gpt-4o"],
            capabilities: ["llm"],
            resourceCodes: [],
            isMultimodal: false,
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
      await ChannelService.updateChannel("channel-clear-resources", {
        resourceCodes: [],
      });

      assert.deepEqual(JSON.parse(captured[0].body).resourceCodes, []);
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
              ...channelContractDefaults(),
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              createdAt: "2026-05-05T08:00:00Z",
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
              channelId: "9001",
              name: "OpenAI Primary",
              vendor: "OpenAI",
              ...channelContractDefaults(),
              protocol: "OpenAI",
              accessType: "api-key",
              baseUrl: "https://api.openai.com/v1",
              secretRef: "vault://providers/openai/main",
              apiKey: "sk-live-openai",
              createdAt: "2026-05-05T08:00:00Z",
              expiresAt: "2026-06-30T08:00:00Z",
              models: ["openai/global/gpt-4o"],
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
            ...channelContractDefaults(),
            channelId: "9002",
            protocol: "Anthropic",
            accessType: "api-key",
            baseUrl: "https://api.anthropic.com",
            secretRef: "vault://providers/anthropic/backup",
            apiKey: "sk-ant-live-secret",
            createdAt: "2026-05-06T08:00:00Z",
            models: ["anthropic/global/claude-3-5-sonnet"],
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
            ...channelContractDefaults(),
            channelId: "9002",
            protocol: "Anthropic",
            accessType: "api-key",
            apiKey: "sk-ant-live-secret",
            createdAt: "2026-05-06T08:00:00Z",
            expiresAt: null,
            models: ["anthropic/global/claude-3-5-sonnet"],
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
          channelId: "9001",
          name: "OpenAI Primary",
          vendor: "OpenAI",
          ...channelContractDefaults(),
          protocol: "OpenAI",
          accessType: "api-key",
          apiKey: "sk-live-openai",
          createdAt: "2026-05-05T08:00:00Z",
          expiresAt: "2026-06-30T08:00:00Z",
          models: ["openai/global/gpt-4o"],
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
        expiresAt: " 2026-07-01T00:00:00Z ",
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
        expiresAt: null,
      });
      const tested = await ChannelService.testChannel("channel-2");
      const deleted = await ChannelService.deleteChannel("channel-2");

      assert.equal(channels[0].id, "channel-1");
      assert.equal(channels[0].channelId, "9001");
      assert.equal(channels[0].status, "error");
      assert.equal(channels[0].apiKey, "sk-live-openai");
      assert.equal(channels[0].createdAt, "2026-05-05T08:00:00Z");
      assert.equal(channels[0].expiresAt, "2026-06-30T08:00:00Z");
      assert.equal(channels[0].timeoutMs, 30000);
      assert.deepEqual(channels[0].retryPolicy?.retryableStatusCodes, [429, 500]);
      assert.deepEqual(channels[0].circuitBreakerPolicy, { failureThreshold: 2 });
      assert.equal(created.id, "channel-2");
      assert.equal(created.channelId, "9002");
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
        expiresAt: "2026-07-01T00:00:00Z",
        models: ["anthropic/global/claude-3-5-sonnet"],
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
        expiresAt: null,
      });
      for (const request of captured) {
        assert.equal(request.headers["x-request-id"], undefined);
      }
    },
  );
});

test("admin channel service prefixes slash-containing native models instead of rejecting them", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/integration/channels" && init?.method === "POST") {
        return {
          item: {
            id: "channel-openrouter",
            name: "OpenRouter",
            vendor: "OpenRouter",
            ...channelContractDefaults(),
            protocol: "OpenAI",
            accessType: "api-key",
            baseUrl: "https://openrouter.ai/api/v1",
            secretRef: "vault://providers/openrouter/main",
            apiKey: "sk-openrouter",
            createdAt: "2026-05-06T08:00:00Z",
            models: ["openrouter/global/anthropic/claude-3-opus"],
            capabilities: ["llm"],
            isMultimodal: false,
            weight: 20,
            status: "active",
            balance: "N/A",
            errors: 0,
          },
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async (captured) => {
      await ChannelService.addChannel({
        name: "OpenRouter",
        vendor: "OpenRouter",
        protocol: "OpenAI",
        accessType: "api-key",
        baseUrl: "https://openrouter.ai/api/v1",
        apiKey: "sk-openrouter",
        models: ["anthropic/claude-3-opus", "openrouter/global/google/gemini-1.5-pro"],
        capabilities: ["llm"],
        weight: 20,
        status: "active",
      });

      assert.deepEqual(JSON.parse(captured[0].body).models, [
        "openrouter/global/anthropic/claude-3-opus",
        "openrouter/global/google/gemini-1.5-pro",
      ]);
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
      for (const request of captured) {
        assert.equal(request.headers["x-request-id"], undefined);
      }
    },
  );
});

test("admin channel endpoint service uses generated backend SDK and normalizes regional endpoints", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      const method = init?.method ?? "GET";
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      if (url === "/backend/v3/api/integration/channel_endpoints" && method === "GET") {
        return {
          items: [
            {
              id: "1",
              channelId: "9002",
              providerCode: "openrouter",
              channelCode: "openrouter-main",
              channelType: "relay",
              vendorCode: "openai",
              regionCode: "global",
              apiEndpointCode: "openai.chat_completions",
              baseUrl: "https://provider-proxy.internal/openrouter/openai",
              priority: 20,
              weight: 300,
              healthStatus: "healthy",
              status: "active",
              effectiveFrom: "2026-05-28 10:00:00",
              effectiveTo: null,
            },
          ],
        };
      }
      if (url === "/backend/v3/api/integration/channel_endpoints" && method === "POST") {
        assert.deepEqual(body, {
          channelId: "9002",
          vendorCode: "openai",
          regionCode: "global",
          apiEndpointCode: "openai.chat_completions",
          baseUrl: "https://provider-proxy.internal/openrouter/openai",
          priority: 20,
          weight: 300,
          status: "active",
        });
        return {
          item: {
            id: "2",
            providerCode: "openrouter",
            channelCode: "openrouter-main",
            channelType: "relay",
            healthStatus: "unknown",
            effectiveFrom: null,
            effectiveTo: null,
            ...body,
          },
        };
      }
      if (url === "/backend/v3/api/integration/channel_endpoints/2" && method === "PUT") {
        assert.deepEqual(body, {
          regionCode: "us-east-1",
          baseUrl: "https://us-east.provider-proxy.internal/openrouter/openai",
          priority: 5,
          effectiveTo: null,
        });
        return {
          item: {
            id: "2",
            channelId: "9002",
            providerCode: "openrouter",
            channelCode: "openrouter-main",
            channelType: "relay",
            vendorCode: "openai",
            apiEndpointCode: "openai.chat_completions",
            weight: 300,
            healthStatus: "healthy",
            status: "active",
            effectiveFrom: null,
            ...body,
          },
        };
      }
      throw new Error(`Unexpected SDK request ${method} ${url}`);
    },
    async (captured) => {
      const endpoints = await ChannelEndpointService.fetchChannelEndpoints();
      const created = await ChannelEndpointService.createChannelEndpoint({
        channelId: " 9002 ",
        vendorCode: " OpenAI ",
        regionCode: " Global ",
        apiEndpointCode: " OpenAI.Chat_Completions ",
        baseUrl: " https://provider-proxy.internal/openrouter/openai ",
        priority: 20,
        weight: 300,
        status: "active",
      });
      const updated = await ChannelEndpointService.updateChannelEndpoint("2", {
        regionCode: " US-East-1 ",
        baseUrl: " https://us-east.provider-proxy.internal/openrouter/openai ",
        priority: 5,
        effectiveTo: null,
      });

      assert.equal(endpoints[0].id, "1");
      assert.equal(endpoints[0].channelType, "relay");
      assert.equal(created.providerCode, "openrouter");
      assert.equal(updated.regionCode, "us-east-1");
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        [
          "GET /backend/v3/api/integration/channel_endpoints",
          "POST /backend/v3/api/integration/channel_endpoints",
          "PUT /backend/v3/api/integration/channel_endpoints/2",
        ],
      );
    },
  );
});

test("admin channel endpoint channel options tolerate backend channel records without models", async () => {
  await withBackendSdkFetch(
    (url, init) => {
      if (url === "/backend/v3/api/integration/channels" && init?.method === "GET") {
        return {
          items: [
            {
              id: "channel-1",
              channelId: "9001",
              name: "OpenRouter Main",
              vendor: "OpenRouter",
              channelType: "relay",
            },
          ],
        };
      }
      throw new Error(`Unexpected SDK request ${init?.method ?? "GET"} ${url}`);
    },
    async (captured) => {
      const channels = await ChannelService.fetchChannelEndpointOptions();

      assert.deepEqual(channels, [
        {
          channelId: "9001",
          name: "OpenRouter Main",
          vendor: "OpenRouter",
        },
      ]);
      assert.deepEqual(
        captured.map((request) => `${request.method} ${request.url}`),
        ["GET /backend/v3/api/integration/channels"],
      );
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
    ...channelContractDefaults(),
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
              ...channelContractDefaults(),
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              createdAt: "2026-05-05T08:00:00Z",
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
              ...channelContractDefaults(),
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              createdAt: "2026-05-05T08:00:00Z",
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
              ...channelContractDefaults(),
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              createdAt: "2026-05-05T08:00:00Z",
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
              ...channelContractDefaults(),
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              createdAt: "2026-05-05T08:00:00Z",
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
              ...channelContractDefaults(),
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              createdAt: "2026-05-05T08:00:00Z",
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
              ...channelContractDefaults(),
              protocol: "OpenAI",
              accessType: "api-key",
              secretRef: "vault://providers/openai/main",
              createdAt: "2026-05-05T08:00:00Z",
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

test("admin channel table fills the available admin viewport", () => {
  const source = readFileSync(
    new URL("./packages/sdkwork-claw-router-admin-channel/src/index.tsx", import.meta.url),
    "utf8",
  );

  for (const expected of [
    "AdminTableShell",
    "data-admin-channel-table-card",
    "data-admin-channel-table-viewport",
    "flex h-full min-h-0 w-full flex-col",
    "sticky top-0 z-10",
    "footer={",
  ]) {
    assert.ok(source.includes(expected), `missing adaptive admin channel table marker: ${expected}`);
  }
});
