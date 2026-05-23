import { describe, expect, it } from "vitest";
import {
  createSdkworkCommandExecutor,
  createSdkworkCommandGroups,
  createSdkworkCommandManifest,
  createSdkworkCommandRegistry,
  createSdkworkQuickActionGroups,
  createSdkworkSlashCommandGroups,
  filterSdkworkCommandRegistry,
  normalizeSdkworkCommandShortcut,
  searchSdkworkCommandRegistry,
} from "../src";

const commands = [
  {
    aliases: ["global-search"],
    description: "Open the global spotlight search sheet",
    group: "Navigation",
    groupOrder: 1,
    id: "open-search",
    keywords: ["discover", "spotlight"],
    order: 1,
    scope: "global",
    shortcut: "cmd + k",
    source: "home",
    surfaces: ["spotlight", "quick-actions"],
    title: "Open Search",
  },
  {
    aliases: ["agent-hub"],
    description: "Browse installed and featured agents",
    group: "AI",
    groupOrder: 2,
    id: "open-agents",
    keywords: ["assistant", "automation"],
    order: 1,
    scope: "workspace",
    shortcut: "ctrl + alt + a",
    source: "assistant",
    surfaces: ["spotlight", "quick-actions"],
    title: "Open Agents",
  },
  {
    aliases: ["new-image"],
    description: "Start a new image creation flow",
    group: "Creation",
    groupOrder: 3,
    id: "create-image",
    keywords: ["canvas", "generate"],
    order: 1,
    scope: "workspace",
    source: "studio",
    surfaces: ["quick-actions"],
    title: "Create Image",
  },
  {
    aliases: ["mention"],
    description: "Insert a mention into the current composer",
    group: "Composer",
    groupOrder: 4,
    id: "insert-mention",
    keywords: ["tag", "user"],
    order: 1,
    scope: "conversation",
    source: "composer",
    surfaces: ["slash"],
    title: "Mention User",
  },
  {
    enabled: false,
    group: "AI",
    id: "disabled-command",
    surfaces: ["quick-actions"],
    title: "Disabled Command",
  },
] as const;

describe("sdkwork-command-mobile-react", () => {
  it("normalizes shortcuts and creates a registry with deterministic scope and surface metadata", () => {
    const registry = createSdkworkCommandRegistry(commands);

    expect(normalizeSdkworkCommandShortcut(" command + shift + p ")).toBe("Meta+Shift+P");
    expect(registry.commands.map((item) => item.id)).toEqual([
      "open-search",
      "open-agents",
      "create-image",
      "insert-mention",
    ]);
    expect(registry.groups.map((group) => group.id)).toEqual([
      "navigation",
      "ai",
      "creation",
      "composer",
    ]);
    expect(registry.scopeIds).toEqual(["global", "workspace", "conversation"]);
    expect(registry.surfaceIds).toEqual(["spotlight", "quick-actions", "slash"]);
    expect(registry.commandsByShortcut["Meta+K"]).toMatchObject({
      id: "open-search",
    });
    expect(registry.commandsById["open-agents"]).toMatchObject({
      shortcut: "Ctrl+Alt+A",
      surfaces: ["spotlight", "quick-actions"],
    });
  });

  it("rejects duplicate ids and duplicate normalized shortcuts", () => {
    expect(() =>
      createSdkworkCommandRegistry([
        ...commands,
        {
          id: "open-search",
          title: "Duplicate Id",
        },
      ]),
    ).toThrowError("Duplicate command id: open-search");

    expect(() =>
      createSdkworkCommandRegistry([
        ...commands,
        {
          id: "duplicate-shortcut",
          shortcut: "Command + K",
          title: "Duplicate Shortcut",
        },
      ]),
    ).toThrowError("Duplicate command shortcut: Meta+K");
  });

  it("filters commands by scope and surface and keeps grouped results in registry order", () => {
    const registry = createSdkworkCommandRegistry(commands);
    const quickActions = filterSdkworkCommandRegistry(registry, {
      scopeIds: ["workspace"],
      surfaceIds: ["quick-actions"],
    });

    expect(quickActions.commands.map((item) => item.id)).toEqual([
      "open-agents",
      "create-image",
    ]);
    expect(searchSdkworkCommandRegistry(registry, "mention", { surfaceIds: ["slash"] }).map((item) => item.id)).toEqual([
      "insert-mention",
    ]);
    expect(createSdkworkQuickActionGroups(registry, "", { scopeIds: ["workspace"] })).toEqual([
      {
        heading: "AI",
        id: "ai",
        items: [expect.objectContaining({ id: "open-agents" })],
        order: 2,
        scopeIds: ["workspace"],
        surfaceIds: ["spotlight", "quick-actions"],
      },
      {
        heading: "Creation",
        id: "creation",
        items: [expect.objectContaining({ id: "create-image" })],
        order: 3,
        scopeIds: ["workspace"],
        surfaceIds: ["quick-actions"],
      },
    ]);
    expect(createSdkworkSlashCommandGroups(registry, "mention", { scopeIds: ["conversation"] })).toEqual([
      {
        heading: "Composer",
        id: "composer",
        items: [expect.objectContaining({ id: "insert-mention" })],
        order: 4,
        scopeIds: ["conversation"],
        surfaceIds: ["slash"],
      },
    ]);
    expect(createSdkworkCommandGroups(registry, "open", { surfaceIds: ["spotlight"] })).toEqual([
      {
        heading: "Navigation",
        id: "navigation",
        items: [expect.objectContaining({ id: "open-search" })],
        order: 1,
        scopeIds: ["global"],
        surfaceIds: ["spotlight", "quick-actions"],
      },
      {
        heading: "AI",
        id: "ai",
        items: [expect.objectContaining({ id: "open-agents" })],
        order: 2,
        scopeIds: ["workspace"],
        surfaceIds: ["spotlight", "quick-actions"],
      },
    ]);
  });

  it("executes commands by id and shortcut with normalized metadata", async () => {
    const registry = createSdkworkCommandRegistry(commands);
    const calls: string[] = [];
    const executor = createSdkworkCommandExecutor({
      handlers: {
        "open-agents": ({ command, shortcut, source }) => {
          calls.push([command.id, source, shortcut].filter(Boolean).join(":"));
        },
      },
      registry,
    });

    await executor.executeShortcut("ctrl+alt+a");
    await executor.execute("open-agents", { source: "quick-actions" });

    expect(calls).toEqual([
      "open-agents:keyboard:Ctrl+Alt+A",
      "open-agents:quick-actions",
    ]);
    await expect(executor.execute("open-search")).rejects.toThrowError(
      "Missing command handler: open-search",
    );
  });

  it("creates a mobile command manifest with launcher, scope, and surface metadata", () => {
    const registry = createSdkworkCommandRegistry(commands);
    const manifest = createSdkworkCommandManifest({
      launcherShortcut: "cmd + k",
      packageNames: [
        "@sdkwork/command-mobile-react",
        "@sdkwork/search-mobile-react",
        "@sdkwork/command-mobile-react",
      ],
      registry,
    });

    expect(manifest).toMatchObject({
      capability: "command",
      groupIds: ["navigation", "ai", "creation", "composer"],
      host: "capacitor",
      launcherShortcut: "Meta+K",
      launcherSurface: "spotlight",
      scopeIds: ["global", "workspace", "conversation"],
      surfaceIds: ["spotlight", "quick-actions", "slash"],
      title: "Command",
    });
    expect(manifest.packageNames).toEqual([
      "@sdkwork/command-mobile-react",
      "@sdkwork/search-mobile-react",
    ]);
  });
});
