import { describe, expect, it } from "vitest";
import {
  createSdkworkCommandExecutor,
  createSdkworkCommandManifest,
  createSdkworkCommandPaletteGroups,
  createSdkworkCommandRegistry,
  filterSdkworkCommandRegistryByScopes,
  searchSdkworkCommandRegistry,
} from "../src";

const commands = [
  {
    aliases: ["assistant-home"],
    description: "Open the AI chat workspace",
    group: "Navigation",
    groupOrder: 1,
    id: "open-chat",
    keywords: ["assistant", "conversation"],
    order: 1,
    scope: "global",
    shortcut: "cmd + shift + k",
    source: "shell",
    title: "Open Chat",
  },
  {
    aliases: ["history"],
    description: "Review previous conversations",
    group: "Navigation",
    groupOrder: 1,
    id: "open-history",
    keywords: ["archive"],
    order: 2,
    scope: "workspace",
    shortcut: "alt + h",
    source: "workspace",
    title: "Open Chat History",
  },
  {
    aliases: ["routing"],
    description: "Manage provider and model routing",
    group: "AI",
    groupOrder: 2,
    id: "open-models",
    keywords: ["llm", "providers"],
    order: 1,
    scope: "workspace",
    shortcut: "ctrl + alt + m",
    source: "workspace",
    title: "Open Models",
  },
  {
    enabled: false,
    group: "AI",
    id: "disabled-command",
    title: "Disabled Command",
  },
] as const;

describe("sdkwork-command-pc-react", () => {
  it("creates a normalized registry with groups, scopes, and shortcuts", () => {
    const registry = createSdkworkCommandRegistry(commands);

    expect(registry.commands.map((item) => item.id)).toEqual([
      "open-chat",
      "open-history",
      "open-models",
    ]);
    expect(registry.groups.map((group) => group.id)).toEqual(["navigation", "ai"]);
    expect(registry.groups[0]).toMatchObject({
      heading: "Navigation",
      scopeIds: ["global", "workspace"],
    });
    expect(registry.scopeIds).toEqual(["global", "workspace"]);
    expect(registry.commandsByShortcut["Meta+Shift+K"]).toMatchObject({
      id: "open-chat",
    });
    expect(registry.commandsById["open-history"]).toMatchObject({
      group: "Navigation",
      shortcut: "Alt+H",
    });
  });

  it("rejects duplicate command ids and duplicate normalized shortcuts", () => {
    expect(() =>
      createSdkworkCommandRegistry([
        ...commands,
        {
          id: "open-chat",
          title: "Duplicate Id",
        },
      ]),
    ).toThrowError("Duplicate command id: open-chat");

    expect(() =>
      createSdkworkCommandRegistry([
        ...commands,
        {
          id: "duplicate-shortcut",
          shortcut: "Command+Shift+K",
          title: "Duplicate Shortcut",
        },
      ]),
    ).toThrowError("Duplicate command shortcut: Meta+Shift+K");
  });

  it("filters commands by scope and keeps palette groups in registry order", () => {
    const registry = createSdkworkCommandRegistry(commands);
    const workspaceRegistry = filterSdkworkCommandRegistryByScopes(registry, ["workspace"]);

    expect(workspaceRegistry.commands.map((item) => item.id)).toEqual([
      "open-history",
      "open-models",
    ]);
    expect(searchSdkworkCommandRegistry(registry, "assistant", { scopeIds: ["global"] }).map((item) => item.id)).toEqual([
      "open-chat",
    ]);
    expect(createSdkworkCommandPaletteGroups(registry, "open", { scopeIds: ["workspace"] })).toEqual([
      {
        heading: "Navigation",
        id: "navigation",
        items: [expect.objectContaining({ id: "open-history" })],
        order: 1,
        scopeIds: ["workspace"],
      },
      {
        heading: "AI",
        id: "ai",
        items: [expect.objectContaining({ id: "open-models" })],
        order: 2,
        scopeIds: ["workspace"],
      },
    ]);
  });

  it("executes commands by id and shortcut with normalized metadata", async () => {
    const registry = createSdkworkCommandRegistry(commands);
    const calls: string[] = [];
    const executor = createSdkworkCommandExecutor({
      handlers: {
        "open-models": ({ command, shortcut, source }) => {
          calls.push([command.id, source, shortcut].filter(Boolean).join(":"));
        },
      },
      registry,
    });

    await executor.executeShortcut("ctrl+alt+m");
    await executor.execute("open-models", { source: "palette" });

    expect(calls).toEqual([
      "open-models:keyboard:Ctrl+Alt+M",
      "open-models:palette",
    ]);
    await expect(executor.execute("open-history")).rejects.toThrowError(
      "Missing command handler: open-history",
    );
  });

  it("creates a command manifest from the registry", () => {
    const registry = createSdkworkCommandRegistry(commands);
    const manifest = createSdkworkCommandManifest({
      defaultCommandId: "open-chat",
      packageNames: [
        "@sdkwork/command-pc-react",
        "@sdkwork/search-pc-react",
        "@sdkwork/command-pc-react",
      ],
      registry,
    });

    expect(manifest).toMatchObject({
      capability: "command",
      defaultCommandId: "open-chat",
      groupIds: ["navigation", "ai"],
      paletteShortcut: "Meta+K",
      scopeIds: ["global", "workspace"],
      title: "Command",
    });
    expect(manifest.packageNames).toEqual([
      "@sdkwork/command-pc-react",
      "@sdkwork/search-pc-react",
    ]);
  });
});
