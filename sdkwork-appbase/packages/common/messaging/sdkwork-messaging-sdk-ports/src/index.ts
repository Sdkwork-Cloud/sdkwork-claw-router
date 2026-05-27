export type MessagingSdkResponse<T> = Promise<T | { code?: number | string; data?: T; message?: string; msg?: string }>;
export type MessagingSdkMethod = (...args: unknown[]) => MessagingSdkResponse<unknown>;

type MethodTree = {
  readonly [key: string]: true | MethodTree;
};

type ClientFromMethodTree<TTree extends MethodTree> = {
  readonly [TKey in keyof TTree]: TTree[TKey] extends true
    ? MessagingSdkMethod
    : TTree[TKey] extends MethodTree
      ? ClientFromMethodTree<TTree[TKey]>
      : never;
};

export const APP_MESSAGING_METHOD_TREE = {
  verificationCodes: {
    create: true,
    verify: true,
  },
} as const;

export const BACKEND_MESSAGING_METHOD_TREE = {
  providerAccounts: { list: true, create: true },
  senderIdentities: { list: true, create: true },
  templates: {
    list: true,
    create: true,
    versions: { publish: true },
  },
  routeRules: { list: true, create: true },
  sendRequests: { list: true },
  diagnostics: {
    routeSimulation: { create: true },
    testSends: { create: true },
  },
  templateSends: { create: true },
  suppressions: { list: true, create: true },
  rateLimitBuckets: { list: true },
  verificationPolicies: { list: true, update: true },
} as const;

export interface MessagingAppSdkClient {
  readonly auth: ClientFromMethodTree<typeof APP_MESSAGING_METHOD_TREE>;
}

export interface MessagingBackendSdkClient {
  readonly messaging: ClientFromMethodTree<typeof BACKEND_MESSAGING_METHOD_TREE>;
}

export function assertMessagingAppSdkClient(client: unknown): asserts client is MessagingAppSdkClient {
  if (!hasRecord(client, "auth")) {
    throw new Error("Messaging app SDK client must expose auth verification-code methods.");
  }
}

export function assertMessagingBackendSdkClient(client: unknown): asserts client is MessagingBackendSdkClient {
  if (!hasRecord(client, "messaging")) {
    throw new Error("Messaging backend SDK client must expose messaging methods.");
  }
}

function hasRecord(value: unknown, key: string): boolean {
  return Boolean(value && typeof value === "object" && key in value);
}
