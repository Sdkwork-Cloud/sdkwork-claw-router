import { describe, expect, it } from "vitest";
import {
  SDKWORK_APPBASE_STANDARD_THEME_PRESET,
  SDKWORK_MOBILE_REACT_APP_PRESETS,
  SDKWORK_MOBILE_REACT_DOMAIN_ORDER,
  SDKWORK_MOBILE_REACT_STARTER_PACKAGES,
  createCapabilityRegistry,
  createSdkworkAppCapabilityManifest,
  createSdkworkAppCapabilityPresetManifest,
  resolveCapabilityPackageNames,
  resolveCapabilityPackages,
  selectCapabilityPackagesByDomain,
} from "../src";

describe("sdkwork-appbase-mobile-react", () => {
  it("groups starter packages using the stable mobile React domain order", () => {
    const registry = createCapabilityRegistry();

    expect(registry.domains.map((item) => item.domain)).toEqual(SDKWORK_MOBILE_REACT_DOMAIN_ORDER);
    expect(registry.packagesByDomain.foundation.map((item) => item.packageName)).toEqual([
      "@sdkwork/appbase-mobile-react",
      "@sdkwork/shell-mobile-react",
      "@sdkwork/router-mobile-react",
      "@sdkwork/workspace-mobile-react",
      "@sdkwork/command-mobile-react",
      "@sdkwork/search-mobile-react",
    ]);
    expect(registry.packagesByDomain.system.map((item) => item.packageName)).toEqual([
      "@sdkwork/settings-mobile-react",
      "@sdkwork/permission-mobile-react",
      "@sdkwork/notification-mobile-react",
      "@sdkwork/home-mobile-react",
      "@sdkwork/dashboard-mobile-react",
      "@sdkwork/apps-mobile-react",
      "@sdkwork/support-mobile-react",
      "@sdkwork/docs-mobile-react",
      "@sdkwork/news-mobile-react",
      "@sdkwork/about-mobile-react",
    ]);
    expect(registry.packagesByDomain.communication.map((item) => item.packageName)).toEqual([
      "@sdkwork/im-mobile-react",
      "@sdkwork/rtc-mobile-react",
      "@sdkwork/contacts-mobile-react",
      "@sdkwork/social-mobile-react",
      "@sdkwork/community-mobile-react",
      "@sdkwork/channel-mobile-react",
    ]);
    expect(registry.packagesByDomain.content.map((item) => item.packageName)).toEqual([
      "@sdkwork/drive-mobile-react",
      "@sdkwork/notes-mobile-react",
      "@sdkwork/editor-mobile-react",
      "@sdkwork/media-mobile-react",
      "@sdkwork/assets-mobile-react",
      "@sdkwork/image-mobile-react",
      "@sdkwork/audio-mobile-react",
      "@sdkwork/video-mobile-react",
      "@sdkwork/generation-mobile-react",
    ]);
    expect(registry.packagesByDomain.iam).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ capability: "auth" }),
        expect.objectContaining({ capability: "user" }),
      ]),
    );
  });

  it("creates a mobile manifest with sdkwork theme, capacitor host, and deduplicated packages", () => {
    const manifest = createSdkworkAppCapabilityManifest({
      id: "craw-chat-mobile-next",
      packageNames: [
        "@sdkwork/shell-mobile-react",
        "@sdkwork/router-mobile-react",
        "@sdkwork/shell-mobile-react",
      ],
      title: "Craw Chat Mobile Next",
    });

    expect(manifest.theme).toEqual(SDKWORK_APPBASE_STANDARD_THEME_PRESET);
    expect(manifest.host).toBe("capacitor");
    expect(manifest.packageNames).toEqual([
      "@sdkwork/shell-mobile-react",
      "@sdkwork/router-mobile-react",
    ]);
  });

  it("selects packages by domain from the shared mobile registry", () => {
    const registry = createCapabilityRegistry(SDKWORK_MOBILE_REACT_STARTER_PACKAGES);

    expect(
      selectCapabilityPackagesByDomain(registry, [
        "host",
        "system",
        "iam",
        "communication",
        "intelligence",
      ]).map((item) => item.capability),
    ).toEqual([
      "host",
      "host-native",
      "runtime",
      "settings",
      "permission",
      "notification",
      "home",
      "dashboard",
      "apps",
      "support",
      "docs",
      "news",
      "about",
      "auth",
      "user",
      "im",
      "rtc",
      "contacts",
      "social",
      "community",
      "channel",
      "chat",
      "llm",
      "models",
      "agent",
      "prompt",
      "memory",
      "knowledge",
      "mcp",
      "tools",
      "skills",
      "workflow",
    ]);
  });

  it("resolves mobile capability packages from domains, capabilities, includes, and excludes in stable order", () => {
    const registry = createCapabilityRegistry(SDKWORK_MOBILE_REACT_STARTER_PACKAGES);

    expect(
      resolveCapabilityPackages(registry, {
        capabilities: ["search", "chat"],
        domains: ["system"],
        excludePackageNames: [
          "@sdkwork/news-mobile-react",
          "@sdkwork/notification-mobile-react",
        ],
        includePackageNames: [
          "@sdkwork/runtime-mobile-react",
          "@sdkwork/custom-analytics-mobile-react",
          "@sdkwork/search-mobile-react",
        ],
      }).map((item) => item.capability),
    ).toEqual([
      "search",
      "runtime",
      "settings",
      "permission",
      "home",
      "dashboard",
      "apps",
      "support",
      "docs",
      "about",
      "chat",
    ]);

    expect(
      resolveCapabilityPackageNames(registry, {
        capabilities: ["search", "chat"],
        domains: ["system"],
        excludePackageNames: [
          "@sdkwork/news-mobile-react",
          "@sdkwork/notification-mobile-react",
        ],
        includePackageNames: [
          "@sdkwork/runtime-mobile-react",
          "@sdkwork/custom-analytics-mobile-react",
          "@sdkwork/search-mobile-react",
        ],
      }),
    ).toEqual([
      "@sdkwork/search-mobile-react",
      "@sdkwork/runtime-mobile-react",
      "@sdkwork/settings-mobile-react",
      "@sdkwork/permission-mobile-react",
      "@sdkwork/home-mobile-react",
      "@sdkwork/dashboard-mobile-react",
      "@sdkwork/apps-mobile-react",
      "@sdkwork/support-mobile-react",
      "@sdkwork/docs-mobile-react",
      "@sdkwork/about-mobile-react",
      "@sdkwork/chat-mobile-react",
      "@sdkwork/custom-analytics-mobile-react",
    ]);
  });

  it("rejects unknown capabilities and generates mobile preset manifests from preset definitions", () => {
    const registry = createCapabilityRegistry(SDKWORK_MOBILE_REACT_STARTER_PACKAGES);

    expect(() =>
      resolveCapabilityPackageNames(registry, {
        capabilities: ["unknown-capability"],
      }),
    ).toThrowError("Unknown capability: unknown-capability");

    expect(SDKWORK_MOBILE_REACT_APP_PRESETS.map((item) => item.id)).toEqual([
      "core-mobile",
      "assistant-mobile",
      "social-mobile",
      "creator-mobile",
      "super-app-mobile",
    ]);

    expect(
      createSdkworkAppCapabilityPresetManifest("social-mobile"),
    ).toEqual({
      architecture: "mobile-react",
      description: "Communication-first mobile preset for chat, contacts, channels, and social graph composition.",
      host: "capacitor",
      id: "social-mobile",
      packageNames: [
        "@sdkwork/appbase-mobile-react",
        "@sdkwork/shell-mobile-react",
        "@sdkwork/router-mobile-react",
        "@sdkwork/workspace-mobile-react",
        "@sdkwork/command-mobile-react",
        "@sdkwork/search-mobile-react",
        "@sdkwork/host-mobile-react",
        "@sdkwork/host-native-mobile-react",
        "@sdkwork/runtime-mobile-react",
        "@sdkwork/settings-mobile-react",
        "@sdkwork/permission-mobile-react",
        "@sdkwork/notification-mobile-react",
        "@sdkwork/home-mobile-react",
        "@sdkwork/dashboard-mobile-react",
        "@sdkwork/apps-mobile-react",
        "@sdkwork/support-mobile-react",
        "@sdkwork/docs-mobile-react",
        "@sdkwork/news-mobile-react",
        "@sdkwork/about-mobile-react",
        "@sdkwork/auth-mobile-react",
        "@sdkwork/user-mobile-react",
        "@sdkwork/im-mobile-react",
        "@sdkwork/rtc-mobile-react",
        "@sdkwork/contacts-mobile-react",
        "@sdkwork/social-mobile-react",
        "@sdkwork/community-mobile-react",
        "@sdkwork/channel-mobile-react",
      ],
      theme: {
        color: "zinc",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Social Mobile",
    });
  });
});
