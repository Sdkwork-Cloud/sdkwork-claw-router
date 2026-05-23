import { describe, expect, it, vi } from "vitest";
import {
  createTauriHostBridge,
  evaluateTauriHostBridgeReadiness,
  runTauriOnly,
  runTauriOrFallback,
} from "../src";

describe("sdkwork-host-tauri-pc-react", () => {
  it("creates a tauri bridge with baseline desktop defaults and namespaced transport wiring", async () => {
    const invoke = vi.fn(async () => "ok");
    const unlisten = vi.fn();
    const listen = vi.fn(async () => unlisten);
    const maximize = vi.fn(async () => undefined);
    const unmaximize = vi.fn(async () => undefined);
    const isMaximized = vi
      .fn<() => Promise<boolean>>()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    const bridge = createTauriHostBridge({
      descriptor: {
        capabilities: [
          "native-notification",
          "fs",
        ],
        commands: [
          "window:show_main_window",
          "app:relaunch",
        ],
        events: [
          "tray://restore",
          "process://output",
        ],
        id: "drive-desktop",
        label: "Drive Desktop",
      },
      transport: {
        invoke,
        listen,
        window: {
          isMaximized,
          maximize,
          unmaximize,
        },
      },
    });

    expect(bridge.descriptor.capabilities).toEqual([
      "theme-sync",
      "clipboard",
      "window-controls",
      "tray",
      "native-notification",
      "fs",
    ]);
    expect(bridge.descriptor.commands).toEqual([
      "window:show_main_window",
      "window:toggle_maximize",
      "app:relaunch",
    ]);
    expect(bridge.descriptor.events).toEqual([
      "tray://navigate",
      "tray://restore",
      "process://output",
    ]);

    await expect(bridge.invokeCommand("window", "show_main_window", { focus: true })).resolves.toBe("ok");
    const stop = await bridge.listenEvent("tray", "navigate", () => undefined);
    await bridge.window.toggleMaximize();
    await bridge.window.toggleMaximize();
    await stop();

    expect(invoke).toHaveBeenCalledWith("window:show_main_window", { focus: true });
    expect(listen).toHaveBeenCalledWith("tray://navigate", expect.any(Function));
    expect(maximize).toHaveBeenCalledTimes(1);
    expect(unmaximize).toHaveBeenCalledTimes(1);
    expect(unlisten).toHaveBeenCalledTimes(1);
  });

  it("throws typed bridge errors for unavailable runtimes, undeclared surfaces, and missing window operations", async () => {
    const bridge = createTauriHostBridge({
      transport: {
        available: false,
        invoke: async () => "tauri",
        listen: async () => () => undefined,
      },
    });

    await expect(bridge.invokeCommand("window", "show_main_window")).rejects.toMatchObject({
      code: "tauri-unavailable",
      name: "SdkworkTauriHostBridgeError",
      operation: "window:show_main_window",
    });
    await expect(bridge.window.show()).rejects.toMatchObject({
      code: "window-operation-unavailable",
      operation: "show",
    });

    const failingBridge = createTauriHostBridge({
      transport: {
        invoke: async () => {
          throw new Error("invoke boom");
        },
        listen: async () => {
          throw new Error("listen boom");
        },
      },
    });

    await expect(failingBridge.invokeCommand("desktop", "relaunch")).rejects.toMatchObject({
      code: "command-not-registered",
      commandId: "desktop:relaunch",
    });
    await expect(failingBridge.listenEvent("process", "output", () => undefined)).rejects.toMatchObject({
      code: "event-not-registered",
      eventTopic: "process://output",
    });
    await expect(failingBridge.invokeCommand("window", "show_main_window")).rejects.toMatchObject({
      causeMessage: "invoke boom",
      code: "invoke-failed",
      commandId: "window:show_main_window",
    });
    await expect(failingBridge.listenEvent("tray", "navigate", () => undefined)).rejects.toMatchObject({
      causeMessage: "listen boom",
      code: "listen-failed",
      eventTopic: "tray://navigate",
    });
  });

  it("evaluates tauri bridge readiness across capabilities, commands, events, and window operations", () => {
    const bridge = createTauriHostBridge({
      descriptor: {
        capabilities: ["fs"],
      },
      transport: {
        available: () => true,
        invoke: async () => undefined,
        listen: async () => () => undefined,
        window: {
          isMaximized: async () => false,
          maximize: async () => undefined,
          minimize: async () => undefined,
          show: async () => undefined,
          unmaximize: async () => undefined,
        },
      },
    });

    expect(
      evaluateTauriHostBridgeReadiness(bridge, {
        requiredCapabilities: [
          "window-controls",
          "tray",
          "fs",
          "updater",
        ],
        requiredCommands: [
          "window:show_main_window",
          "desktop:relaunch",
        ],
        requiredEvents: [
          "tray://navigate",
          "process://output",
        ],
        requiredWindowOperations: [
          "show",
          "minimize",
          "toggleMaximize",
          "close",
        ],
      }),
    ).toEqual({
      available: true,
      missingCapabilities: ["updater"],
      missingCommands: ["desktop:relaunch"],
      missingEvents: ["process://output"],
      missingWindowOperations: ["close"],
      ready: false,
      requiredCapabilities: [
        "window-controls",
        "tray",
        "fs",
        "updater",
      ],
      requiredCommands: [
        "window:show_main_window",
        "desktop:relaunch",
      ],
      requiredEvents: [
        "tray://navigate",
        "process://output",
      ],
      requiredWindowOperations: [
        "show",
        "minimize",
        "toggleMaximize",
        "close",
      ],
      supportsCustomChrome: true,
      supportsTrayRecovery: true,
    });
  });

  it("supports explicit tauri-only and fallback execution", async () => {
    const availableBridge = createTauriHostBridge({
      transport: {
        invoke: async () => "tauri",
        listen: async () => () => undefined,
      },
    });

    const unavailableBridge = createTauriHostBridge({
      transport: {
        available: false,
        invoke: async () => "tauri",
        listen: async () => () => undefined,
      },
    });

    await expect(
      runTauriOnly(availableBridge, (bridge) => bridge.invokeCommand("window", "show_main_window")),
    ).resolves.toBe("tauri");
    await expect(
      runTauriOrFallback(
        unavailableBridge,
        (bridge) => bridge.invokeCommand("window", "show_main_window"),
        async () => "fallback",
      ),
    ).resolves.toBe("fallback");
    await expect(
      runTauriOnly(unavailableBridge, (bridge) => bridge.invokeCommand("window", "show_main_window")),
    ).rejects.toMatchObject({
      code: "tauri-unavailable",
      operation: "tauri-only",
    });
  });
});
