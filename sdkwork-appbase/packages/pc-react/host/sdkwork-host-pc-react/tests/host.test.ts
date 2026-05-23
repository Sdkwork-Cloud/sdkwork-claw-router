import { describe, expect, it } from "vitest";
import {
  createHostCommandId,
  createHostDescriptor,
  createHostEventTopic,
  createSdkworkHostCapabilityCatalog,
  createSdkworkHostCommandCatalog,
  createSdkworkHostEventCatalog,
  createSdkworkHostManifest,
  createSdkworkHostPermissionBaseline,
  evaluateSdkworkHostReadiness,
  hasHostCapability,
} from "../src";

describe("sdkwork-host-pc-react", () => {
  it("creates stable host descriptors with tauri defaults and deduplicated capabilities", () => {
    const descriptor = createHostDescriptor({
      capabilities: [
        "tray",
        "window-controls",
        "tray",
        "fs",
      ],
      commands: [
        createHostCommandId("window", "show_main_window"),
        createHostCommandId("window", "show_main_window"),
      ],
      events: [
        createHostEventTopic("tray", "navigate"),
        createHostEventTopic("tray", "navigate"),
      ],
      id: "sdkwork-studio-desktop",
      kind: "tauri",
      label: "Sdkwork Studio Desktop",
    });

    expect(descriptor.capabilities).toEqual([
      "theme-sync",
      "clipboard",
      "window-controls",
      "tray",
      "fs",
    ]);
    expect(descriptor.commands).toEqual(["window:show_main_window"]);
    expect(descriptor.events).toEqual(["tray://navigate"]);
    expect(descriptor.windowChrome).toEqual({
      decorations: false,
      dragRegion: true,
      startupReveal: "after-bootstrap",
      windowControls: "custom",
    });
    expect(hasHostCapability(descriptor, "fs")).toBe(true);
    expect(hasHostCapability(descriptor, "process")).toBe(false);
  });

  it("creates server host descriptors without desktop-only defaults", () => {
    const descriptor = createHostDescriptor({
      id: "sdkwork-server-runtime",
      kind: "server",
      label: "SDKWORK Server Runtime",
    });

    expect(descriptor.capabilities).toEqual([]);
    expect(descriptor.windowChrome).toEqual({
      decorations: false,
      dragRegion: false,
      startupReveal: "immediate",
      windowControls: "native",
    });
    expect(hasHostCapability(descriptor, "clipboard")).toBe(false);
    expect(hasHostCapability(descriptor, "window-controls")).toBe(false);
  });

  it("creates host capability metadata catalogs for browser, server, and tauri", () => {
    const browserCatalog = createSdkworkHostCapabilityCatalog("browser");
    const serverCatalog = createSdkworkHostCapabilityCatalog("server");
    const tauriCatalog = createSdkworkHostCapabilityCatalog("tauri");

    expect(browserCatalog.map((item) => item.capability)).toEqual([
      "theme-sync",
      "clipboard",
    ]);
    expect(browserCatalog[0]).toMatchObject({
      capability: "theme-sync",
      category: "runtime",
      hostKinds: ["browser", "tauri"],
      requiredByDefault: true,
    });
    expect(serverCatalog).toEqual([]);
    expect(tauriCatalog.map((item) => item.capability)).toEqual([
      "theme-sync",
      "clipboard",
      "window-controls",
      "tray",
    ]);
    expect(tauriCatalog[2]).toMatchObject({
      capability: "window-controls",
      category: "window",
      requiredByDefault: true,
    });
  });

  it("creates namespaced command and event catalogs with labels", () => {
    expect(
      createSdkworkHostCommandCatalog("window", [
        "show_main_window",
        "toggle_maximize",
      ]),
    ).toEqual([
      {
        command: "show_main_window",
        critical: false,
        id: "window:show_main_window",
        label: "Show Main Window",
        namespace: "window",
      },
      {
        command: "toggle_maximize",
        critical: false,
        id: "window:toggle_maximize",
        label: "Toggle Maximize",
        namespace: "window",
      },
    ]);

    expect(
      createSdkworkHostEventCatalog("tray", [
        "navigate",
        "restore",
      ]),
    ).toEqual([
      {
        critical: false,
        event: "navigate",
        label: "Navigate",
        namespace: "tray",
        topic: "tray://navigate",
      },
      {
        critical: false,
        event: "restore",
        label: "Restore",
        namespace: "tray",
        topic: "tray://restore",
      },
    ]);
  });

  it("derives host permission baselines and readiness summaries", () => {
    const descriptor = createHostDescriptor({
      capabilities: ["fs", "process"],
      id: "sdkwork-drive",
      kind: "tauri",
      label: "SDKWORK Drive",
    });

    expect(createSdkworkHostPermissionBaseline(descriptor)).toMatchObject([
      {
        capability: "window-controls",
        level: "baseline",
      },
      {
        capability: "tray",
        level: "baseline",
      },
      {
        capability: "fs",
        level: "optional",
      },
      {
        capability: "process",
        level: "optional",
      },
    ]);

    expect(
      evaluateSdkworkHostReadiness(descriptor, {
        requiredCapabilities: ["window-controls", "tray", "updater"],
      }),
    ).toEqual({
      availableCapabilities: [
        "theme-sync",
        "clipboard",
        "window-controls",
        "tray",
        "fs",
        "process",
      ],
      missingCapabilities: ["updater"],
      ready: false,
      requiredCapabilities: ["window-controls", "tray", "updater"],
      supportsCustomChrome: true,
      supportsTrayRecovery: true,
    });
  });

  it("creates host manifests from the descriptor and required capabilities", () => {
    const descriptor = createHostDescriptor({
      capabilities: ["fs"],
      commands: [
        createHostCommandId("window", "show_main_window"),
      ],
      events: [
        createHostEventTopic("tray", "navigate"),
      ],
      id: "sdkwork-drive",
      kind: "tauri",
      label: "SDKWORK Drive",
    });

    const manifest = createSdkworkHostManifest({
      descriptor,
      packageNames: [
        "@sdkwork/host-pc-react",
        "@sdkwork/host-pc-react",
        "@sdkwork/host-tauri-pc-react",
      ],
      requiredCapabilities: ["window-controls", "tray"],
    });

    expect(manifest).toMatchObject({
      capability: "host",
      commandIds: ["window:show_main_window"],
      eventTopics: ["tray://navigate"],
      hostKind: "tauri",
      requiredCapabilities: ["window-controls", "tray"],
      title: "SDKWORK Drive Host",
    });
    expect(manifest.packageNames).toEqual([
      "@sdkwork/host-pc-react",
      "@sdkwork/host-tauri-pc-react",
    ]);
  });
});
