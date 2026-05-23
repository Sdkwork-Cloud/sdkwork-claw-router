import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createSdkworkShellTheme,
  createSdkworkShellBlueprint,
  createSdkworkShellManifest,
  SdkworkShellLayout,
  SdkworkShellProvider,
  summarizeSdkworkShellBlueprint,
  useSdkworkShell,
} from "../src";

class ResizeObserverMock {
  disconnect() {}

  observe() {}

  unobserve() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
}

if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

const shellBlueprint = createSdkworkShellBlueprint({
  brand: "Sdkwork Studio",
  commands: [
    {
      description: "Review app preferences",
      group: "System",
      id: "settings",
      keywords: ["preferences", "theme"],
      shortcut: "Ctrl+,",
      title: "Open settings",
    },
  ],
  navigationSections: [
    {
      id: "library",
      items: [
        {
          description: "Browse model presets and prompt assets",
          href: "/library",
          id: "library",
          order: 2,
          title: "Library",
        },
        {
          enabled: false,
          href: "/hidden",
          id: "hidden",
          title: "Hidden",
        },
      ],
      order: 2,
      title: "Library",
    },
    {
      id: "workspace",
      items: [
        {
          description: "Open the primary assistant workspace",
          href: "/chat",
          id: "chat",
          keywords: ["assistant", "copilot"],
          order: 1,
          title: "AI Chat",
        },
      ],
      order: 1,
      title: "Workspace",
    },
    {
      enabled: false,
      id: "hidden-section",
      items: [
        {
          href: "/legacy",
          id: "legacy",
          title: "Legacy",
        },
      ],
      title: "Hidden Section",
    },
  ],
  subtitle: "AI workflow cockpit",
  title: "Studio",
});

function ShellProbe() {
  const shell = useSdkworkShell();

  return (
    <div>
      <span>{shell.isNavigationOpen ? "navigation-open" : "navigation-closed"}</span>
      <span>{shell.isCommandPaletteOpen ? "palette-open" : "palette-closed"}</span>
      <button
        type="button"
        onClick={shell.toggleNavigationOpen}
      >
        toggle-navigation
      </button>
      <button
        type="button"
        onClick={shell.toggleCommandPalette}
      >
        toggle-palette
      </button>
      <span>{shell.locale}</span>
      <span>{shell.localePreference}</span>
      <button
        type="button"
        onClick={() => shell.setLocalePreference("ar-SA")}
      >
        set-arabic
      </button>
    </div>
  );
}

describe("sdkwork-shell-pc-react", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.removeAttribute("data-sdk-color-mode");
    document.documentElement.removeAttribute("dir");
    document.documentElement.removeAttribute("lang");
    document.documentElement.classList.remove("dark");
  });

  it("creates sdkwork-derived color variants that mirror sdkwork-studio theme colors", () => {
    expect(
      createSdkworkShellTheme({
        themeColor: "lobster",
        themeSelection: "dark",
      }).brand.primary,
    ).toBe("#ef4444");

    expect(
      createSdkworkShellTheme({
        themeColor: "green-tech",
        themeSelection: "light",
      }).brand.primary,
    ).toBe("#059669");

    expect(
      createSdkworkShellTheme({
        themeColor: "tech-blue",
        themeSelection: "dark",
      }).brand.primary,
    ).toBe("#3b82f6");
  });

  it("normalizes shell blueprints and derives deterministic command groups", () => {
    expect(shellBlueprint.identity).toEqual({
      brand: "Sdkwork Studio",
      monogram: "SS",
      subtitle: "AI workflow cockpit",
      title: "Studio",
    });

    expect(shellBlueprint.navigationSections.map((section) => section.id)).toEqual([
      "workspace",
      "library",
    ]);
    expect(shellBlueprint.navigationSections[1]?.items.map((item) => item.id)).toEqual(["library"]);
    expect(shellBlueprint.commandEntries.map((command) => command.id)).toEqual([
      "navigate:chat",
      "navigate:library",
      "settings",
    ]);
    expect(shellBlueprint.commandGroups).toMatchObject([
      {
        heading: "Workspace",
        id: "workspace",
        items: [
          {
            description: "Open the primary assistant workspace",
            group: "Workspace",
            groupOrder: 1,
            id: "navigate:chat",
            keywords: ["assistant", "copilot", "workspace", "navigate", "global", "navigation"],
            scope: "global",
            source: "navigation",
            title: "AI Chat",
          },
        ],
        order: 1,
        scopeIds: ["global"],
      },
      {
        heading: "Library",
        id: "library",
        items: [
          {
            description: "Browse model presets and prompt assets",
            group: "Library",
            groupOrder: 2,
            id: "navigate:library",
            keywords: ["library", "navigate", "global", "navigation"],
            scope: "global",
            source: "navigation",
            title: "Library",
          },
        ],
        order: 2,
        scopeIds: ["global"],
      },
      {
        heading: "System",
        id: "system",
        items: [
          {
            description: "Review app preferences",
            group: "System",
            id: "settings",
            keywords: ["preferences", "theme", "system", "global", "utility", "ctrl+,"],
            scope: "global",
            shortcut: "Ctrl+,",
            source: "utility",
            title: "Open settings",
          },
        ],
        order: Number.MAX_SAFE_INTEGER,
        scopeIds: ["global"],
      },
    ]);

    expect(summarizeSdkworkShellBlueprint(shellBlueprint)).toEqual({
      commandIds: ["navigate:chat", "navigate:library", "settings"],
      commandGroupHeadings: ["Workspace", "Library", "System"],
      navigationItemIds: ["chat", "library"],
      navigationSectionIds: ["workspace", "library"],
      totalCommands: 3,
      totalNavigationItems: 2,
    });
  });

  it("creates a shell manifest with shell defaults and derived navigation metadata", () => {
    expect(
      createSdkworkShellManifest({
        blueprint: shellBlueprint,
        packageNames: [
          "@sdkwork/shell-pc-react",
          "@sdkwork/command-pc-react",
          "@sdkwork/shell-pc-react",
        ],
        theme: {
          color: "lobster",
        },
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "shell",
      commandPaletteShortcut: "Meta+K",
      description: "Shared application shell for Sdkwork Studio, desktop navigation, and command palette composition.",
      host: "tauri",
      id: "sdkwork-shell",
      navigationSectionIds: ["workspace", "library"],
      packageNames: ["@sdkwork/shell-pc-react", "@sdkwork/command-pc-react"],
      sidebarMode: "expanded",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Studio",
    });
  });

  it("manages shell chrome state and applies document theme attributes", () => {
    render(
      <SdkworkShellProvider
        defaultCommandPaletteOpen
        defaultNavigationOpen={false}
        defaultThemeColor="lobster"
        defaultThemeSelection="dark"
      >
        <ShellProbe />
      </SdkworkShellProvider>,
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "lobster");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByText("navigation-closed")).toBeInTheDocument();
    expect(screen.getByText("palette-open")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "toggle-navigation" }));
    fireEvent.click(screen.getByRole("button", { name: "toggle-palette" }));

    expect(screen.getByText("navigation-open")).toBeInTheDocument();
    expect(screen.getByText("palette-closed")).toBeInTheDocument();
  });

  it("renders shell identity from the blueprint and wires provider-managed command palette state", async () => {
    const onCommandSelect = vi.fn();

    render(
      <SdkworkShellProvider
        defaultCommandPaletteOpen
        defaultThemeColor="lobster"
        defaultThemeSelection="dark"
      >
        <SdkworkShellLayout
          blueprint={shellBlueprint}
          content={<div>Workspace content</div>}
          onCommandSelect={onCommandSelect}
          sidebar={<div>Shell sidebar</div>}
        />
      </SdkworkShellProvider>,
    );

    expect(screen.getByText("Studio")).toBeInTheDocument();
    expect(screen.getByText("AI workflow cockpit")).toBeInTheDocument();
    expect(screen.getByText("Sdkwork Studio")).toBeInTheDocument();
    expect(screen.getByText("Shell sidebar")).toBeInTheDocument();
    expect(screen.getByText("Workspace content")).toBeInTheDocument();
    expect(screen.getByText("AI Chat")).toBeInTheDocument();
    expect(screen.getByText("Open settings")).toBeInTheDocument();

    fireEvent.click(screen.getByText("AI Chat"));

    expect(onCommandSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        action: {
          href: "/chat",
          target: "internal",
          type: "navigate",
        },
        id: "navigate:chat",
        source: "navigation",
      }),
    );

    await waitFor(() => {
      expect(screen.queryByText("Open settings")).not.toBeInTheDocument();
    });
  });

  it("defaults shell theme state to the sdkwork lobster accent and publishes resolved color mode", () => {
    render(
      <SdkworkShellProvider>
        <ShellProbe />
      </SdkworkShellProvider>,
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "lobster");
    expect(document.documentElement).toHaveAttribute("data-sdk-color-mode", "dark");
  });

  it("keeps the shell frame theme in sync with system light mode", () => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
        matches: query === "(prefers-color-scheme: light)",
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      })),
      writable: true,
    });

    render(
      <SdkworkShellProvider defaultThemeSelection="system">
        <SdkworkShellLayout
          blueprint={shellBlueprint}
          content={<div>Workspace content</div>}
        />
      </SdkworkShellProvider>,
    );

    expect(document.documentElement).toHaveAttribute("data-sdk-color-mode", "light");
    expect(screen.getByText("Workspace content").closest('[data-sdk-pattern=\"app-shell\"]')).toHaveAttribute(
      "data-sdk-color-mode",
      "light",
    );
  });

  it("tracks locale preference in the shell context and syncs locale direction to the document host", () => {
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "en-US",
    });

    render(
      <SdkworkShellProvider defaultThemeSelection="light">
        <ShellProbe />
      </SdkworkShellProvider>,
    );

    expect(document.documentElement).toHaveAttribute("lang", "en-US");
    expect(document.documentElement).toHaveAttribute("dir", "ltr");
    expect(screen.getAllByText("en-US")).toHaveLength(1);
    expect(screen.getByText("system")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "set-arabic" }));

    expect(document.documentElement).toHaveAttribute("lang", "ar-SA");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    expect(screen.getAllByText("ar-SA")).toHaveLength(2);
  });
});
