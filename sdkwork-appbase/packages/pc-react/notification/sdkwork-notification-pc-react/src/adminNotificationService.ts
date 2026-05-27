export type SdkworkAdminNotificationScope = "app" | "global";
export type SdkworkAdminNotificationType = "alert" | "billing" | "info" | "warning";
export type SdkworkAdminNotificationSeverity = "alert" | "billing" | "info" | "warning";
export type SdkworkAdminNotificationStatus = "archived" | "draft" | "published";
export type SdkworkAdminNotificationRecipientType = "all" | "role" | "user";
export type SdkworkAdminNotificationRecipientInputType =
  | SdkworkAdminNotificationRecipientType
  | "group";

export interface SdkworkAdminNotificationRecipient {
  roleCode: string | null;
  type: SdkworkAdminNotificationRecipientType;
  userId: number | null;
  value: string;
}

export interface SdkworkAdminNotificationRecipientInput {
  roleCode?: string;
  type: SdkworkAdminNotificationRecipientInputType;
  userId?: number;
  value?: string;
}

export interface SdkworkAdminNotification {
  actionUrl: string | null;
  appId: string | null;
  content: string;
  createdAt: string;
  expireAt: string | null;
  id: string;
  messageCode: string | null;
  priority: number;
  publishedAt: string | null;
  recipients: SdkworkAdminNotificationRecipient[];
  scope: SdkworkAdminNotificationScope;
  severity: SdkworkAdminNotificationSeverity;
  showAsPopup: boolean;
  status: SdkworkAdminNotificationStatus;
  summary: string;
  title: string;
  type: SdkworkAdminNotificationType;
  updatedAt: string;
}

export interface SdkworkAdminNotificationList {
  items: SdkworkAdminNotification[];
  page: number | null;
  pageSize: number | null;
  total: number;
}

export interface SdkworkAdminNotificationListOptions {
  appId?: string;
  includeArchived?: boolean;
  includeGlobal?: boolean;
  page?: number;
  pageSize?: number;
}

export interface SdkworkAdminNotificationCreateInput {
  actionUrl?: string | null;
  appId?: string | null;
  content: string;
  expireAt?: string | null;
  messageCode?: string | null;
  priority?: number;
  publishedAt?: string | null;
  recipients: SdkworkAdminNotificationRecipientInput[];
  scope: SdkworkAdminNotificationScope;
  severity: SdkworkAdminNotificationSeverity;
  showAsPopup?: boolean;
  status?: SdkworkAdminNotificationStatus;
  summary: string;
  title: string;
  type: SdkworkAdminNotificationType;
}

export interface SdkworkAdminNotificationUpdateInput {
  actionUrl?: string | null;
  appId?: string | null;
  content?: string;
  expireAt?: string | null;
  messageCode?: string | null;
  priority?: number;
  publishedAt?: string | null;
  recipients?: SdkworkAdminNotificationRecipientInput[];
  scope?: SdkworkAdminNotificationScope;
  severity?: SdkworkAdminNotificationSeverity;
  showAsPopup?: boolean;
  status?: SdkworkAdminNotificationStatus;
  summary?: string;
  title?: string;
  type?: SdkworkAdminNotificationType;
}

export interface SdkworkAdminNotificationGeneratedClient {
  notification: {
    createNotification(
      body: SdkworkAdminNotificationCreateRequest,
    ): Promise<unknown>;
    deleteNotifications(notificationId: string): Promise<unknown>;
    listNotifications(params?: SdkworkAdminNotificationListOptions): Promise<unknown>;
    updateNotifications(
      notificationId: string,
      body: SdkworkAdminNotificationUpdateRequest,
    ): Promise<unknown>;
  };
}

export type SdkworkAdminNotificationCreateRequest = Record<string, unknown>;
export type SdkworkAdminNotificationUpdateRequest = Record<string, unknown>;

export interface SdkworkAdminNotificationService {
  addNotification(input: SdkworkAdminNotificationCreateInput): Promise<SdkworkAdminNotification>;
  deleteNotification(notificationId: string): Promise<boolean>;
  fetchNotifications(options?: SdkworkAdminNotificationListOptions): Promise<SdkworkAdminNotificationList>;
  updateNotification(
    notificationId: string,
    input: SdkworkAdminNotificationUpdateInput,
  ): Promise<SdkworkAdminNotification>;
}

export interface CreateSdkworkAdminNotificationServiceOptions {
  client: SdkworkAdminNotificationGeneratedClient;
}

type ApiRecord = Record<string, unknown>;

const SAFE_PATH_SEGMENT_PATTERN = /^[A-Za-z0-9._~-]{1,128}$/u;
const SUCCESS_CODES = new Set<unknown>([0, 200, 2000, "0", "200", "2000"]);
const NOTIFICATION_ENUMS = {
  scope: ["app", "global"],
  status: ["archived", "draft", "published"],
  targetType: ["all", "role", "user"],
  type: ["alert", "billing", "info", "warning"],
} as const;

export function createSdkworkAdminNotificationService({
  client,
}: CreateSdkworkAdminNotificationServiceOptions): SdkworkAdminNotificationService {
  return {
    async fetchNotifications(options = {}) {
      const result = await client.notification.listNotifications(toListParams(options));
      ensureSdkworkAdminNotificationSuccess(result, "Failed to fetch notifications");
      return readNotificationList(result);
    },
    async addNotification(input) {
      const result = await client.notification.createNotification(
        toCreateNotificationRequest(input),
      );
      ensureSdkworkAdminNotificationSuccess(result, "Failed to add notification");
      return readNotificationItemFromMutation(result, "Created notification response is missing data");
    },
    async updateNotification(notificationId, input) {
      const result = await client.notification.updateNotifications(
        requiredSafePathSegment(notificationId, "notificationId"),
        toUpdateNotificationRequest(input),
      );
      ensureSdkworkAdminNotificationSuccess(result, "Failed to update notification");
      return readNotificationItemFromMutation(result, "Updated notification response is missing data");
    },
    async deleteNotification(notificationId) {
      const result = await client.notification.deleteNotifications(
        requiredSafePathSegment(notificationId, "notificationId"),
      );
      ensureSdkworkAdminNotificationSuccess(result, "Failed to delete notification");
      if (readBoolean(readApiRecord(result), "deleted") !== true) {
        throw new Error("Notification delete confirmation is required");
      }
      return true;
    },
  };
}

function toListParams(options: SdkworkAdminNotificationListOptions): SdkworkAdminNotificationListOptions {
  return pruneUndefined({
    appId: optionalTrimmedText(options.appId),
    includeArchived: options.includeArchived,
    includeGlobal: options.includeGlobal,
    page: optionalPositiveInteger(options.page, "page"),
    pageSize: optionalPositiveInteger(options.pageSize, "pageSize"),
  });
}

export function toCreateNotificationRequest(
  input: SdkworkAdminNotificationCreateInput,
): SdkworkAdminNotificationCreateRequest {
  const request: SdkworkAdminNotificationCreateRequest = {
    content: requiredText(input.content, "content"),
    priority: normalizePriority(input.priority ?? 50),
    recipients: normalizeRecipientInputs(input.recipients),
    scope: normalizeScope(input.scope),
    severity: normalizeSeverity(input.severity),
    showAsPopup: input.showAsPopup ?? false,
    summary: requiredText(input.summary, "summary"),
    title: requiredText(input.title, "title"),
    type: normalizeNotificationType(input.type),
  };
  assignNullableText(request, "actionUrl", input.actionUrl);
  assignNullableText(request, "appId", normalizeAppIdForScope(input.scope, input.appId));
  assignNullableText(request, "expireAt", input.expireAt);
  assignNullableText(request, "messageCode", input.messageCode);
  assignNullableText(request, "publishedAt", input.publishedAt);
  if (input.status !== undefined) {
    request.status = normalizeStatus(input.status);
  }
  return request;
}

export function toUpdateNotificationRequest(
  input: SdkworkAdminNotificationUpdateInput,
): SdkworkAdminNotificationUpdateRequest {
  const request: SdkworkAdminNotificationUpdateRequest = {};
  if (hasOwn(input, "actionUrl")) assignNullableText(request, "actionUrl", input.actionUrl);
  if (hasOwn(input, "content")) request.content = requiredText(input.content, "content");
  if (hasOwn(input, "expireAt")) assignNullableText(request, "expireAt", input.expireAt);
  if (hasOwn(input, "messageCode")) assignNullableText(request, "messageCode", input.messageCode);
  if (hasOwn(input, "priority")) request.priority = normalizePriority(input.priority);
  if (hasOwn(input, "publishedAt")) assignNullableText(request, "publishedAt", input.publishedAt);
  if (hasOwn(input, "recipients")) request.recipients = normalizeRecipientInputs(input.recipients);
  if (hasOwn(input, "scope")) request.scope = normalizeScope(input.scope);
  if (hasOwn(input, "severity")) request.severity = normalizeSeverity(input.severity);
  if (hasOwn(input, "showAsPopup")) request.showAsPopup = input.showAsPopup === true;
  if (hasOwn(input, "status")) request.status = normalizeStatus(input.status);
  if (hasOwn(input, "summary")) request.summary = requiredText(input.summary, "summary");
  if (hasOwn(input, "title")) request.title = requiredText(input.title, "title");
  if (hasOwn(input, "type")) request.type = normalizeNotificationType(input.type);
  if (hasOwn(input, "appId")) {
    assignNullableText(
      request,
      "appId",
      hasOwn(input, "scope") && input.scope === "global"
        ? null
        : input.appId,
    );
  }
  if (Object.keys(request).length === 0) {
    throw new Error("notification update must include at least one editable field");
  }
  return request;
}

function readNotificationList(result: unknown): SdkworkAdminNotificationList {
  const data = readApiData(result);
  const dataRecord = asRecord(data);
  const rawItems = Array.isArray(dataRecord?.items)
    ? dataRecord.items
    : Array.isArray(data)
      ? data
      : undefined;
  if (!rawItems) {
    throw new Error("Notification list response missing items");
  }
  const items = rawItems.map(readNotificationItem);
  return {
    items,
    page: readNullableNumber(dataRecord, "page"),
    pageSize: readNullableNumber(dataRecord, "pageSize"),
    total: readNumber(dataRecord, "total", items.length),
  };
}

function readNotificationItemFromMutation(result: unknown, message: string): SdkworkAdminNotification {
  const record = readApiRecord(result);
  const item = asRecord(record.item) ?? asRecord(record.record) ?? record;
  if (isNonEntityMutationRecord(item)) {
    throw new Error(message);
  }
  return readNotificationItem(item);
}

function readNotificationItem(value: unknown): SdkworkAdminNotification {
  const item = requiredRecord(value, "Notification record is required");
  const title = readRequiredString(item, "title", "Notification title is required");
  return {
    actionUrl: readNullableString(item, "actionUrl"),
    appId: readNullableString(item, "appId"),
    content: readRequiredString(item, "content", "Notification content is required"),
    createdAt: readRequiredString(item, "createdAt", "Notification createdAt is required"),
    expireAt: readNullableString(item, "expireAt"),
    id: readRequiredString(item, "id", "Notification id is required"),
    messageCode: readNullableString(item, "messageCode"),
    priority: readNumber(item, "priority", 50),
    publishedAt: readNullableString(item, "publishedAt"),
    recipients: readNotificationRecipients(item),
    scope: readScope(item.scope),
    severity: readSeverity(item.severity),
    showAsPopup: readBoolean(item, "showAsPopup"),
    status: readStatus(item.status),
    summary: readRequiredString(item, "summary", "Notification summary is required"),
    title,
    type: readNotificationType(item.type),
    updatedAt: readRequiredString(item, "updatedAt", "Notification updatedAt is required"),
  };
}

function readNotificationRecipients(item: ApiRecord): SdkworkAdminNotificationRecipient[] {
  const value = item.recipients;
  if (!Array.isArray(value)) {
    throw new Error("Notification recipients are required");
  }
  return value.map((recipient) => {
    const record = requiredRecord(recipient, "Notification recipient record is required");
    return {
      roleCode: readNullableString(record, "roleCode"),
      type: readRecipientType(record.type),
      userId: readNullableNumber(record, "userId"),
      value: readRequiredString(record, "value", "Notification recipient value is required"),
    };
  });
}

function normalizeRecipientInputs(
  recipients: SdkworkAdminNotificationRecipientInput[] | undefined,
): SdkworkAdminNotificationCreateRequest[] {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    throw new Error("recipients are required");
  }
  return recipients.map((recipient) => {
    const type = normalizeRecipientInputType(recipient.type);
    if (type === "all") {
      return { type: "all", value: "all" };
    }
    if (type === "user") {
      const userId = optionalPositiveInteger(recipient.userId, "recipient userId");
      if (userId === undefined) {
        throw new Error("recipient userId is required for user target");
      }
      return {
        type: "user",
        userId,
        value: optionalTrimmedText(recipient.value) ?? String(userId),
      };
    }
    const roleCode = optionalTrimmedText(recipient.roleCode) ?? optionalTrimmedText(recipient.value);
    if (!roleCode) {
      throw new Error("recipient role is required");
    }
    return {
      roleCode,
      type: "role",
      value: roleCode,
    };
  });
}

function normalizeAppIdForScope(
  scope: SdkworkAdminNotificationScope,
  appId: string | null | undefined,
): string | null {
  if (scope === "global") {
    return null;
  }
  const normalized = optionalTrimmedText(appId);
  if (!normalized) {
    throw new Error("appId is required for app scoped notifications");
  }
  return normalized;
}

function normalizePriority(value: unknown): number {
  const priority = optionalInteger(value, "priority") ?? 50;
  if (priority < 0 || priority > 100) {
    throw new Error("priority must be between 0 and 100");
  }
  return priority;
}

function normalizeScope(value: unknown): SdkworkAdminNotificationScope {
  const normalized = requiredText(value, "scope").toLowerCase();
  if (normalized === "app" || normalized === "global") {
    return normalized;
  }
  throw new Error("scope must be one of app, global");
}

function normalizeNotificationType(value: unknown): SdkworkAdminNotificationType {
  const normalized = requiredText(value, "type").toLowerCase();
  if (isEnumValue(NOTIFICATION_ENUMS.type, normalized)) {
    return normalized;
  }
  throw new Error("type must be one of info, billing, warning, alert");
}

function normalizeSeverity(value: unknown): SdkworkAdminNotificationSeverity {
  const normalized = requiredText(value, "severity").toLowerCase();
  if (isEnumValue(NOTIFICATION_ENUMS.type, normalized)) {
    return normalized;
  }
  throw new Error("severity must be one of info, billing, warning, alert");
}

function normalizeStatus(value: unknown): SdkworkAdminNotificationStatus {
  const normalized = requiredText(value, "status").toLowerCase();
  if (isEnumValue(NOTIFICATION_ENUMS.status, normalized)) {
    return normalized;
  }
  throw new Error("status must be one of published, draft, archived");
}

function normalizeRecipientInputType(value: unknown): SdkworkAdminNotificationRecipientType {
  const normalized = requiredText(value, "recipient type").toLowerCase();
  if (normalized === "group" || normalized === "role") {
    return "role";
  }
  if (normalized === "all" || normalized === "user") {
    return normalized;
  }
  throw new Error("recipient type must be one of all, user, role, group");
}

function readScope(value: unknown): SdkworkAdminNotificationScope {
  if (value === "app" || value === "global") {
    return value;
  }
  throw new Error(value ? `Unsupported notification scope: ${String(value)}` : "Notification scope is required");
}

function readNotificationType(value: unknown): SdkworkAdminNotificationType {
  if (isEnumValue(NOTIFICATION_ENUMS.type, value)) {
    return value;
  }
  throw new Error(value ? `Unsupported notification type: ${String(value)}` : "Notification type is required");
}

function readSeverity(value: unknown): SdkworkAdminNotificationSeverity {
  if (isEnumValue(NOTIFICATION_ENUMS.type, value)) {
    return value;
  }
  throw new Error(value ? `Unsupported notification severity: ${String(value)}` : "Notification severity is required");
}

function readStatus(value: unknown): SdkworkAdminNotificationStatus {
  if (isEnumValue(NOTIFICATION_ENUMS.status, value)) {
    return value;
  }
  throw new Error(value ? `Unsupported notification status: ${String(value)}` : "Notification status is required");
}

function readRecipientType(value: unknown): SdkworkAdminNotificationRecipientType {
  if (value === "group" || value === "role") {
    return "role";
  }
  if (isEnumValue(NOTIFICATION_ENUMS.targetType, value)) {
    return value;
  }
  throw new Error(value ? `Unsupported notification recipient type: ${String(value)}` : "Notification recipient type is required");
}

function ensureSdkworkAdminNotificationSuccess(result: unknown, message: string): void {
  const record = asRecord(result);
  if (!record) {
    throw new Error(message);
  }
  const code = record.code;
  if (code === undefined || SUCCESS_CODES.has(code)) {
    return;
  }
  throw new Error(readString(record, "msg") || readString(record, "message") || `${message}: ${String(code)}`);
}

function readApiData(result: unknown): unknown {
  const record = asRecord(result);
  if (!record) {
    return undefined;
  }
  return isApiEnvelope(record) ? record.data : record;
}

function readApiRecord(result: unknown): ApiRecord {
  return requiredRecord(readApiData(result), "Notification response data is required");
}

function isApiEnvelope(record: ApiRecord): boolean {
  return "code" in record && ("data" in record || "msg" in record || "message" in record);
}

function isNonEntityMutationRecord(record: ApiRecord): boolean {
  const keys = Object.keys(record);
  return keys.length === 0 || keys.every((key) => ["created", "deleted", "ok", "success", "updated"].includes(key));
}

function requiredRecord(value: unknown, message: string): ApiRecord {
  const record = asRecord(value);
  if (!record) {
    throw new Error(message);
  }
  return record;
}

function asRecord(value: unknown): ApiRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as ApiRecord
    : null;
}

function readRequiredString(record: ApiRecord, key: string, message: string): string {
  const value = readString(record, key).trim();
  if (!value) {
    throw new Error(message);
  }
  return value;
}

function readString(record: ApiRecord, key: string, fallback = ""): string {
  const value = record[key];
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function readNullableString(record: ApiRecord, key: string): string | null {
  const value = record[key];
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return null;
}

function readBoolean(record: ApiRecord, key: string, fallback = false): boolean {
  const value = record[key];
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return fallback;
}

function readNumber(record: ApiRecord | null, key: string, fallback: number): number {
  if (!record) {
    return fallback;
  }
  const value = record[key];
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function readNullableNumber(record: ApiRecord | null, key: string): number | null {
  if (!record) {
    return null;
  }
  const value = record[key];
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function requiredText(value: unknown, fieldName: string): string {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} is required`);
  }
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalTrimmedText(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  return normalized || undefined;
}

function assignNullableText(target: ApiRecord, key: string, value: unknown): void {
  if (value === undefined) {
    return;
  }
  if (value === null) {
    target[key] = null;
    return;
  }
  target[key] = optionalTrimmedText(value) ?? null;
}

function optionalPositiveInteger(value: unknown, fieldName: string): number | undefined {
  const normalized = optionalInteger(value, fieldName);
  if (normalized === undefined) {
    return undefined;
  }
  if (normalized < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return normalized;
}

function optionalInteger(value: unknown, fieldName: string): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const text = typeof value === "number" ? String(value) : typeof value === "string" ? value.trim() : "";
  if (!/^-?\d+$/u.test(text)) {
    throw new Error(`${fieldName} must be an integer`);
  }
  const parsed = Number(text);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${fieldName} must be an integer`);
  }
  return parsed;
}

function requiredSafePathSegment(value: string, fieldName: string): string {
  if (!value) {
    throw new Error(`${fieldName} is required`);
  }
  if (!SAFE_PATH_SEGMENT_PATTERN.test(value)) {
    throw new Error(`${fieldName} must be a safe path segment`);
  }
  return value;
}

function pruneUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  ) as T;
}

function hasOwn<T extends object, K extends PropertyKey>(value: T, key: K): value is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isEnumValue<T extends readonly string[]>(values: T, value: unknown): value is T[number] {
  return typeof value === "string" && values.includes(value);
}
