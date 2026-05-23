import { describe, expect, it } from "vitest";
import {
  createSettingsRegistry,
  createSettingsSectionDigest,
  evaluateSettingsChangeReadiness,
  resolveDefaultSettingsSection,
  searchSettingsRegistry,
  summarizeSettingsSectionDigests,
} from "../src";

describe("sdkwork-settings-pc-react", () => {
  it("groups settings sections into stable navigation clusters", () => {
    const registry = createSettingsRegistry([
      {
        group: "system",
        id: "appearance",
        route: "/settings/appearance",
        title: "Appearance",
      },
      {
        group: "account",
        id: "profile",
        order: 1,
        route: "/settings/profile",
        title: "Profile",
      },
      {
        group: "account",
        id: "security",
        order: 2,
        route: "/settings/security",
        title: "Security",
      },
    ]);

    expect(resolveDefaultSettingsSection(registry)?.id).toBe("profile");
    expect(registry.groups.account.map((section) => section.id)).toEqual([
      "profile",
      "security",
    ]);
    expect(registry.navigation.map((group) => group.group)).toEqual([
      "account",
      "system",
    ]);
  });

  it("searches settings sections through the shared search package", () => {
    const registry = createSettingsRegistry([
      {
        description: "Desktop theme, accent color, and density.",
        group: "system",
        id: "appearance",
        keywords: [
          "theme",
          "color",
          "appearance",
        ],
        route: "/settings/appearance",
        title: "Appearance",
      },
      {
        description: "Manage email, passkeys, and connected identities.",
        group: "account",
        id: "security",
        keywords: [
          "password",
          "passkey",
          "oauth",
        ],
        route: "/settings/security",
        title: "Security",
      },
    ]);

    expect(searchSettingsRegistry(registry, "theme").map((item) => item.id)).toEqual(["appearance"]);
    expect(searchSettingsRegistry(registry, "passkey").map((item) => item.id)).toEqual(["security"]);
  });

  it("creates section digests and summary counters for settings dashboards", () => {
    const registry = createSettingsRegistry([
      {
        group: "account",
        id: "profile",
        keywords: [
          "avatar",
          "account",
        ],
        order: 1,
        route: "/settings/profile",
        saveMode: "auto",
        title: "Profile",
      },
      {
        group: "workspace",
        id: "directories",
        keywords: [
          "workspace",
          "path",
        ],
        order: 1,
        route: "/settings/directories",
        saveMode: "manual",
        title: "Directories",
      },
      {
        group: "notifications",
        id: "sync",
        order: 1,
        route: "/settings/sync",
        title: "Sync",
      },
      {
        group: "security",
        hasDangerZone: true,
        id: "security",
        keywords: [
          "passkey",
          "mfa",
        ],
        order: 1,
        route: "/settings/security",
        title: "Security",
      },
      {
        enabled: false,
        group: "billing",
        hasDangerZone: true,
        id: "labs",
        order: 1,
        route: "/settings/labs",
        title: "Labs",
      },
      {
        group: "system",
        id: "gateway",
        keywords: [
          "runtime",
          "local",
        ],
        order: 1,
        route: "/settings/gateway",
        saveMode: "apply",
        title: "Gateway",
      },
    ]);

    const digests = registry.sections.map((section) =>
      createSettingsSectionDigest(section, {
        activeGroup: "account",
        attentionSectionIds: ["security"],
        currentSectionId: "profile",
        dirtySectionIds: ["directories"],
        restartRequiredSectionIds: ["gateway"],
        savingSectionIds: ["sync"],
      }),
    );

    expect(
      Object.fromEntries(digests.map((digest) => [digest.id, digest.digestStatus])),
    ).toEqual({
      directories: "dirty",
      gateway: "restart-required",
      labs: "restricted",
      profile: "current",
      security: "attention",
      sync: "saving",
    });

    expect(digests.find((digest) => digest.id === "profile")).toMatchObject({
      isAvailable: true,
      isCurrent: true,
      keywordCount: 2,
      matchesGroup: true,
      saveMode: "auto",
    });

    expect(digests.find((digest) => digest.id === "gateway")).toMatchObject({
      hasChanges: false,
      matchesGroup: false,
      requiresRestart: true,
      saveMode: "apply",
    });

    expect(digests.find((digest) => digest.id === "security")).toMatchObject({
      hasDangerZone: true,
      needsAttention: true,
      saveMode: "manual",
    });

    expect(summarizeSettingsSectionDigests(digests)).toEqual({
      applySections: 1,
      attentionSections: 1,
      autoSaveSections: 1,
      availableSections: 5,
      currentSections: 1,
      dangerSections: 2,
      dirtySections: 1,
      manualSaveSections: 4,
      restartRequiredSections: 1,
      restrictedSections: 1,
      savingSections: 1,
      totalSections: 6,
    });
  });

  it("treats group mismatch as degraded while allowing supported manual save flows", () => {
    const readiness = evaluateSettingsChangeReadiness(
      {
        group: "workspace",
        id: "directories",
        route: "/settings/directories",
        saveMode: "manual",
        title: "Directories",
      },
      {
        action: "save",
        activeGroup: "account",
        hasChanges: true,
      },
    );

    expect(readiness).toEqual({
      capabilities: {
        canApply: false,
        canOpenSection: true,
        canRestart: false,
        canSave: true,
      },
      checklist: {
        hasChanges: true,
        matchesGroup: false,
        passesValidation: true,
        restartRequired: false,
        supportsApply: false,
        supportsManualSave: true,
      },
      degraded: true,
      issues: ["group-mismatch"],
      ready: true,
    });
  });

  it("blocks invalid apply, restart, and disabled-open flows", () => {
    expect(
      evaluateSettingsChangeReadiness(
        {
          group: "system",
          id: "gateway",
          route: "/settings/gateway",
          saveMode: "apply",
          title: "Gateway",
        },
        {
          action: "apply",
          hasChanges: true,
          hasValidationErrors: true,
        },
      ),
    ).toEqual({
      capabilities: {
        canApply: false,
        canOpenSection: true,
        canRestart: false,
        canSave: false,
      },
      checklist: {
        hasChanges: true,
        matchesGroup: true,
        passesValidation: false,
        restartRequired: false,
        supportsApply: true,
        supportsManualSave: false,
      },
      degraded: false,
      issues: ["validation-errors"],
      ready: false,
    });

    expect(
      evaluateSettingsChangeReadiness(
        {
          group: "system",
          id: "gateway",
          route: "/settings/gateway",
          saveMode: "apply",
          title: "Gateway",
        },
        {
          action: "restart",
        },
      ),
    ).toEqual({
      capabilities: {
        canApply: false,
        canOpenSection: true,
        canRestart: false,
        canSave: false,
      },
      checklist: {
        hasChanges: false,
        matchesGroup: true,
        passesValidation: true,
        restartRequired: false,
        supportsApply: true,
        supportsManualSave: false,
      },
      degraded: false,
      issues: ["restart-not-required"],
      ready: false,
    });

    expect(
      evaluateSettingsChangeReadiness(
        {
          enabled: false,
          group: "billing",
          id: "labs",
          route: "/settings/labs",
          title: "Labs",
        },
        {
          action: "open-section",
        },
      ),
    ).toEqual({
      capabilities: {
        canApply: false,
        canOpenSection: false,
        canRestart: false,
        canSave: false,
      },
      checklist: {
        hasChanges: false,
        matchesGroup: true,
        passesValidation: true,
        restartRequired: false,
        supportsApply: false,
        supportsManualSave: true,
      },
      degraded: false,
      issues: ["section-disabled"],
      ready: false,
    });
  });
});
