import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
  type SdkworkMediaResource,
} from "@sdkwork/appbase-pc-react";
import type { SdkworkImConversation, SdkworkImParticipant } from "@sdkwork/im-pc-react";

export type SdkworkContactPresence = "away" | "busy" | "offline" | "online";
export type SdkworkContactRelationship =
  | "blocked"
  | "connected"
  | "invite-pending"
  | "request-received"
  | "stranger";
export type SdkworkContactScope = "external" | "group" | "personal" | "workspace";

export interface SdkworkContactRecord {
  avatar?: SdkworkMediaResource;
  displayName: string;
  email?: string;
  headline?: string;
  id: string;
  initials?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
  lastInteractionAt?: Date | number | string | null;
  phone?: string;
  presence?: SdkworkContactPresence;
  relationship: SdkworkContactRelationship;
  remark?: string;
  scope: SdkworkContactScope;
  tags?: readonly string[];
}

export interface FilterContactsOptions {
  favoritesOnly?: boolean;
  includeBlocked?: boolean;
  onlineOnly?: boolean;
  query?: string;
  relationships?: readonly SdkworkContactRelationship[];
  scopes?: readonly SdkworkContactScope[];
}

export interface SdkworkContactInitialGroup {
  contacts: SdkworkContactRecord[];
  initial: string;
}

export interface SummarizeContactsDirectoryOptions {
  pendingInvites?: number;
}

export interface SdkworkContactsDirectorySummary {
  externalContacts: number;
  favoriteContacts: number;
  onlineContacts: number;
  pendingInvites: number;
  totalContacts: number;
}

export interface ToggleContactSelectionOptions {
  maxSelected?: number;
  mode?: "multiple" | "single";
}

export interface SdkworkContactSelectionResult {
  reason?: "limit-reached";
  selectedIds: string[];
}

export interface ResolveContactQuickActionsOptions {
  allowExternalMessaging?: boolean;
  supportsAudioCall?: boolean;
  supportsVideoCall?: boolean;
}

export interface SdkworkContactQuickActions {
  canAudioCall: boolean;
  canInviteToChannel: boolean;
  canMessage: boolean;
  canVideoCall: boolean;
  reason?: "blocked" | "external-restricted" | "pending-relationship";
}

export type SdkworkContactDigestStatus = "attention" | "available" | "blocked" | "connected" | "external" | "pending";

export interface CreateContactDigestOptions {
  activeContactId?: string;
}

export interface SdkworkContactDigest {
  avatar?: SdkworkMediaResource;
  digestStatus: SdkworkContactDigestStatus;
  displayName: string;
  headline?: string;
  id: string;
  initials?: string;
  isActive: boolean;
  isExternal: boolean;
  isFavorite: boolean;
  isPinned: boolean;
  lastInteractionAt?: Date | number | string | null;
  presence?: SdkworkContactPresence;
  relationship: SdkworkContactRelationship;
  remark?: string;
  scope: SdkworkContactScope;
}

export interface SdkworkContactDigestSummary {
  attentionContacts: number;
  availableContacts: number;
  blockedContacts: number;
  externalContacts: number;
  favoriteContacts: number;
  onlineContacts: number;
  pendingContacts: number;
  pinnedContacts: number;
  totalContacts: number;
}

export type SdkworkContactCollaborationAction = "audio-call" | "channel-invite" | "message" | "video-call";
export type SdkworkContactCollaborationIssue =
  | "audio-call-disabled"
  | "blocked"
  | "external-restricted"
  | "missing-channel-target"
  | "offline-contact"
  | "pending-relationship"
  | "video-call-disabled";

export interface EvaluateContactCollaborationReadinessOptions extends ResolveContactQuickActionsOptions {
  action?: SdkworkContactCollaborationAction;
  channelId?: string;
}

export interface SdkworkContactCollaborationReadiness {
  capabilities: SdkworkContactQuickActions;
  degraded: boolean;
  issues: SdkworkContactCollaborationIssue[];
  ready: boolean;
}

export interface SdkworkContactDirectConversationSeed {
  conversation: Pick<SdkworkImConversation, "id" | "kind" | "participants" | "title">;
  participant: SdkworkImParticipant;
  route: string;
}

export interface CreateDirectConversationSeedOptions {
  conversationId?: string;
  routeBasePath?: string;
}

export interface SdkworkContactsWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "contacts";
  pickerRoutePath: string;
  profileRoutePattern: string;
  routePath: string;
}

export interface CreateContactsWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  pickerRoutePath?: string;
  routePath?: string;
}

export interface SdkworkContactProfileIntent {
  contactId: string;
  focusWindow: boolean;
  route: string;
  source: "profile-link";
  type: "contact-profile-intent";
}

export interface CreateContactProfileIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

function toTimestamp(value: Date | number | string | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function presenceWeight(presence: SdkworkContactPresence | undefined): number {
  if (presence === "online") {
    return 0;
  }

  if (presence === "busy") {
    return 1;
  }

  if (presence === "away") {
    return 2;
  }

  return 3;
}

function normalizeInitial(contact: SdkworkContactRecord): string {
  const source = contact.initials?.trim() || contact.displayName.trim().charAt(0);
  const normalized = source.toUpperCase();
  return /^[A-Z]$/.test(normalized) ? normalized : "#";
}

function includesNormalized(value: string | undefined, query: string): boolean {
  return Boolean(value?.toLowerCase().includes(query));
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function resolveContactDigestStatus(
  contact: SdkworkContactRecord,
): SdkworkContactDigestStatus {
  if (contact.relationship === "blocked") {
    return "blocked";
  }

  if (contact.relationship === "request-received") {
    return "attention";
  }

  if (contact.relationship === "invite-pending" || contact.relationship === "stranger") {
    return "pending";
  }

  if (contact.scope === "external") {
    return "external";
  }

  if (contact.presence === "online") {
    return "available";
  }

  return "connected";
}

function toUniqueContactCollaborationIssues(
  issues: readonly SdkworkContactCollaborationIssue[],
): SdkworkContactCollaborationIssue[] {
  return Array.from(new Set(issues));
}

export function sortContacts(
  contacts: readonly SdkworkContactRecord[],
): SdkworkContactRecord[] {
  return [...contacts].sort((left, right) => {
    if (Boolean(left.isPinned) !== Boolean(right.isPinned)) {
      return Number(Boolean(right.isPinned)) - Number(Boolean(left.isPinned));
    }

    if (Boolean(left.isFavorite) !== Boolean(right.isFavorite)) {
      return Number(Boolean(right.isFavorite)) - Number(Boolean(left.isFavorite));
    }

    const presenceDifference = presenceWeight(left.presence) - presenceWeight(right.presence);
    if (presenceDifference !== 0) {
      return presenceDifference;
    }

    const interactionDifference = toTimestamp(right.lastInteractionAt) - toTimestamp(left.lastInteractionAt);
    if (interactionDifference !== 0) {
      return interactionDifference;
    }

    return left.displayName.localeCompare(right.displayName);
  });
}

export function filterContacts(
  contacts: readonly SdkworkContactRecord[],
  options: FilterContactsOptions = {},
): SdkworkContactRecord[] {
  const query = normalizeQuery(options.query);
  const relationships = options.relationships ? new Set(options.relationships) : null;
  const scopes = options.scopes ? new Set(options.scopes) : null;

  return sortContacts(contacts).filter((contact) => {
    if (!options.includeBlocked && contact.relationship === "blocked") {
      return false;
    }

    if (options.favoritesOnly && !contact.isFavorite) {
      return false;
    }

    if (options.onlineOnly && contact.presence !== "online") {
      return false;
    }

    if (relationships && !relationships.has(contact.relationship)) {
      return false;
    }

    if (scopes && !scopes.has(contact.scope)) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      includesNormalized(contact.displayName, query) ||
      includesNormalized(contact.remark, query) ||
      includesNormalized(contact.headline, query) ||
      includesNormalized(contact.email, query) ||
      Boolean(contact.tags?.some((tag) => tag.toLowerCase().includes(query)))
    );
  });
}

export function groupContactsByInitial(
  contacts: readonly SdkworkContactRecord[],
): SdkworkContactInitialGroup[] {
  const grouped = new Map<string, SdkworkContactRecord[]>();

  for (const contact of sortContacts(contacts)) {
    const initial = normalizeInitial(contact);
    const items = grouped.get(initial) ?? [];
    items.push(contact);
    grouped.set(initial, items);
  }

  return Array.from(grouped.entries())
    .map(([initial, items]) => ({
      contacts: items,
      initial,
    }))
    .sort((left, right) => {
      if (left.initial === "#") {
        return 1;
      }

      if (right.initial === "#") {
        return -1;
      }

      return left.initial.localeCompare(right.initial);
    });
}

export function summarizeContactsDirectory(
  contacts: readonly SdkworkContactRecord[],
  options: SummarizeContactsDirectoryOptions = {},
): SdkworkContactsDirectorySummary {
  return {
    externalContacts: contacts.filter((contact) => contact.scope === "external").length,
    favoriteContacts: contacts.filter((contact) => contact.isFavorite).length,
    onlineContacts: contacts.filter((contact) => contact.presence === "online").length,
    pendingInvites: options.pendingInvites ?? 0,
    totalContacts: contacts.length,
  };
}

export function toggleContactSelection(
  selectedIds: readonly string[],
  contactId: string,
  options: ToggleContactSelectionOptions = {},
): SdkworkContactSelectionResult {
  const uniqueSelectedIds = Array.from(new Set(selectedIds));
  const isSelected = uniqueSelectedIds.includes(contactId);

  if (options.mode === "single") {
    return {
      reason: undefined,
      selectedIds: isSelected ? [] : [contactId],
    };
  }

  if (isSelected) {
    return {
      reason: undefined,
      selectedIds: uniqueSelectedIds.filter((id) => id !== contactId),
    };
  }

  if (options.maxSelected && uniqueSelectedIds.length >= options.maxSelected) {
    return {
      reason: "limit-reached",
      selectedIds: uniqueSelectedIds,
    };
  }

  return {
    reason: undefined,
    selectedIds: [
      ...uniqueSelectedIds,
      contactId,
    ],
  };
}

export function resolveContactQuickActions(
  contact: SdkworkContactRecord,
  options: ResolveContactQuickActionsOptions = {},
): SdkworkContactQuickActions {
  if (contact.relationship === "blocked") {
    return {
      canAudioCall: false,
      canInviteToChannel: false,
      canMessage: false,
      canVideoCall: false,
      reason: "blocked",
    };
  }

  if (contact.scope === "external" && options.allowExternalMessaging === false) {
    return {
      canAudioCall: false,
      canInviteToChannel: false,
      canMessage: false,
      canVideoCall: false,
      reason: "external-restricted",
    };
  }

  if (contact.relationship !== "connected") {
    return {
      canAudioCall: false,
      canInviteToChannel: true,
      canMessage: false,
      canVideoCall: false,
      reason: "pending-relationship",
    };
  }

  return {
    canAudioCall: Boolean(options.supportsAudioCall),
    canInviteToChannel: true,
    canMessage: true,
    canVideoCall: Boolean(options.supportsVideoCall),
    reason: undefined,
  };
}

export function createContactDigest(
  contact: SdkworkContactRecord,
  options: CreateContactDigestOptions = {},
): SdkworkContactDigest {
  return {
    ...(contact.avatar ? { avatar: contact.avatar } : {}),
    digestStatus: resolveContactDigestStatus(contact),
    displayName: contact.displayName,
    ...(contact.headline ? { headline: contact.headline } : {}),
    id: contact.id,
    ...(contact.initials ? { initials: contact.initials } : {}),
    isActive: contact.id === options.activeContactId,
    isExternal: contact.scope === "external",
    isFavorite: Boolean(contact.isFavorite),
    isPinned: Boolean(contact.isPinned),
    ...(contact.lastInteractionAt !== undefined ? { lastInteractionAt: contact.lastInteractionAt } : {}),
    ...(contact.presence ? { presence: contact.presence } : {}),
    relationship: contact.relationship,
    ...(contact.remark ? { remark: contact.remark } : {}),
    scope: contact.scope,
  };
}

export function summarizeContactDigests(
  digests: readonly SdkworkContactDigest[],
): SdkworkContactDigestSummary {
  let attentionContacts = 0;
  let availableContacts = 0;
  let blockedContacts = 0;
  let externalContacts = 0;
  let favoriteContacts = 0;
  let onlineContacts = 0;
  let pendingContacts = 0;
  let pinnedContacts = 0;

  for (const digest of digests) {
    if (digest.digestStatus === "attention") {
      attentionContacts += 1;
    }

    if (digest.digestStatus === "available") {
      availableContacts += 1;
    }

    if (digest.digestStatus === "blocked") {
      blockedContacts += 1;
    }

    if (digest.digestStatus === "external") {
      externalContacts += 1;
    }

    if (digest.digestStatus === "pending") {
      pendingContacts += 1;
    }

    if (digest.isFavorite) {
      favoriteContacts += 1;
    }

    if (digest.isPinned) {
      pinnedContacts += 1;
    }

    if (digest.presence === "online") {
      onlineContacts += 1;
    }
  }

  return {
    attentionContacts,
    availableContacts,
    blockedContacts,
    externalContacts,
    favoriteContacts,
    onlineContacts,
    pendingContacts,
    pinnedContacts,
    totalContacts: digests.length,
  };
}

export function evaluateContactCollaborationReadiness(
  contact: SdkworkContactRecord,
  options: EvaluateContactCollaborationReadinessOptions = {},
): SdkworkContactCollaborationReadiness {
  const action = options.action ?? "message";
  const quickActions = resolveContactQuickActions(contact, options);
  const issues = toUniqueContactCollaborationIssues([
    ...(quickActions.reason ? [quickActions.reason] : []),
    ...(action === "audio-call" && !quickActions.canAudioCall && !quickActions.reason
      ? ["audio-call-disabled" as const]
      : []),
    ...(action === "video-call" && !quickActions.canVideoCall && !quickActions.reason
      ? ["video-call-disabled" as const]
      : []),
    ...((action === "audio-call" || action === "video-call") && contact.presence === "offline"
      ? ["offline-contact" as const]
      : []),
    ...(action === "channel-invite" && quickActions.canInviteToChannel && !options.channelId
      ? ["missing-channel-target" as const]
      : []),
  ]);

  const ready =
    action === "channel-invite"
      ? quickActions.canInviteToChannel && Boolean(options.channelId)
      : action === "audio-call"
        ? quickActions.canAudioCall && !issues.includes("offline-contact")
        : action === "video-call"
          ? quickActions.canVideoCall && !issues.includes("offline-contact")
          : quickActions.canMessage;

  return {
    capabilities: {
      canAudioCall: quickActions.canAudioCall,
      canInviteToChannel: quickActions.canInviteToChannel,
      canMessage: quickActions.canMessage,
      canVideoCall: quickActions.canVideoCall,
      ...(quickActions.reason ? { reason: quickActions.reason } : {}),
    },
    degraded: ready && issues.length > 0,
    issues,
    ready,
  };
}

export function toImParticipant(
  contact: SdkworkContactRecord,
): SdkworkImParticipant {
  return {
    ...(contact.avatar ? { avatar: contact.avatar } : {}),
    id: contact.id,
    name: contact.displayName,
    presence: contact.presence,
  };
}

export function createDirectConversationSeed(
  contact: SdkworkContactRecord,
  options: CreateDirectConversationSeedOptions = {},
): SdkworkContactDirectConversationSeed {
  const participant = toImParticipant(contact);
  const conversationId = options.conversationId ?? `dm:${contact.id}`;

  return {
    conversation: {
      id: conversationId,
      kind: "direct",
      participants: [participant],
      title: contact.displayName,
    },
    participant,
    route: `${options.routeBasePath ?? "/messages/conversations"}/${conversationId}`,
  };
}

export function createContactsWorkspaceManifest({
  description = "Contacts workspace for people directories, pickers, and profile routing.",
  host,
  id = "sdkwork-contacts",
  packageNames = ["@sdkwork/contacts-pc-react"],
  pickerRoutePath = "/contacts/picker",
  routePath = "/contacts",
  theme,
  title = "Contacts",
}: CreateContactsWorkspaceManifestOptions = {}): SdkworkContactsWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "contacts",
    pickerRoutePath,
    profileRoutePattern: `${routePath}/:contactId`,
    routePath,
  };
}

export function createContactProfileIntent(
  contactId: string,
  options: CreateContactProfileIntentOptions = {},
): SdkworkContactProfileIntent {
  return {
    contactId,
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/contacts"}/${contactId}`,
    source: "profile-link",
    type: "contact-profile-intent",
  };
}

export const contactsPackageMeta = {
  architecture: "pc-react",
  domain: "communication",
  package: "@sdkwork/contacts-pc-react",
  status: "ready",
} as const;

export type ContactsPackageMeta = typeof contactsPackageMeta;
