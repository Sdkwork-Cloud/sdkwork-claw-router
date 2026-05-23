import { describe, expect, it } from "vitest";
import {
  buildMemoryRecallBlock,
  createMemoryLibraryRouteIntent,
  createMemoryRecordDetailRouteIntent,
  createMemoryWorkspaceManifest,
  evaluateMemoryRetention,
  filterMemoryRecords,
  summarizeMemoryRecords,
} from "../src";

const NOW = 1_710_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

const policy = {
  expiringSoonDays: 7,
  mode: "rolling",
  retentionDays: 30,
} as const;

const records = [
  {
    content: "Prefer the Sdkwork zinc theme preset.",
    createdAt: NOW - 25 * DAY,
    id: "pref-theme",
    kind: "preference",
    scope: "user",
    status: "active",
    tags: ["theme"],
    updatedAt: NOW - 25 * DAY,
  },
  {
    content: "Packages are grouped by architecture and domain.",
    createdAt: NOW - 3 * DAY,
    id: "repo-layout",
    kind: "fact",
    scope: "workspace",
    status: "active",
    tags: ["architecture"],
    updatedAt: NOW - 3 * DAY,
  },
  {
    content: "Works on the AI appbase architecture.",
    createdAt: NOW - 29 * DAY,
    id: "profile-role",
    kind: "profile",
    scope: "agent",
    status: "active",
    tags: ["profile"],
    updatedAt: NOW - 29 * DAY,
  },
  {
    content: "Legacy migration checklist.",
    createdAt: NOW - 40 * DAY,
    id: "legacy-checklist",
    kind: "task",
    scope: "session",
    status: "archived",
    tags: ["ops"],
    updatedAt: NOW - 40 * DAY,
  },
] as const;

describe("sdkwork-memory-pc-react", () => {
  it("evaluates retention state and summarizes memory records", () => {
    expect(evaluateMemoryRetention(records[0], policy, NOW)).toBe("expiring-soon");
    expect(evaluateMemoryRetention(records[1], policy, NOW)).toBe("retained");
    expect(evaluateMemoryRetention(records[3], policy, NOW)).toBe("expired");

    expect(summarizeMemoryRecords(records, policy, NOW)).toEqual({
      activeCount: 3,
      archivedCount: 1,
      expiredCount: 1,
      expiringSoonCount: 2,
      kindCounts: {
        fact: 1,
        preference: 1,
        profile: 1,
        task: 1,
      },
      scopeCounts: {
        agent: 1,
        session: 1,
        user: 1,
        workspace: 1,
      },
    });
  });

  it("filters records and formats a prompt-ready recall block", () => {
    expect(
      filterMemoryRecords(records, {
        query: "sdkwork",
        scopes: ["user"],
        status: ["active"],
      }).map((record) => record.id),
    ).toEqual(["pref-theme"]);

    expect(buildMemoryRecallBlock(records)).toEqual(
      [
        "Memory Recall:",
        "1. [workspace/fact] Packages are grouped by architecture and domain.",
        "2. [user/preference] Prefer the Sdkwork zinc theme preset.",
        "3. [agent/profile] Works on the AI appbase architecture.",
      ].join("\n"),
    );
  });

  it("creates memory workspace manifests and route intents", () => {
    expect(
      createMemoryWorkspaceManifest({
        packageNames: ["@sdkwork/memory-pc-react", "@sdkwork/memory-pc-react"],
        title: "Memory",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "memory",
      description: "Memory workspace for recall scopes, retention summaries, and assistant-aware routing.",
      detailRoutePattern: "/memory/:recordId",
      host: "tauri",
      id: "sdkwork-memory",
      packageNames: ["@sdkwork/memory-pc-react"],
      routePath: "/memory",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Memory",
    });

    expect(
      createMemoryLibraryRouteIntent({
        scope: "user",
        status: "active",
      }),
    ).toEqual({
      focusWindow: true,
      route: "/memory?scope=user&status=active",
      scope: "user",
      source: "memory-workspace",
      status: "active",
      type: "memory-library-route-intent",
    });

    expect(createMemoryRecordDetailRouteIntent("pref-theme")).toEqual({
      focusWindow: true,
      recordId: "pref-theme",
      route: "/memory/pref-theme",
      source: "memory-workspace",
      type: "memory-record-detail-route-intent",
    });
  });
});
