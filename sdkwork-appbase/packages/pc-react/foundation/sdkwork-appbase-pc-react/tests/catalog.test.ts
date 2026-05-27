import { describe, expect, it } from "vitest";
import {
  SDKWORK_APPBASE_STANDARD_THEME_PRESET,
  SDKWORK_PC_REACT_APP_PRESETS,
  SDKWORK_PC_REACT_DOMAIN_ORDER,
  SDKWORK_PC_REACT_STARTER_PACKAGES,
  createCapabilityRegistry,
  createSdkworkAppCapabilityManifest,
  createSdkworkAppCapabilityPresetManifest,
  resolveCapabilityPackageNames,
  resolveCapabilityPackages,
  selectCapabilityPackagesByDomain,
} from "../src";

describe("sdkwork-appbase-pc-react", () => {
  it("groups starter packages using the stable PC React domain order", () => {
    const registry = createCapabilityRegistry();

    expect(registry.domains.map((item) => item.domain)).toEqual(SDKWORK_PC_REACT_DOMAIN_ORDER);
    expect(registry.packagesByDomain.foundation.map((item) => item.packageName)).toEqual([
      "@sdkwork/appbase-pc-react",
      "@sdkwork/i18n-pc-react",
      "@sdkwork/shell-pc-react",
      "@sdkwork/router-pc-react",
      "@sdkwork/workspace-pc-react",
      "@sdkwork/command-pc-react",
      "@sdkwork/search-pc-react",
    ]);
    expect(registry.packagesByDomain.system.map((item) => item.packageName)).toEqual([
      "@sdkwork/settings-pc-react",
      "@sdkwork/permission-pc-react",
      "@sdkwork/dashboard-pc-react",
      "@sdkwork/apps-pc-react",
      "@sdkwork/home-pc-react",
      "@sdkwork/docs-pc-react",
      "@sdkwork/support-pc-react",
      "@sdkwork/news-pc-react",
      "@sdkwork/about-pc-react",
    ]);
    expect(registry.packagesByDomain.notification.map((item) => item.packageName)).toEqual([
      "@sdkwork/notification-pc-react",
    ]);
    expect(registry.packagesByDomain.communication.map((item) => item.packageName)).toEqual([
      "@sdkwork/im-pc-react",
      "@sdkwork/rtc-pc-react",
      "@sdkwork/contacts-pc-react",
      "@sdkwork/channel-pc-react",
      "@sdkwork/community-pc-react",
      "@sdkwork/social-pc-react",
    ]);
    expect(registry.packagesByDomain.intelligence.map((item) => item.packageName)).toEqual([
      "@sdkwork/models-pc-react",
      "@sdkwork/llm-pc-react",
      "@sdkwork/chat-pc-react",
      "@sdkwork/prompt-pc-react",
      "@sdkwork/tools-pc-react",
      "@sdkwork/mcp-pc-react",
      "@sdkwork/knowledge-pc-react",
      "@sdkwork/memory-pc-react",
      "@sdkwork/skills-pc-react",
      "@sdkwork/agent-pc-react",
      "@sdkwork/workflow-pc-react",
    ]);
    expect(registry.packagesByDomain.content.map((item) => item.packageName)).toEqual([
      "@sdkwork/drive-pc-react",
      "@sdkwork/notes-pc-react",
      "@sdkwork/editor-pc-react",
      "@sdkwork/terminal-pc-react",
      "@sdkwork/browser-pc-react",
      "@sdkwork/media-pc-react",
      "@sdkwork/assets-pc-react",
      "@sdkwork/image-pc-react",
      "@sdkwork/audio-pc-react",
      "@sdkwork/video-pc-react",
      "@sdkwork/canvas-pc-react",
      "@sdkwork/generation-pc-react",
    ]);
    expect(registry.packagesByDomain.iam).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ capability: "auth" }),
        expect.objectContaining({ capability: "user" }),
      ]),
    );
    expect(registry.packagesByDomain.commerce.map((item) => item.packageName)).toEqual([
      "@sdkwork/wallet-pc-react",
      "@sdkwork/points-pc-react",
      "@sdkwork/membership-pc-react",
      "@sdkwork/membership-purchase-pc-react",
      "@sdkwork/membership-admin-pc-react",
      "@sdkwork/entitlement-pc-react",
      "@sdkwork/coupon-pc-react",
      "@sdkwork/offer-pc-react",
      "@sdkwork/pricing-pc-react",
      "@sdkwork/checkout-pc-react",
      "@sdkwork/subscription-pc-react",
      "@sdkwork/order-pc-react",
      "@sdkwork/payment-pc-react",
      "@sdkwork/invoice-pc-react",
      "@sdkwork/billing-pc-react",
      "@sdkwork/commerce-pc-react",
    ]);
    expect(registry.packagesByDomain.integration.map((item) => item.packageName)).toEqual([
      "@sdkwork/open-platform-admin-pc-react",
    ]);
    expect(registry.packagesByDomain.device.map((item) => item.packageName)).toEqual([
      "@sdkwork/device-pc-react",
      "@sdkwork/iot-pc-react",
      "@sdkwork/install-pc-react",
      "@sdkwork/distribution-pc-react",
    ]);
    expect(registry.packagesByDomain.ecosystem.map((item) => item.packageName)).toEqual([
      "@sdkwork/plugin-pc-react",
      "@sdkwork/market-pc-react",
    ]);
  });

  it("creates a starter manifest with sdkwork theme and deduplicated packages", () => {
    const manifest = createSdkworkAppCapabilityManifest({
      id: "sdkwork-studio-next",
      packageNames: [
        "@sdkwork/i18n-pc-react",
        "@sdkwork/shell-pc-react",
        "@sdkwork/router-pc-react",
        "@sdkwork/shell-pc-react",
      ],
      title: "Sdkwork Studio Next",
    });

    expect(manifest.theme).toEqual(SDKWORK_APPBASE_STANDARD_THEME_PRESET);
    expect(manifest.host).toBe("tauri");
    expect(manifest.packageNames).toEqual([
      "@sdkwork/i18n-pc-react",
      "@sdkwork/shell-pc-react",
      "@sdkwork/router-pc-react",
    ]);
  });

  it("selects packages by domain from the shared registry", () => {
    const registry = createCapabilityRegistry(SDKWORK_PC_REACT_STARTER_PACKAGES);

    expect(
      selectCapabilityPackagesByDomain(registry, [
        "host",
        "system",
        "notification",
        "iam",
        "communication",
        "intelligence",
        "content",
        "device",
        "ecosystem",
      ]).map((item) => item.capability),
    ).toEqual([
      "host",
      "host-tauri",
      "desktop",
      "settings",
      "permission",
      "dashboard",
      "apps",
      "home",
      "docs",
      "support",
      "news",
      "about",
      "notification",
      "auth",
      "user",
      "im",
      "rtc",
      "contacts",
      "channel",
      "community",
      "social",
      "models",
      "llm",
      "chat",
      "prompt",
      "tools",
      "mcp",
      "knowledge",
      "memory",
      "skills",
      "agent",
      "workflow",
      "drive",
      "notes",
      "editor",
      "terminal",
      "browser",
      "media",
      "assets",
      "image",
      "audio",
      "video",
      "canvas",
      "generation",
      "device",
      "iot",
      "install",
      "distribution",
      "plugin",
      "market",
    ]);
  });

  it("resolves capability packages from domains, capabilities, includes, and excludes in stable order", () => {
    const registry = createCapabilityRegistry(SDKWORK_PC_REACT_STARTER_PACKAGES);

    expect(
      resolveCapabilityPackages(registry, {
        capabilities: ["search", "chat"],
        domains: ["system", "notification"],
        excludePackageNames: [
          "@sdkwork/news-pc-react",
          "@sdkwork/notification-pc-react",
        ],
        includePackageNames: [
          "@sdkwork/desktop-pc-react",
          "@sdkwork/custom-analytics-pc-react",
          "@sdkwork/search-pc-react",
        ],
      }).map((item) => item.capability),
    ).toEqual([
      "search",
      "desktop",
      "settings",
      "permission",
      "dashboard",
      "apps",
      "home",
      "docs",
      "support",
      "about",
      "chat",
    ]);

    expect(
      resolveCapabilityPackageNames(registry, {
        capabilities: ["search", "chat"],
        domains: ["system", "notification"],
        excludePackageNames: [
          "@sdkwork/news-pc-react",
          "@sdkwork/notification-pc-react",
        ],
        includePackageNames: [
          "@sdkwork/desktop-pc-react",
          "@sdkwork/custom-analytics-pc-react",
          "@sdkwork/search-pc-react",
        ],
      }),
    ).toEqual([
      "@sdkwork/search-pc-react",
      "@sdkwork/desktop-pc-react",
      "@sdkwork/settings-pc-react",
      "@sdkwork/permission-pc-react",
      "@sdkwork/dashboard-pc-react",
      "@sdkwork/apps-pc-react",
      "@sdkwork/home-pc-react",
      "@sdkwork/docs-pc-react",
      "@sdkwork/support-pc-react",
      "@sdkwork/about-pc-react",
      "@sdkwork/chat-pc-react",
      "@sdkwork/custom-analytics-pc-react",
    ]);
  });

  it("rejects unknown capabilities and generates archetype manifests from preset definitions", () => {
    const registry = createCapabilityRegistry(SDKWORK_PC_REACT_STARTER_PACKAGES);

    expect(() =>
      resolveCapabilityPackageNames(registry, {
        capabilities: ["unknown-capability"],
      }),
    ).toThrowError("Unknown capability: unknown-capability");

    expect(SDKWORK_PC_REACT_APP_PRESETS.map((item) => item.id)).toEqual([
      "core-desktop",
      "assistant-desktop",
      "collaboration-desktop",
      "browser-portal",
    ]);

    expect(
      createSdkworkAppCapabilityPresetManifest("browser-portal"),
    ).toEqual({
      architecture: "pc-react",
      description: "Browser-first portal preset for docs, apps, support, and newsroom surfaces.",
      host: "browser",
      id: "browser-portal",
      packageNames: [
      "@sdkwork/appbase-pc-react",
      "@sdkwork/i18n-pc-react",
      "@sdkwork/shell-pc-react",
        "@sdkwork/router-pc-react",
        "@sdkwork/workspace-pc-react",
        "@sdkwork/command-pc-react",
        "@sdkwork/search-pc-react",
        "@sdkwork/settings-pc-react",
        "@sdkwork/dashboard-pc-react",
        "@sdkwork/apps-pc-react",
        "@sdkwork/home-pc-react",
        "@sdkwork/docs-pc-react",
        "@sdkwork/support-pc-react",
        "@sdkwork/news-pc-react",
        "@sdkwork/about-pc-react",
        "@sdkwork/notification-pc-react",
        "@sdkwork/auth-pc-react",
        "@sdkwork/user-pc-react",
      ],
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Browser Portal",
    });
  });

  it("uses the sdkwork lobster accent as the default preset theme", () => {
    expect(SDKWORK_APPBASE_STANDARD_THEME_PRESET).toEqual({
      color: "lobster",
      preset: "sdkwork",
      selection: "system",
    });
  });

  it("keeps commerce packages registered as independent appbase capabilities", () => {
    const registry = createCapabilityRegistry();
    const commercePackages = registry.packagesByDomain.commerce.map((item) => item.packageName);

    expect(commercePackages).toEqual([
      "@sdkwork/wallet-pc-react",
      "@sdkwork/points-pc-react",
      "@sdkwork/membership-pc-react",
      "@sdkwork/membership-purchase-pc-react",
      "@sdkwork/membership-admin-pc-react",
      "@sdkwork/entitlement-pc-react",
      "@sdkwork/coupon-pc-react",
      "@sdkwork/offer-pc-react",
      "@sdkwork/pricing-pc-react",
      "@sdkwork/checkout-pc-react",
      "@sdkwork/subscription-pc-react",
      "@sdkwork/order-pc-react",
      "@sdkwork/payment-pc-react",
      "@sdkwork/invoice-pc-react",
      "@sdkwork/billing-pc-react",
      "@sdkwork/commerce-pc-react",
    ]);
    expect(commercePackages).toContain("@sdkwork/membership-admin-pc-react");
    expect(commercePackages).toContain("@sdkwork/membership-purchase-pc-react");
  });
});
