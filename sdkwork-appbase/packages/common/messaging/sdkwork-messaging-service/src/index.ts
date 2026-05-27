import {
  BACKEND_MESSAGING_METHOD_TREE,
  type MessagingAppSdkClient,
  type MessagingBackendSdkClient,
  type MessagingSdkMethod,
} from "../../sdkwork-messaging-sdk-ports/src/index";

type ServiceMethod = (...args: Parameters<MessagingSdkMethod>) => Promise<unknown>;

type ServiceTemplate = {
  readonly [key: string]: true | ServiceTemplate;
};

type ServiceFromTemplate<TTree extends ServiceTemplate> = {
  readonly [TKey in keyof TTree]: TTree[TKey] extends true
    ? ServiceMethod
    : TTree[TKey] extends ServiceTemplate
      ? ServiceFromTemplate<TTree[TKey]>
      : never;
};

export type SdkworkMessagingAdminService = ServiceFromTemplate<typeof BACKEND_MESSAGING_METHOD_TREE>;

export interface SdkworkMessagingService {
  readonly admin: SdkworkMessagingAdminService;
  readonly verificationCodes: MessagingAppSdkClient["auth"]["verificationCodes"];
}

export interface CreateSdkworkMessagingServiceInput {
  appClient: MessagingAppSdkClient;
  backendClient?: MessagingBackendSdkClient;
}

export function createSdkworkMessagingService(input: CreateSdkworkMessagingServiceInput): SdkworkMessagingService {
  return {
    admin: buildServiceTree<SdkworkMessagingAdminService>(
      BACKEND_MESSAGING_METHOD_TREE,
      input.backendClient?.messaging,
      ["messaging"],
    ),
    verificationCodes: input.appClient.auth.verificationCodes,
  };
}

export function unwrapSdkworkMessagingResponse<T>(value: unknown, fallbackMessage = "Messaging request failed."): T {
  if (!value || typeof value !== "object") {
    return value as T;
  }
  if (!("data" in value) && !("code" in value)) {
    return value as T;
  }
  const envelope = value as { code?: number | string; data?: T; message?: string; msg?: string };
  if (!isSuccessCode(envelope.code)) {
    throw new Error(String(envelope.message || envelope.msg || fallbackMessage).trim());
  }
  return (envelope.data ?? null) as T;
}

function buildServiceTree<T>(template: ServiceTemplate, source: unknown, path: string[]): T {
  const result: Record<string, unknown> = {};
  const sourceRecord = source && typeof source === "object" ? (source as Record<string, unknown>) : {};
  for (const [key, value] of Object.entries(template)) {
    if (value === true) {
      const method = sourceRecord[key];
      result[key] = async (...args: Parameters<MessagingSdkMethod>) => {
        if (typeof method !== "function") {
          throw new Error(`Messaging SDK method is not configured: ${[...path, key].join(".")}`);
        }
        return method(...args);
      };
    } else {
      result[key] = buildServiceTree(value, sourceRecord[key], [...path, key]);
    }
  }
  return result as T;
}

function isSuccessCode(code: number | string | undefined): boolean {
  return code === undefined || code === 0 || code === "0" || code === 200 || code === "200";
}
