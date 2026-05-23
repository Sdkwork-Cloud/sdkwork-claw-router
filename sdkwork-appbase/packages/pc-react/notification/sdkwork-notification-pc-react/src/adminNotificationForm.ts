import type {
  SdkworkAdminNotificationCreateInput,
  SdkworkAdminNotificationStatus,
  SdkworkAdminNotificationUpdateInput,
} from "./adminNotificationService";

export interface SdkworkAdminNotificationFormValues {
  actionUrl: string;
  appId: string;
  content: string;
  expireAt: string;
  messageCode: string;
  priority: string;
  publishedAt: string;
  recipientType: string;
  recipientUserId: string;
  recipientValue: string;
  scope: string;
  severity: string;
  showAsPopup: boolean;
  status: string;
  summary: string;
  title: string;
  type: string;
}

export function createSdkworkAdminNotificationInputFromForm(
  values: SdkworkAdminNotificationFormValues,
): SdkworkAdminNotificationCreateInput {
  const scope = readScope(values.scope);
  return {
    actionUrl: nullableText(values.actionUrl),
    appId: scope === "global" ? null : requiredAppId(values.appId),
    content: values.content.trim(),
    expireAt: nullableText(values.expireAt),
    messageCode: nullableText(values.messageCode),
    priority: readPriority(values.priority),
    publishedAt: nullableText(values.publishedAt),
    recipients: [readRecipient(values)],
    scope,
    severity: readSeverity(values.severity),
    showAsPopup: values.showAsPopup,
    status: readStatus(values.status),
    summary: values.summary.trim(),
    title: values.title.trim(),
    type: readNotificationType(values.type),
  };
}

export function createSdkworkAdminNotificationUpdateInputFromForm(
  values: SdkworkAdminNotificationFormValues,
): SdkworkAdminNotificationUpdateInput {
  const createInput = createSdkworkAdminNotificationInputFromForm(values);
  return {
    ...createInput,
    priority: readPriority(values.priority),
  };
}

export function createSdkworkAdminNotificationStatusInput(
  status: SdkworkAdminNotificationStatus,
): SdkworkAdminNotificationUpdateInput {
  return { status: readStatus(status) };
}

function readRecipient(values: SdkworkAdminNotificationFormValues) {
  const type = values.recipientType.trim().toLowerCase();
  if (type === "all") {
    return { type: "all" as const, value: "all" };
  }
  if (type === "user") {
    const userId = readPositiveInteger(values.recipientUserId, "recipient userId");
    return {
      type: "user" as const,
      userId,
      value: values.recipientValue.trim() || String(userId),
    };
  }
  if (type === "role" || type === "group") {
    const roleCode = values.recipientValue.trim();
    if (!roleCode) {
      throw new Error("recipient role is required");
    }
    return {
      roleCode,
      type: "role" as const,
      value: roleCode,
    };
  }
  throw new Error("recipient type must be one of all, user, role, group");
}

function readScope(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "app" || normalized === "global") {
    return normalized;
  }
  throw new Error("scope must be one of app, global");
}

function readNotificationType(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "info" || normalized === "billing" || normalized === "warning" || normalized === "alert") {
    return normalized;
  }
  throw new Error("type must be one of info, billing, warning, alert");
}

function readSeverity(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "info" || normalized === "billing" || normalized === "warning" || normalized === "alert") {
    return normalized;
  }
  throw new Error("severity must be one of info, billing, warning, alert");
}

function readStatus(value: string): SdkworkAdminNotificationStatus {
  const normalized = value.trim().toLowerCase();
  if (normalized === "published" || normalized === "draft" || normalized === "archived") {
    return normalized;
  }
  throw new Error("status must be one of published, draft, archived");
}

function requiredAppId(value: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error("appId is required for app scoped notifications");
  }
  return normalized;
}

function nullableText(value: string): string | null {
  const normalized = value.trim();
  return normalized || null;
}

function readPriority(value: string): number {
  const normalized = value.trim();
  if (!normalized) {
    return 50;
  }
  if (!/^\d+$/u.test(normalized)) {
    throw new Error("priority must be between 0 and 100");
  }
  const priority = Number(normalized);
  if (!Number.isSafeInteger(priority) || priority < 0 || priority > 100) {
    throw new Error("priority must be between 0 and 100");
  }
  return priority;
}

function readPositiveInteger(value: string, fieldName: string): number {
  const normalized = value.trim();
  if (!/^\d+$/u.test(normalized)) {
    throw new Error(`${fieldName} is required for user target`);
  }
  const numberValue = Number(normalized);
  if (!Number.isSafeInteger(numberValue) || numberValue < 1) {
    throw new Error(`${fieldName} is required for user target`);
  }
  return numberValue;
}
