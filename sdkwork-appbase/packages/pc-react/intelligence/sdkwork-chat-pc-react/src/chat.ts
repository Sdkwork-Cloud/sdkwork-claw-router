import {
  createSdkworkAppCapabilityManifest,
  getSdkworkMediaDeliveryUrl,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
  type SdkworkMediaResource,
} from "@sdkwork/appbase-pc-react";
import {
  evaluateLlmExecutionReadiness,
  type SdkworkLlmExecutionReadinessIssue,
  type SdkworkLlmExecutionReadinessSummary,
  type SdkworkLlmMessage,
  type SdkworkLlmOutputFormat,
  type SdkworkLlmProviderRoute,
  type SdkworkLlmReasoningEffort,
  type SdkworkLlmStreamSummary,
  type SdkworkLlmTool,
} from "@sdkwork/llm-pc-react";
import type { SdkworkModelCatalogItem } from "@sdkwork/models-pc-react";

export type SdkworkChatAttachmentKind =
  | "audio"
  | "document"
  | "file"
  | "image"
  | "link"
  | "video";
export type SdkworkChatMessageRole = "assistant" | "developer" | "system" | "tool" | "user";
export type SdkworkChatMessageStatus = "completed" | "failed" | "streaming";
export type SdkworkChatComposerSendBlocker =
  | "importing-remote-url"
  | "no-content"
  | "no-model"
  | "pending-send"
  | "recording"
  | "streaming"
  | "uploading-attachments";

export interface SdkworkChatAttachment {
  id: string;
  kind: SdkworkChatAttachmentKind;
  mimeType?: string;
  name: string;
  resource: SdkworkMediaResource;
  sizeBytes?: number;
}

export interface SdkworkChatToolCall {
  argumentsText: string;
  id: string;
  name: string;
}

export interface SdkworkChatMessageError {
  code: string;
  message: string;
}

export interface SdkworkChatMessage {
  attachments: readonly SdkworkChatAttachment[];
  content: string;
  createdAt: number;
  error?: SdkworkChatMessageError;
  id: string;
  modelId?: string;
  reasoningText?: string;
  requestId?: string;
  role: SdkworkChatMessageRole;
  status: SdkworkChatMessageStatus;
  toolCalls: readonly SdkworkChatToolCall[];
  updatedAt: number;
}

export interface SdkworkChatSession {
  createdAt: number;
  id: string;
  lastMessagePreview?: string;
  messages: readonly SdkworkChatMessage[];
  modelId?: string;
  title: string;
  updatedAt: number;
}

export interface CreateChatSessionOptions {
  createdAt?: number;
  id: string;
  modelId?: string;
  title?: string;
}

export interface DeriveChatSessionTitleFromMessageOptions {
  attachments?: readonly SdkworkChatAttachment[];
  fallback?: string;
  maxLength?: number;
  text: string;
}

export interface ResolveInitialChatSessionTitleOptions {
  attachments?: readonly SdkworkChatAttachment[];
  existingTitle?: string;
  isFirstUserMessage: boolean;
  text: string;
}

export interface EvaluateChatComposerSendStateOptions {
  attachmentCount?: number;
  hasActiveModel: boolean;
  hasPendingSendRequest?: boolean;
  isImportingRemoteUrl?: boolean;
  isRecording?: boolean;
  isRecordingFinalizing?: boolean;
  isStreaming?: boolean;
  isUploadingAttachments?: boolean;
  text?: string;
}

export interface SdkworkChatComposerSendState {
  attachmentCount: number;
  blockers: SdkworkChatComposerSendBlocker[];
  canSend: boolean;
  hasContent: boolean;
  textLength: number;
}

export interface CreateOptimisticAssistantChatMessageOptions {
  createdAt?: number;
  id: string;
  modelId?: string;
  requestId?: string;
}

export interface CreateChatLlmMessagesOptions {
  draftAttachments?: readonly SdkworkChatAttachment[];
  draftText?: string;
  includeAssistantReasoning?: boolean;
  messages: readonly Pick<SdkworkChatMessage, "attachments" | "content" | "reasoningText" | "role">[];
  systemPrompt?: string;
}

export type SdkworkChatExecutionIssue = SdkworkChatComposerSendBlocker | SdkworkLlmExecutionReadinessIssue;

export interface EvaluateChatExecutionReadinessOptions
  extends Omit<EvaluateChatComposerSendStateOptions, "attachmentCount" | "hasActiveModel" | "text"> {
  attachments?: readonly SdkworkChatAttachment[];
  draftText?: string;
  hasActiveModel?: boolean;
  maxOutputTokens?: number;
  messages?: readonly Pick<SdkworkChatMessage, "attachments" | "content" | "reasoningText" | "role">[];
  mode?: "stream" | "sync";
  model?: Pick<SdkworkModelCatalogItem, "capabilities" | "contextWindowTokens" | "id" | "providerId">;
  outputFormat?: SdkworkLlmOutputFormat;
  reasoningEffort?: SdkworkLlmReasoningEffort;
  routes: readonly SdkworkLlmProviderRoute[];
  systemPrompt?: string;
  tools?: readonly SdkworkLlmTool[];
}

export interface SdkworkChatExecutionReadinessSummary {
  composer: SdkworkChatComposerSendState;
  degraded: boolean;
  execution?: SdkworkLlmExecutionReadinessSummary;
  issues: SdkworkChatExecutionIssue[];
  ready: boolean;
}

export interface SdkworkChatSessionDigest {
  hasAttachments: boolean;
  id: string;
  messageCount: number;
  modelId?: string;
  preview: string;
  state: SdkworkChatMessageStatus;
  title: string;
  updatedAt: number;
}

export interface SdkworkChatSessionDigestSummary {
  failedSessions: number;
  sessionsWithAttachments: number;
  streamingSessions: number;
  totalMessages: number;
  totalSessions: number;
}

export interface SdkworkChatWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "chat";
  routePath: string;
  sessionRoutePattern: string;
  workspaceRoutePattern: string;
}

export interface CreateChatWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkChatWorkspaceRouteIntent {
  focusWindow: boolean;
  modelId?: string;
  route: string;
  sessionId?: string;
  source: "chat-workspace";
  type: "chat-workspace-route-intent";
}

export interface CreateChatWorkspaceRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  modelId?: string;
  sessionId?: string;
}

export interface SdkworkChatSessionDetailRouteIntent {
  focusWindow: boolean;
  route: string;
  sessionId: string;
  source: "chat-workspace";
  type: "chat-session-detail-route-intent";
}

export interface CreateChatSessionDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

export const DEFAULT_CHAT_SESSION_TITLE = "New Conversation";

const DEFAULT_MAX_PREVIEW_LENGTH = 120;
const DEFAULT_MAX_TITLE_LENGTH = 80;
const GENERIC_CHAT_SESSION_TITLE_PATTERN =
  /^(?:assistant|cli|sdkwork-studio|default|main|sdkwork|sdkwork[-_/ ](?:cli|gateway|studio|tui|web)|studio-web|system|tui)$/i;

function collapseWhitespace(value: string | null | undefined): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function truncate(value: string, maxLength: number): string {
  if (maxLength <= 0 || value.length <= maxLength) {
    return value;
  }

  if (maxLength <= 3) {
    return ".".repeat(maxLength);
  }

  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function cloneAttachments(
  attachments: readonly SdkworkChatAttachment[] | undefined,
): SdkworkChatAttachment[] {
  return attachments?.map((attachment) => ({ ...attachment })) ?? [];
}

function cloneToolCalls(toolCalls: readonly SdkworkChatToolCall[] | undefined): SdkworkChatToolCall[] {
  return toolCalls?.map((toolCall) => ({ ...toolCall })) ?? [];
}

function describeAttachmentNames(
  attachments: readonly SdkworkChatAttachment[] | undefined,
  maxLength = DEFAULT_MAX_TITLE_LENGTH,
): string {
  return normalizeChatSessionTitle(
    (attachments ?? [])
      .map((attachment) => attachment.name.trim())
      .filter(Boolean)
      .join(", "),
    maxLength,
  );
}

function buildChatMessagePreview(
  message: Pick<SdkworkChatMessage, "attachments" | "content">,
  maxLength = DEFAULT_MAX_PREVIEW_LENGTH,
): string {
  const contentPreview = normalizeChatSessionTitle(message.content, maxLength);
  if (contentPreview) {
    return contentPreview;
  }

  return describeAttachmentNames(message.attachments, maxLength);
}

function createLlmPartsFromChatContent(
  content: string,
  attachments: readonly SdkworkChatAttachment[],
): SdkworkLlmMessage["parts"] {
  const parts: SdkworkLlmMessage["parts"][number][] = [];
  const normalizedContent = content.trim();

  if (normalizedContent) {
    parts.push({
      text: normalizedContent,
      type: "text",
    });
  }

  for (const attachment of attachments) {
    const deliveryUrl = getSdkworkMediaDeliveryUrl(attachment.resource);

    if (attachment.kind === "image" && deliveryUrl) {
      parts.push({
        ...(attachment.mimeType ? { mimeType: attachment.mimeType } : {}),
        type: "image",
        url: deliveryUrl,
      });
      continue;
    }

    parts.push({
      fileId: attachment.id,
      ...(attachment.mimeType ? { mimeType: attachment.mimeType } : {}),
      type: "file",
      ...(deliveryUrl ? { url: deliveryUrl } : {}),
    });
  }

  return parts;
}

export function normalizeChatSessionTitle(
  value: string | null | undefined,
  maxLength = DEFAULT_MAX_TITLE_LENGTH,
): string {
  const normalized = collapseWhitespace(value);
  if (!normalized) {
    return "";
  }

  return truncate(normalized, maxLength);
}

export function isOpaqueChatSessionTitle(value: string | null | undefined): boolean {
  const normalized = collapseWhitespace(value);
  if (!normalized) {
    return true;
  }

  return (
    GENERIC_CHAT_SESSION_TITLE_PATTERN.test(normalized) ||
    /^sdkwork-studio:/i.test(normalized) ||
    /^thread:/i.test(normalized) ||
    /^agent:[a-z0-9._-]+:[a-z0-9._-]+$/i.test(normalized) ||
    /^[0-9a-f]{16,}$/i.test(normalized) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalized)
  );
}

export function isReadableChatSessionTitle(value: string | null | undefined): boolean {
  const normalized = collapseWhitespace(value);
  if (!normalized || normalized === DEFAULT_CHAT_SESSION_TITLE) {
    return false;
  }

  return !isOpaqueChatSessionTitle(normalized);
}

export function deriveChatSessionTitleFromMessage(
  options: DeriveChatSessionTitleFromMessageOptions,
): string {
  const textTitle = normalizeChatSessionTitle(options.text, options.maxLength);
  if (textTitle) {
    return textTitle;
  }

  const attachmentTitle = describeAttachmentNames(options.attachments, options.maxLength);
  return attachmentTitle || options.fallback || DEFAULT_CHAT_SESSION_TITLE;
}

export function selectReadableChatSessionTitleCandidates(
  candidates: Array<string | null | undefined>,
  fallback = DEFAULT_CHAT_SESSION_TITLE,
): string {
  for (const candidate of candidates) {
    const normalized = normalizeChatSessionTitle(candidate);
    if (!normalized) {
      continue;
    }

    if (isReadableChatSessionTitle(normalized)) {
      return normalized;
    }
  }

  return fallback;
}

export function resolveInitialChatSessionTitle(
  options: ResolveInitialChatSessionTitleOptions,
): string {
  const normalizedExistingTitle = normalizeChatSessionTitle(options.existingTitle);
  if (!options.isFirstUserMessage) {
    return normalizedExistingTitle || DEFAULT_CHAT_SESSION_TITLE;
  }

  if (isReadableChatSessionTitle(normalizedExistingTitle)) {
    return normalizedExistingTitle;
  }

  return deriveChatSessionTitleFromMessage({
    attachments: options.attachments,
    text: options.text,
  });
}

export function getChatSessionDisplayTitle(
  session: Pick<SdkworkChatSession, "lastMessagePreview" | "messages" | "title">,
): string {
  const explicitTitle = normalizeChatSessionTitle(session.title);
  if (isReadableChatSessionTitle(explicitTitle)) {
    return explicitTitle;
  }

  const firstUserMessage = session.messages.find((message) => message.role === "user");
  if (firstUserMessage) {
    const firstUserTitle = deriveChatSessionTitleFromMessage({
      attachments: firstUserMessage.attachments,
      text: firstUserMessage.content,
    });
    if (firstUserTitle && firstUserTitle !== DEFAULT_CHAT_SESSION_TITLE) {
      return firstUserTitle;
    }
  }

  const previewTitle = normalizeChatSessionTitle(session.lastMessagePreview);
  if (previewTitle) {
    return previewTitle;
  }

  return DEFAULT_CHAT_SESSION_TITLE;
}

export function createChatMessagePreview(
  message: Pick<SdkworkChatMessage, "attachments" | "content">,
  maxLength = DEFAULT_MAX_PREVIEW_LENGTH,
): string {
  return buildChatMessagePreview(message, maxLength);
}

export function composeOutgoingChatMessageText(
  text: string,
  attachments: readonly SdkworkChatAttachment[] = [],
): string {
  const trimmedText = text.trim();
  if (attachments.length === 0) {
    return trimmedText;
  }

  const summary = attachments
    .map((attachment, index) => {
      const label = attachment.name.trim() || `Attachment ${index + 1}`;
      const lines = [`${index + 1}. [${attachment.kind.replace(/-/g, " ")}] ${label}`];

      if (attachment.mimeType?.trim()) {
        lines.push(`MIME: ${attachment.mimeType.trim()}`);
      }

      const deliveryUrl = getSdkworkMediaDeliveryUrl(attachment.resource);
      if (deliveryUrl) {
        lines.push(`URL: ${deliveryUrl}`);
      }

      return lines.join("\n");
    })
    .join("\n");

  const prefix = trimmedText || "The user sent attachments without additional text.";
  return `${prefix}\n\nAttachments:\n${summary}`;
}

export function createChatLlmMessages({
  draftAttachments = [],
  draftText,
  includeAssistantReasoning = false,
  messages,
  systemPrompt,
}: CreateChatLlmMessagesOptions): SdkworkLlmMessage[] {
  const llmMessages: SdkworkLlmMessage[] = [];
  const normalizedSystemPrompt = systemPrompt?.trim();

  if (normalizedSystemPrompt) {
    llmMessages.push({
      parts: [{ text: normalizedSystemPrompt, type: "text" }],
      role: "system",
    });
  }

  for (const message of messages) {
    const parts = [
      ...createLlmPartsFromChatContent(message.content, message.attachments),
      ...(includeAssistantReasoning && message.role === "assistant" && message.reasoningText?.trim()
        ? [{ text: message.reasoningText.trim(), type: "text" as const }]
        : []),
    ];

    if (parts.length === 0) {
      continue;
    }

    llmMessages.push({
      parts,
      role: message.role,
    });
  }

  const draftParts = createLlmPartsFromChatContent(draftText ?? "", draftAttachments);
  if (draftParts.length > 0) {
    llmMessages.push({
      parts: draftParts,
      role: "user",
    });
  }

  return llmMessages;
}

export function evaluateChatComposerSendState(
  options: EvaluateChatComposerSendStateOptions,
): SdkworkChatComposerSendState {
  const attachmentCount = Math.max(options.attachmentCount ?? 0, 0);
  const textLength = options.text?.trim().length ?? 0;
  const hasContent = textLength > 0 || attachmentCount > 0;
  const blockers: SdkworkChatComposerSendBlocker[] = [];

  if (!options.hasActiveModel) {
    blockers.push("no-model");
  }

  if (!hasContent) {
    blockers.push("no-content");
  }

  if (options.isUploadingAttachments) {
    blockers.push("uploading-attachments");
  }

  if (options.hasPendingSendRequest) {
    blockers.push("pending-send");
  }

  if (options.isStreaming) {
    blockers.push("streaming");
  }

  if (options.isImportingRemoteUrl) {
    blockers.push("importing-remote-url");
  }

  if (options.isRecording || options.isRecordingFinalizing) {
    blockers.push("recording");
  }

  return {
    attachmentCount,
    blockers,
    canSend: blockers.length === 0,
    hasContent,
    textLength,
  };
}

export function evaluateChatExecutionReadiness(
  options: EvaluateChatExecutionReadinessOptions,
): SdkworkChatExecutionReadinessSummary {
  const attachments = options.attachments ?? [];
  const hasActiveModel = options.hasActiveModel ?? Boolean(options.model);
  const composer = evaluateChatComposerSendState({
    attachmentCount: attachments.length,
    hasActiveModel,
    hasPendingSendRequest: options.hasPendingSendRequest,
    isImportingRemoteUrl: options.isImportingRemoteUrl,
    isRecording: options.isRecording,
    isRecordingFinalizing: options.isRecordingFinalizing,
    isStreaming: options.isStreaming,
    isUploadingAttachments: options.isUploadingAttachments,
    text: options.draftText,
  });

  if (!composer.canSend || !options.model) {
    return {
      composer,
      degraded: false,
      issues: [...composer.blockers],
      ready: false,
    };
  }

  const execution = evaluateLlmExecutionReadiness(options.routes, {
    maxOutputTokens: options.maxOutputTokens,
    messages: createChatLlmMessages({
      draftAttachments: attachments,
      draftText: options.draftText,
      messages: options.messages ?? [],
      systemPrompt: options.systemPrompt,
    }),
    mode: options.mode,
    model: options.model,
    outputFormat: options.outputFormat,
    reasoningEffort: options.reasoningEffort,
    tools: options.tools,
  });

  return {
    composer,
    degraded: execution.degraded,
    execution,
    issues: Array.from(new Set([...composer.blockers, ...execution.issues])),
    ready: composer.canSend && execution.ready,
  };
}

export function createChatSession({
  createdAt = Date.now(),
  id,
  modelId,
  title,
}: CreateChatSessionOptions): SdkworkChatSession {
  return {
    createdAt,
    id,
    messages: [],
    ...(modelId ? { modelId } : {}),
    title: normalizeChatSessionTitle(title) || DEFAULT_CHAT_SESSION_TITLE,
    updatedAt: createdAt,
  };
}

export function appendChatMessageToSession(
  session: SdkworkChatSession,
  message: SdkworkChatMessage,
): SdkworkChatSession {
  const nextMessage: SdkworkChatMessage = {
    ...message,
    attachments: cloneAttachments(message.attachments),
    toolCalls: cloneToolCalls(message.toolCalls),
  };
  const isFirstUserMessage =
    nextMessage.role === "user" && !session.messages.some((existingMessage) => existingMessage.role === "user");
  const nextTitle = isFirstUserMessage
    ? resolveInitialChatSessionTitle({
        attachments: nextMessage.attachments,
        existingTitle: session.title,
        isFirstUserMessage: true,
        text: nextMessage.content,
      })
    : session.title;
  const preview = createChatMessagePreview(nextMessage);

  return {
    ...session,
    ...(preview ? { lastMessagePreview: preview } : {}),
    messages: [...session.messages, nextMessage],
    title: nextTitle,
    updatedAt: nextMessage.updatedAt,
  };
}

export function createOptimisticAssistantChatMessage({
  createdAt = Date.now(),
  id,
  modelId,
  requestId,
}: CreateOptimisticAssistantChatMessageOptions): SdkworkChatMessage {
  return {
    attachments: [],
    content: "",
    createdAt,
    id,
    ...(modelId ? { modelId } : {}),
    ...(requestId ? { requestId } : {}),
    role: "assistant",
    status: "streaming",
    toolCalls: [],
    updatedAt: createdAt,
  };
}

export function createChatSessionDigest(
  session: Pick<SdkworkChatSession, "id" | "lastMessagePreview" | "messages" | "modelId" | "title" | "updatedAt">,
): SdkworkChatSessionDigest {
  const lastMessage = session.messages[session.messages.length - 1];

  return {
    hasAttachments: session.messages.some((message) => message.attachments.length > 0),
    id: session.id,
    messageCount: session.messages.length,
    ...(session.modelId ? { modelId: session.modelId } : {}),
    preview:
      normalizeChatSessionTitle(session.lastMessagePreview, DEFAULT_MAX_PREVIEW_LENGTH) ||
      (lastMessage ? createChatMessagePreview(lastMessage) : ""),
    state: lastMessage?.status ?? "completed",
    title: getChatSessionDisplayTitle({
      lastMessagePreview: session.lastMessagePreview,
      messages: session.messages,
      title: session.title,
    }),
    updatedAt: session.updatedAt,
  };
}

export function summarizeChatSessionDigests(
  digests: readonly SdkworkChatSessionDigest[],
): SdkworkChatSessionDigestSummary {
  return {
    failedSessions: digests.filter((digest) => digest.state === "failed").length,
    sessionsWithAttachments: digests.filter((digest) => digest.hasAttachments).length,
    streamingSessions: digests.filter((digest) => digest.state === "streaming").length,
    totalMessages: digests.reduce((total, digest) => total + digest.messageCount, 0),
    totalSessions: digests.length,
  };
}

export function applyLlmSummaryToAssistantChatMessage(
  message: SdkworkChatMessage,
  summary: SdkworkLlmStreamSummary,
): SdkworkChatMessage {
  if (message.role !== "assistant") {
    throw new Error("Only assistant messages can be finalized from LLM stream summaries.");
  }

  return {
    attachments: cloneAttachments(message.attachments),
    content: summary.outputText,
    createdAt: message.createdAt,
    ...(summary.status === "failed" && summary.error ? { error: { ...summary.error } } : {}),
    id: message.id,
    ...(message.modelId ? { modelId: message.modelId } : {}),
    ...(summary.reasoningText ? { reasoningText: summary.reasoningText } : {}),
    ...(summary.requestId ?? message.requestId ? { requestId: summary.requestId ?? message.requestId } : {}),
    role: "assistant",
    status: summary.status === "completed" ? "completed" : "failed",
    toolCalls: summary.toolCalls.map((toolCall) => ({ ...toolCall })),
    updatedAt: summary.completedAt ?? message.updatedAt,
  };
}

export function createChatWorkspaceManifest({
  description = "Chat workspace for sessions, attachment-aware composition, and assistant execution state.",
  host,
  id = "sdkwork-chat",
  packageNames = ["@sdkwork/chat-pc-react", "@sdkwork/llm-pc-react", "@sdkwork/models-pc-react"],
  routePath = "/chat",
  theme,
  title = "Chat",
}: CreateChatWorkspaceManifestOptions = {}): SdkworkChatWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "chat",
    routePath,
    sessionRoutePattern: `${routePath}/sessions/:sessionId`,
    workspaceRoutePattern: routePath,
  };
}

export function createChatWorkspaceRouteIntent(
  options: CreateChatWorkspaceRouteIntentOptions = {},
): SdkworkChatWorkspaceRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.modelId) {
    queryParams.set("model", options.modelId);
  }

  if (options.sessionId) {
    queryParams.set("session", options.sessionId);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.modelId ? { modelId: options.modelId } : {}),
    route: `${options.basePath ?? "/chat"}${querySuffix}`,
    ...(options.sessionId ? { sessionId: options.sessionId } : {}),
    source: "chat-workspace",
    type: "chat-workspace-route-intent",
  };
}

export function createChatSessionDetailRouteIntent(
  sessionId: string,
  options: CreateChatSessionDetailRouteIntentOptions = {},
): SdkworkChatSessionDetailRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/chat"}/sessions/${sessionId}`,
    sessionId,
    source: "chat-workspace",
    type: "chat-session-detail-route-intent",
  };
}

export const chatPackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/chat-pc-react",
  status: "ready",
} as const;

export type ChatPackageMeta = typeof chatPackageMeta;
