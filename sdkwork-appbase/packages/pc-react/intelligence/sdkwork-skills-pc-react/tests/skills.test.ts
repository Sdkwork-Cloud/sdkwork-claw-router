import { describe, expect, it } from "vitest";
import {
  buildSkillCapabilityBlock,
  createSkillDetailRouteIntent,
  createSkillsLibraryRouteIntent,
  createSkillsWorkspaceManifest,
  filterSkills,
  resolveSkillReadiness,
  summarizeSkillsCatalog,
  supportsSkillReuseTarget,
} from "../src";

const NOW = 1_710_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

const skills = [
  {
    category: "Development",
    description: "Reviews pull requests from the command palette and chat.",
    enabled: true,
    id: "github-pr",
    installState: "installed",
    missing: {
      bins: [],
      config: [],
      env: [],
    },
    name: "GitHub PR Assistant",
    reusePolicy: "shared",
    scope: "workspace",
    tags: ["github", "review"],
    triggers: [
      {
        id: "command-review-pr",
        kind: "command",
        label: "Review pull request",
      },
      {
        id: "manual-chat-review",
        kind: "manual",
        label: "Manual chat invocation",
      },
    ],
    updatedAt: NOW - DAY,
  },
  {
    category: "Operations",
    description: "Plans incident release rollouts on a schedule.",
    enabled: true,
    id: "release-bot",
    installState: "installed",
    missing: {
      bins: [],
      config: [],
      env: [],
    },
    name: "Release Bot",
    reusePolicy: "workflow-only",
    scope: "managed",
    tags: ["release", "ops"],
    triggers: [
      {
        id: "schedule-release-window",
        kind: "schedule",
        label: "Release window schedule",
      },
    ],
    updatedAt: NOW - 2 * DAY,
  },
  {
    category: "Productivity",
    description: "Syncs calendars but still needs provider credentials.",
    enabled: true,
    id: "calendar-sync",
    installState: "update-available",
    missing: {
      bins: [],
      config: [],
      env: ["CALENDAR_TOKEN"],
    },
    name: "Calendar Sync",
    reusePolicy: "workflow-only",
    scope: "managed",
    tags: ["calendar"],
    triggers: [
      {
        id: "schedule-nightly-sync",
        kind: "schedule",
        label: "Nightly sync",
      },
    ],
    updatedAt: NOW - 3 * DAY,
  },
  {
    category: "System",
    description: "Installs local diagnostics into the desktop workspace.",
    enabled: true,
    id: "desk-ops",
    installState: "available",
    missing: {
      bins: [],
      config: [],
      env: [],
    },
    name: "Desk Ops",
    reusePolicy: "assistant-only",
    scope: "bundled",
    tags: ["desktop", "ops"],
    triggers: [
      {
        id: "event-system-alert",
        kind: "event",
        label: "System alert event",
      },
    ],
    updatedAt: NOW - 4 * DAY,
  },
  {
    category: "Knowledge",
    description: "Summarizes local notes with a keyboard shortcut.",
    enabled: false,
    id: "local-notes",
    installState: "installed",
    missing: {
      bins: [],
      config: [],
      env: [],
    },
    name: "Local Notes",
    reusePolicy: "assistant-only",
    scope: "workspace",
    tags: ["notes"],
    triggers: [
      {
        id: "shortcut-notes-capture",
        kind: "shortcut",
        label: "Notes capture shortcut",
      },
    ],
    updatedAt: NOW - 5 * DAY,
  },
  {
    category: "Operations",
    description: "Receives incident alerts through a webhook bridge.",
    enabled: true,
    id: "incident-webhook",
    installState: "installing",
    missing: {
      bins: [],
      config: [],
      env: [],
    },
    name: "Incident Webhook",
    reusePolicy: "workflow-only",
    scope: "managed",
    tags: ["incident"],
    triggers: [
      {
        id: "webhook-incident",
        kind: "webhook",
        label: "Incident webhook",
      },
    ],
    updatedAt: NOW - 6 * DAY,
  },
] as const;

describe("sdkwork-skills-pc-react", () => {
  it("derives readiness and supports assistant or workflow reuse targets", () => {
    expect(resolveSkillReadiness(skills[0])).toBe("ready");
    expect(resolveSkillReadiness(skills[2])).toBe("missing-requirements");
    expect(resolveSkillReadiness(skills[3])).toBe("not-installed");
    expect(resolveSkillReadiness(skills[4])).toBe("disabled");
    expect(resolveSkillReadiness(skills[5])).toBe("installing");

    expect(supportsSkillReuseTarget(skills[0], "assistant")).toBe(true);
    expect(supportsSkillReuseTarget(skills[0], "workflow")).toBe(true);
    expect(supportsSkillReuseTarget(skills[1], "assistant")).toBe(false);
    expect(supportsSkillReuseTarget(skills[1], "workflow")).toBe(true);
  });

  it("summarizes and filters the skills catalog", () => {
    expect(summarizeSkillsCatalog(skills)).toEqual({
      assistantReadySkillIds: ["github-pr"],
      installStateCounts: {
        available: 1,
        installed: 3,
        installing: 1,
        "update-available": 1,
      },
      readinessCounts: {
        disabled: 1,
        installing: 1,
        "missing-requirements": 1,
        "not-installed": 1,
        ready: 2,
      },
      skillCount: 6,
      triggerCounts: {
        command: 1,
        event: 1,
        manual: 1,
        schedule: 2,
        shortcut: 1,
        webhook: 1,
      },
      workflowReadySkillIds: ["github-pr", "release-bot"],
    });

    expect(
      filterSkills(skills, {
        query: "review",
        readiness: ["ready"],
        target: "assistant",
        triggerKinds: ["command"],
      }).map((skill) => skill.id),
    ).toEqual(["github-pr"]);

    expect(
      filterSkills(skills, {
        readiness: ["ready"],
        target: "workflow",
      }).map((skill) => skill.id),
    ).toEqual(["github-pr", "release-bot"]);
  });

  it("builds capability blocks plus workspace manifests and route intents", () => {
    expect(
      buildSkillCapabilityBlock(skills, {
        target: "workflow",
      }),
    ).toEqual(
      [
        "Skill Capabilities:",
        "1. GitHub PR Assistant [shared] triggers: command, manual",
        "Reviews pull requests from the command palette and chat.",
        "2. Release Bot [workflow-only] triggers: schedule",
        "Plans incident release rollouts on a schedule.",
      ].join("\n"),
    );

    expect(
      createSkillsWorkspaceManifest({
        packageNames: ["@sdkwork/skills-pc-react", "@sdkwork/skills-pc-react"],
        title: "Skills",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "skills",
      description: "Skills workspace for trigger catalogs, install readiness, and assistant-workflow reuse routing.",
      detailRoutePattern: "/skills/:skillId",
      host: "tauri",
      id: "sdkwork-skills",
      packageNames: ["@sdkwork/skills-pc-react"],
      routePath: "/skills",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Skills",
    });

    expect(
      createSkillsLibraryRouteIntent({
        target: "workflow",
        trigger: "schedule",
      }),
    ).toEqual({
      focusWindow: true,
      route: "/skills?target=workflow&trigger=schedule",
      source: "skills-workspace",
      target: "workflow",
      trigger: "schedule",
      type: "skills-library-route-intent",
    });

    expect(createSkillDetailRouteIntent("github-pr")).toEqual({
      focusWindow: true,
      route: "/skills/github-pr",
      skillId: "github-pr",
      source: "skills-workspace",
      type: "skills-detail-route-intent",
    });
  });
});
