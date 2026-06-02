export type ConversationOperationMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
export type ConversationOperationSecurity = "adminToken" | "dualToken";
export type ConversationSdkNamespace = "conversations";
export type ConversationSource = "agent" | "customer_service" | "open_platform" | "system" | "user";
export type ConversationMessageChannel = "api" | "customer_service" | "mini_app" | "official_account" | "web";
export type ConversationRole = "assistant" | "support" | "system" | "user";
export type ConversationDomainModelName = keyof typeof SDKWORK_CONVERSATION_TABLES;
export type ConversationCapabilityName = "conversation" | "externalIdentity" | "handoff" | "message" | "turn";

export interface ConversationOperationContract {
  apiSurface: "app" | "backend";
  method: ConversationOperationMethod;
  operationId: string;
  operationKey: string;
  path: string;
  queryParameters?: readonly string[];
  security: ConversationOperationSecurity;
  tag: ConversationSdkNamespace;
}

export interface ConversationDomainModelContract {
  capabilities: readonly ConversationCapabilityName[];
  domain: "conversation";
  fields: readonly string[];
  name: ConversationDomainModelName;
  table: (typeof SDKWORK_CONVERSATION_TABLES)[ConversationDomainModelName];
}

export interface ConversationCapabilityContract {
  domain: "conversation";
  models: readonly ConversationDomainModelName[];
  name: ConversationCapabilityName;
  operations: readonly string[];
  sdkNamespaces: readonly ConversationSdkNamespace[];
}

export interface ConversationPolicy {
  allowedExternalSources: readonly ["open_platform"];
  canonicalUnit: "conversation";
  customerServiceRole: "support";
  externalIdentityTable: "conversation_external";
  messageTable: "conversation_message";
  officialAccountChannel: "official_account";
  requireTenantIsolation: boolean;
  supportMessageTable: null;
  supportSessionTable: null;
  turnTable: "conversation_turn";
}

export type ConversationSdkResponse<T> = Promise<T | { code?: number | string; data?: T; message?: string; msg?: string }>;
export type ConversationSdkMethod = (...args: any[]) => ConversationSdkResponse<any>;

type MethodTree = {
  readonly [key: string]: true | MethodTree;
};

type ClientFromMethodTree<TTree extends MethodTree> = {
  readonly [TKey in keyof TTree]: TTree[TKey] extends true
    ? ConversationSdkMethod
    : TTree[TKey] extends MethodTree
      ? ClientFromMethodTree<TTree[TKey]>
      : never;
};

export const SDKWORK_CONVERSATION_STANDARD = {
  acceptedSources: ["open_platform", "customer_service", "agent", "user", "system"],
  api: {
    appPrefix: "/app/v3/api",
    backendPrefix: "/backend/v3/api",
    openapi: "3.1.2",
  },
  architecture: "common",
  canonicalUnit: "conversation",
  databasePrefix: "conversation",
  domain: "conversation",
  sdkNamespaces: ["conversations"],
} as const;

export const SDKWORK_CONVERSATION_MESSAGE_CHANNELS = [
  "official_account",
  "mini_app",
  "web",
  "customer_service",
  "api",
] as const satisfies readonly ConversationMessageChannel[];

export const SDKWORK_CONVERSATION_ROLES = [
  "user",
  "assistant",
  "support",
  "system",
] as const satisfies readonly ConversationRole[];

export const SDKWORK_CONVERSATION_TABLES = {
  conversation: "conversation",
  conversationExternal: "conversation_external",
  item: "conversation_item",
  message: "conversation_message",
  messageExternal: "conversation_message_external",
  messagePart: "conversation_message_part",
  turn: "conversation_turn",
} as const;

const app = SDKWORK_CONVERSATION_STANDARD.api.appPrefix;
const backend = SDKWORK_CONVERSATION_STANDARD.api.backendPrefix;

export const SDKWORK_CONVERSATION_API_ROUTES = {
  app: {
    conversations: {
      list: operation("GET", `${app}/conversations`, "conversations.list", ["page", "page_size", "cursor"]),
      create: operation("POST", `${app}/conversations`, "conversations.create"),
      retrieve: operation("GET", `${app}/conversations/{conversationId}`, "conversations.retrieve"),
      update: operation("PATCH", `${app}/conversations/{conversationId}`, "conversations.update"),
      delete: operation("DELETE", `${app}/conversations/{conversationId}`, "conversations.delete"),
      messages: {
        list: operation(
          "GET",
          `${app}/conversations/{conversationId}/messages`,
          "conversations.messages.list",
          ["page", "page_size", "cursor"],
        ),
        create: operation("POST", `${app}/conversations/{conversationId}/messages`, "conversations.messages.create"),
      },
      turns: {
        create: operation("POST", `${app}/conversations/{conversationId}/turns`, "conversations.turns.create"),
        retrieve: operation(
          "GET",
          `${app}/conversations/{conversationId}/turns/{turnId}`,
          "conversations.turns.retrieve",
        ),
        response: {
          create: operation(
            "POST",
            `${app}/conversations/{conversationId}/turns/{turnId}/response`,
            "conversations.turns.response.create",
          ),
        },
      },
      externalLinks: {
        list: operation(
          "GET",
          `${app}/conversations/{conversationId}/external_links`,
          "conversations.externalLinks.list",
        ),
      },
      handoffs: {
        create: operation("POST", `${app}/conversations/{conversationId}/handoffs`, "conversations.handoffs.create"),
      },
    },
  },
  backend: {
    conversations: {
      list: operation("GET", `${backend}/conversations`, "conversations.list", [
        "owner_user_id",
        "source",
        "channel",
        "status",
        "page",
        "page_size",
      ]),
      retrieve: operation("GET", `${backend}/conversations/{conversationId}`, "conversations.retrieve"),
      update: operation("PATCH", `${backend}/conversations/{conversationId}`, "conversations.update"),
      messages: {
        list: operation(
          "GET",
          `${backend}/conversations/{conversationId}/messages`,
          "conversations.messages.list",
          ["page", "page_size", "cursor"],
        ),
        create: operation(
          "POST",
          `${backend}/conversations/{conversationId}/messages`,
          "conversations.messages.create",
        ),
      },
      turns: {
        retrieve: operation(
          "GET",
          `${backend}/conversations/{conversationId}/turns/{turnId}`,
          "conversations.turns.retrieve",
        ),
      },
      externalLinks: {
        list: operation(
          "GET",
          `${backend}/conversations/{conversationId}/external_links`,
          "conversations.externalLinks.list",
        ),
        create: operation(
          "POST",
          `${backend}/conversations/{conversationId}/external_links`,
          "conversations.externalLinks.create",
        ),
      },
      handoffs: {
        create: operation(
          "POST",
          `${backend}/conversations/{conversationId}/handoffs`,
          "conversations.handoffs.create",
        ),
      },
    },
  },
} as const;

export const SDKWORK_CONVERSATION_OPERATION_IDS = flattenOperations(SDKWORK_CONVERSATION_API_ROUTES);

export const SDKWORK_CONVERSATION_DOMAIN_MODELS = [
  model("conversation", ["conversation", "handoff"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "owner_user_id",
    "title",
    "status",
    "source",
    "channel",
    "handoff_status",
    "last_message_at",
    "created_at",
    "updated_at",
  ]),
  model("turn", ["turn"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "conversation_id",
    "turn_no",
    "status",
    "input_message_id",
    "response_message_id",
    "agent_run_id",
    "started_at",
    "completed_at",
    "created_at",
    "updated_at",
  ]),
  model("item", ["conversation", "turn", "message"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "conversation_id",
    "turn_id",
    "item_type",
    "item_ref",
    "sort_no",
    "created_at",
  ]),
  model("message", ["message", "handoff"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "conversation_id",
    "turn_id",
    "role",
    "source",
    "channel",
    "content_text",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("messagePart", ["message"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "message_id",
    "part_type",
    "content_ref",
    "media_role",
    "media_resource_id",
    "object_blob_id",
    "media_resource_snapshot",
    "sort_no",
    "created_at",
  ]),
  model("conversationExternal", ["externalIdentity"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "conversation_id",
    "provider",
    "account_id",
    "external_user_id",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("messageExternal", ["externalIdentity", "message"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "message_id",
    "provider",
    "account_id",
    "external_message_id",
    "delivery_id",
    "outbox_id",
    "created_at",
  ]),
] as const satisfies readonly ConversationDomainModelContract[];

export const SDKWORK_CONVERSATION_CAPABILITIES = [
  capability("conversation", ["conversation", "item"], operationsMatching(/^(app|backend)\.conversations\.(list|create|retrieve|update|delete)$/)),
  capability("turn", ["turn", "item"], operationsMatching(/\.conversations\.turns\./)),
  capability("message", ["message", "messagePart", "item"], operationsMatching(/\.conversations\.messages\./)),
  capability("externalIdentity", ["conversationExternal", "messageExternal"], operationsMatching(/\.conversations\.externalLinks\./)),
  capability("handoff", ["conversation", "message"], operationsMatching(/\.conversations\.handoffs\./)),
] as const satisfies readonly ConversationCapabilityContract[];

export const APP_CONVERSATION_METHOD_TREE = {
  conversations: {
    list: true,
    create: true,
    retrieve: true,
    update: true,
    delete: true,
    messages: {
      list: true,
      create: true,
    },
    turns: {
      create: true,
      retrieve: true,
      response: {
        create: true,
      },
    },
    externalLinks: {
      list: true,
    },
    handoffs: {
      create: true,
    },
  },
} as const satisfies MethodTree;

export const BACKEND_CONVERSATION_METHOD_TREE = {
  conversations: {
    list: true,
    retrieve: true,
    update: true,
    messages: {
      list: true,
      create: true,
    },
    turns: {
      retrieve: true,
    },
    externalLinks: {
      list: true,
      create: true,
    },
    handoffs: {
      create: true,
    },
  },
} as const satisfies MethodTree;

export type ConversationAppSdkClient = ClientFromMethodTree<typeof APP_CONVERSATION_METHOD_TREE>;
export type ConversationBackendSdkClient = ClientFromMethodTree<typeof BACKEND_CONVERSATION_METHOD_TREE>;

export const SDKWORK_CONVERSATION_APP_SDK_REQUIRED_METHODS = flattenRequiredMethods(APP_CONVERSATION_METHOD_TREE);
export const SDKWORK_CONVERSATION_BACKEND_SDK_REQUIRED_METHODS = flattenRequiredMethods(BACKEND_CONVERSATION_METHOD_TREE);

const RETIRED_CONVERSATION_RESOURCES = new Set([
  "chat",
  "conversationMessages",
  "conversationTurns",
  "supportSessions",
  "supportMessages",
  "threads",
]);

export function createConversationPolicy(): ConversationPolicy {
  return {
    canonicalUnit: "conversation",
    externalIdentityTable: SDKWORK_CONVERSATION_TABLES.conversationExternal,
    messageTable: SDKWORK_CONVERSATION_TABLES.message,
    turnTable: SDKWORK_CONVERSATION_TABLES.turn,
    allowedExternalSources: ["open_platform"],
    customerServiceRole: "support",
    officialAccountChannel: "official_account",
    requireTenantIsolation: true,
    supportSessionTable: null,
    supportMessageTable: null,
  };
}

export function assertConversationAppSdkClient(client: unknown): asserts client is ConversationAppSdkClient {
  assertNoRetiredConversationShape(client, "app");
  const missingMethods = findMissingMethods(getConversationSdkSurface(client), SDKWORK_CONVERSATION_APP_SDK_REQUIRED_METHODS);
  if (missingMethods.length > 0) {
    throw new Error(`Generated app conversation SDK client is missing methods: ${missingMethods.join(", ")}`);
  }
}

export function assertConversationBackendSdkClient(client: unknown): asserts client is ConversationBackendSdkClient {
  assertNoRetiredConversationShape(client, "backend");
  const missingMethods = findMissingMethods(getConversationSdkSurface(client), SDKWORK_CONVERSATION_BACKEND_SDK_REQUIRED_METHODS);
  if (missingMethods.length > 0) {
    throw new Error(`Generated backend conversation SDK client is missing methods: ${missingMethods.join(", ")}`);
  }
}

export function getConversationSdkSurface(client: unknown): string[] {
  const methods: string[] = [];

  function visit(node: unknown, path: string[]) {
    if (!node || typeof node !== "object") {
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      const next = [...path, key];
      if (typeof value === "function") {
        methods.push(next.join("."));
      } else {
        visit(value, next);
      }
    }
  }

  visit(client, []);
  return methods.sort();
}

function assertNoRetiredConversationShape(client: unknown, surface: "app" | "backend"): void {
  const retiredResources = findRetiredConversationResources(client);
  if (retiredResources.length > 0) {
    throw new Error(
      `Generated ${surface} conversation SDK client exposes retired resources: ${retiredResources.join(", ")}. Use conversations directly.`,
    );
  }
}

function findRetiredConversationResources(client: unknown): string[] {
  if (!client || typeof client !== "object") {
    return [];
  }

  const matches: string[] = [];

  function visit(node: unknown, path: readonly string[]) {
    if (!node || typeof node !== "object") {
      return;
    }

    for (const [key, value] of Object.entries(node)) {
      const next = [...path, key];
      if (RETIRED_CONVERSATION_RESOURCES.has(key)) {
        matches.push(next.join("."));
      }
      visit(value, next);
    }
  }

  visit(client, []);
  return matches.sort();
}

function operation(
  method: ConversationOperationMethod,
  path: string,
  operationId: string,
  queryParameters?: readonly string[],
): ConversationOperationContract {
  const apiSurface = path.startsWith(`${backend}/`) ? "backend" : "app";
  return {
    apiSurface,
    method,
    operationId,
    operationKey: `${apiSurface}.${operationId}`,
    ...(queryParameters ? { queryParameters } : {}),
    path,
    security: apiSurface === "backend" ? "adminToken" : "dualToken",
    tag: "conversations",
  };
}

function model(
  name: ConversationDomainModelName,
  capabilities: readonly ConversationCapabilityName[],
  fields: readonly string[],
): ConversationDomainModelContract {
  return {
    capabilities,
    domain: "conversation",
    fields,
    name,
    table: SDKWORK_CONVERSATION_TABLES[name],
  };
}

function capability(
  name: ConversationCapabilityName,
  models: readonly ConversationDomainModelName[],
  operations: readonly string[],
): ConversationCapabilityContract {
  return {
    domain: "conversation",
    models,
    name,
    operations,
    sdkNamespaces: ["conversations"],
  };
}

function operationsMatching(pattern: RegExp): string[] {
  return Object.keys(SDKWORK_CONVERSATION_OPERATION_IDS)
    .filter((operationKey) => pattern.test(operationKey))
    .sort();
}

function findMissingMethods(surface: readonly string[], requiredMethods: readonly string[]): string[] {
  const surfaceSet = new Set(surface);
  return requiredMethods.filter((method) => !surfaceSet.has(method));
}

function flattenRequiredMethods(tree: MethodTree, path: readonly string[] = []): string[] {
  const methods: string[] = [];
  for (const [key, marker] of Object.entries(tree)) {
    const nextPath = [...path, key];
    if (marker === true) {
      methods.push(nextPath.join("."));
    } else {
      methods.push(...flattenRequiredMethods(marker, nextPath));
    }
  }
  return methods.sort();
}

function flattenOperations(value: unknown): Record<string, ConversationOperationContract> {
  const operations: ConversationOperationContract[] = [];

  function visit(node: unknown) {
    if (!node || typeof node !== "object") {
      return;
    }

    if ("operationId" in node && "path" in node) {
      operations.push(node as ConversationOperationContract);
      return;
    }

    for (const child of Object.values(node)) {
      visit(child);
    }
  }

  visit(value);
  return Object.fromEntries(
    operations
      .slice()
      .sort((left, right) => left.operationKey.localeCompare(right.operationKey))
      .map((operation) => [operation.operationKey, operation]),
  );
}
