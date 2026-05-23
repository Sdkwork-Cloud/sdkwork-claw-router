import { describe, expect, it } from "vitest";
import {
  createContactDigest,
  createContactProfileIntent,
  createContactsWorkspaceManifest,
  createDirectConversationSeed,
  evaluateContactCollaborationReadiness,
  filterContacts,
  groupContactsByInitial,
  resolveContactQuickActions,
  sortContacts,
  summarizeContactDigests,
  summarizeContactsDirectory,
  toImParticipant,
  toggleContactSelection,
  type SdkworkContactRecord,
} from "../src";

const contacts: SdkworkContactRecord[] = [
  {
    displayName: "Ada Lovelace",
    id: "ada",
    initials: "A",
    isFavorite: true,
    isPinned: true,
    lastInteractionAt: "2026-04-02T09:20:00.000Z",
    presence: "online",
    relationship: "connected",
    scope: "workspace",
    tags: ["design", "vip"],
  },
  {
    displayName: "Ben Remote",
    id: "ben",
    initials: "B",
    lastInteractionAt: "2026-04-02T08:10:00.000Z",
    presence: "offline",
    relationship: "connected",
    scope: "external",
    tags: ["partner"],
  },
  {
    displayName: "Clio Review",
    id: "clio",
    initials: "C",
    isFavorite: true,
    lastInteractionAt: "2026-04-02T08:45:00.000Z",
    presence: "online",
    relationship: "request-received",
    scope: "workspace",
    tags: ["review"],
  },
  {
    displayName: "Zed Archive",
    id: "zed",
    lastInteractionAt: "2026-04-01T17:00:00.000Z",
    presence: "offline",
    relationship: "blocked",
    scope: "personal",
  },
  {
    displayName: "Nia Pending",
    id: "nia",
    initials: "N",
    lastInteractionAt: "2026-04-02T07:30:00.000Z",
    presence: "away",
    relationship: "invite-pending",
    scope: "group",
    tags: ["pilot"],
  },
];

describe("sdkwork-contacts-pc-react", () => {
  it("sorts contacts by pin, favorite, presence, and name, then filters them by query and scope", () => {
    expect(sortContacts(contacts).map((contact) => contact.id)).toEqual([
      "ada",
      "clio",
      "nia",
      "ben",
      "zed",
    ]);

    expect(
      filterContacts(contacts, {
        query: "review",
        relationships: ["request-received", "connected"],
        scopes: ["workspace"],
      }).map((contact) => contact.id),
    ).toEqual(["clio"]);
  });

  it("groups contacts by initial and summarizes directory counts", () => {
    expect(groupContactsByInitial(contacts)).toEqual([
      {
        contacts: [contacts[0]],
        initial: "A",
      },
      {
        contacts: [contacts[1]],
        initial: "B",
      },
      {
        contacts: [contacts[2]],
        initial: "C",
      },
      {
        contacts: [contacts[4]],
        initial: "N",
      },
      {
        contacts: [contacts[3]],
        initial: "Z",
      },
    ]);

    expect(
      summarizeContactsDirectory(contacts, {
        pendingInvites: 2,
      }),
    ).toEqual({
      externalContacts: 1,
      favoriteContacts: 2,
      onlineContacts: 2,
      pendingInvites: 2,
      totalContacts: 5,
    });
  });

  it("toggles picker selection with dedupe and maximum-selection enforcement", () => {
    expect(toggleContactSelection([], "ada", { maxSelected: 2 })).toEqual({
      reason: undefined,
      selectedIds: ["ada"],
    });

    expect(toggleContactSelection(["ada"], "ben", { maxSelected: 2 })).toEqual({
      reason: undefined,
      selectedIds: ["ada", "ben"],
    });

    expect(toggleContactSelection(["ada", "ben"], "clio", { maxSelected: 2 })).toEqual({
      reason: "limit-reached",
      selectedIds: ["ada", "ben"],
    });
  });

  it("resolves quick actions and maps contacts into IM participants and direct conversation seeds", () => {
    expect(
      resolveContactQuickActions(contacts[0], {
        supportsAudioCall: true,
        supportsVideoCall: true,
      }),
    ).toEqual({
      canAudioCall: true,
      canInviteToChannel: true,
      canMessage: true,
      canVideoCall: true,
      reason: undefined,
    });

    expect(
      resolveContactQuickActions(contacts[1], {
        allowExternalMessaging: false,
        supportsAudioCall: true,
        supportsVideoCall: true,
      }),
    ).toEqual({
      canAudioCall: false,
      canInviteToChannel: false,
      canMessage: false,
      canVideoCall: false,
      reason: "external-restricted",
    });

    expect(toImParticipant(contacts[0])).toEqual({
      avatarUrl: undefined,
      id: "ada",
      name: "Ada Lovelace",
      presence: "online",
    });

    expect(
      createDirectConversationSeed(contacts[0], {
        routeBasePath: "/messages/conversations",
      }),
    ).toEqual({
      conversation: {
        id: "dm:ada",
        kind: "direct",
        participants: [
          {
            avatarUrl: undefined,
            id: "ada",
            name: "Ada Lovelace",
            presence: "online",
          },
        ],
        title: "Ada Lovelace",
      },
      participant: {
        avatarUrl: undefined,
        id: "ada",
        name: "Ada Lovelace",
        presence: "online",
      },
      route: "/messages/conversations/dm:ada",
    });
  });

  it("creates contact digests and summarizes roster state for collaboration surfaces", () => {
    expect(
      createContactDigest(contacts[0], {
        activeContactId: "ada",
      }),
    ).toEqual({
      digestStatus: "available",
      displayName: "Ada Lovelace",
      id: "ada",
      initials: "A",
      isActive: true,
      isExternal: false,
      isFavorite: true,
      isPinned: true,
      lastInteractionAt: "2026-04-02T09:20:00.000Z",
      presence: "online",
      relationship: "connected",
      scope: "workspace",
    });

    expect(
      summarizeContactDigests([
        createContactDigest(contacts[0], { activeContactId: "ada" }),
        createContactDigest(contacts[1]),
        createContactDigest(contacts[2]),
        createContactDigest(contacts[3]),
        createContactDigest(contacts[4]),
      ]),
    ).toEqual({
      attentionContacts: 1,
      availableContacts: 1,
      blockedContacts: 1,
      externalContacts: 1,
      favoriteContacts: 2,
      onlineContacts: 2,
      pendingContacts: 1,
      pinnedContacts: 1,
      totalContacts: 5,
    });
  });

  it("evaluates collaboration readiness for launchable, degraded, and blocked actions", () => {
    expect(
      evaluateContactCollaborationReadiness(contacts[0], {
        action: "video-call",
        supportsAudioCall: true,
        supportsVideoCall: true,
      }),
    ).toEqual({
      capabilities: {
        canAudioCall: true,
        canInviteToChannel: true,
        canMessage: true,
        canVideoCall: true,
      },
      degraded: false,
      issues: [],
      ready: true,
    });

    expect(
      evaluateContactCollaborationReadiness(contacts[4], {
        action: "channel-invite",
        channelId: "release-room",
        supportsAudioCall: true,
        supportsVideoCall: true,
      }),
    ).toEqual({
      capabilities: {
        canAudioCall: false,
        canInviteToChannel: true,
        canMessage: false,
        canVideoCall: false,
        reason: "pending-relationship",
      },
      degraded: true,
      issues: ["pending-relationship"],
      ready: true,
    });

    expect(
      evaluateContactCollaborationReadiness(contacts[1], {
        action: "audio-call",
        allowExternalMessaging: false,
        supportsAudioCall: true,
        supportsVideoCall: true,
      }),
    ).toEqual({
      capabilities: {
        canAudioCall: false,
        canInviteToChannel: false,
        canMessage: false,
        canVideoCall: false,
        reason: "external-restricted",
      },
      degraded: false,
      issues: ["external-restricted", "offline-contact"],
      ready: false,
    });
  });

  it("creates a contacts workspace manifest and profile route intent", () => {
    expect(
      createContactsWorkspaceManifest({
        packageNames: ["@sdkwork/contacts-pc-react", "@sdkwork/im-pc-react"],
        pickerRoutePath: "/contacts/picker",
        title: "Contacts",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "contacts",
      description: "Contacts workspace for people directories, pickers, and profile routing.",
      host: "tauri",
      id: "sdkwork-contacts",
      packageNames: ["@sdkwork/contacts-pc-react", "@sdkwork/im-pc-react"],
      pickerRoutePath: "/contacts/picker",
      profileRoutePattern: "/contacts/:contactId",
      routePath: "/contacts",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Contacts",
    });

    expect(createContactProfileIntent("ada")).toEqual({
      contactId: "ada",
      focusWindow: true,
      route: "/contacts/ada",
      source: "profile-link",
      type: "contact-profile-intent",
    });
  });
});
