import { describe, expect, it } from "vitest";
import {
  compileToolsForLlm,
  createToolDetailRouteIntent,
  createToolExecutionRouteIntent,
  createToolsDirectoryRouteIntent,
  createToolsWorkspaceManifest,
  filterToolCatalog,
  flattenToolCatalog,
  reduceToolExecutionEvents,
} from "../src";

const catalog = {
  agentId: "agent-1",
  groups: [
    {
      id: "filesystem",
      label: "Filesystem",
      source: "core",
      tools: [
        {
          defaultProfiles: ["coding", "full"],
          description: "Read the contents of a file from the workspace.",
          id: "read_file",
          inputSchema: {
            properties: {
              path: {
                description: "Absolute or workspace-relative path.",
                type: "string",
              },
            },
            required: ["path"],
            type: "object",
          },
          label: "Read File",
        },
      ],
    },
    {
      id: "automation",
      label: "Automation",
      source: "plugin",
      tools: [
        {
          defaultProfiles: ["coding"],
          description: "Run a shell command in the current workspace.",
          id: "exec_command",
          label: "Exec Command",
          optional: true,
          pluginId: "terminal-plus",
        },
        {
          defaultProfiles: ["messaging"],
          description: "Post a deployment summary to a team channel.",
          id: "notify_slack",
          label: "Notify Slack",
          pluginId: "terminal-plus",
        },
      ],
    },
  ],
  profiles: [
    { id: "minimal", label: "Minimal" },
    { id: "coding", label: "Coding" },
    { id: "messaging", label: "Messaging" },
    { id: "full", label: "Full" },
  ],
} as const;

describe("sdkwork-tools-pc-react", () => {
  it("flattens grouped tool catalogs into enriched descriptors with stable heuristics", () => {
    expect(flattenToolCatalog(catalog)).toEqual([
      {
        access: "execute",
        category: "automation",
        command: "tool:exec_command",
        defaultProfiles: ["coding"],
        description: "Run a shell command in the current workspace.",
        groupId: "automation",
        groupLabel: "Automation",
        id: "exec_command",
        label: "Exec Command",
        pluginId: "terminal-plus",
        risk: "high",
        source: "plugin",
        status: "beta",
      },
      {
        access: "write",
        category: "integration",
        command: "tool:notify_slack",
        defaultProfiles: ["messaging"],
        description: "Post a deployment summary to a team channel.",
        groupId: "automation",
        groupLabel: "Automation",
        id: "notify_slack",
        label: "Notify Slack",
        pluginId: "terminal-plus",
        risk: "medium",
        source: "plugin",
        status: "ready",
      },
      {
        access: "read",
        category: "filesystem",
        command: "tool:read_file",
        defaultProfiles: ["coding", "full"],
        description: "Read the contents of a file from the workspace.",
        groupId: "filesystem",
        groupLabel: "Filesystem",
        id: "read_file",
        inputSchema: {
          properties: {
            path: {
              description: "Absolute or workspace-relative path.",
              type: "string",
            },
          },
          required: ["path"],
          type: "object",
        },
        label: "Read File",
        risk: "low",
        source: "core",
        status: "ready",
      },
    ]);
  });

  it("filters tools by profile and compiles them into llm tool descriptors", () => {
    const descriptors = flattenToolCatalog(catalog);

    expect(
      filterToolCatalog(descriptors, {
        profile: "coding",
        query: "file",
      }).map((tool) => tool.id),
    ).toEqual(["read_file"]);

    expect(
      compileToolsForLlm(descriptors, {
        profile: "coding",
      }),
    ).toEqual([
      {
        id: "exec_command",
        name: "exec_command",
        type: "function",
      },
      {
        id: "read_file",
        name: "read_file",
        type: "builtin",
      },
    ]);
  });

  it("reduces tool execution events into a stable execution summary", () => {
    expect(
      reduceToolExecutionEvents([
        {
          at: 1_000,
          toolCallId: "tool-call-1",
          toolId: "read_file",
          type: "started",
        },
        {
          at: 1_200,
          delta: "Opening deployment.log",
          locations: ["deployment.log"],
          toolCallId: "tool-call-1",
          toolId: "read_file",
          type: "progress",
        },
        {
          at: 1_450,
          locations: ["deployment.log"],
          outputText: "Found rollback marker in deployment.log",
          toolCallId: "tool-call-1",
          toolId: "read_file",
          type: "completed",
        },
      ]),
    ).toEqual({
      completedAt: 1_450,
      durationMs: 450,
      lastOutputText: "Found rollback marker in deployment.log",
      locations: ["deployment.log"],
      startedAt: 1_000,
      status: "completed",
      toolCallId: "tool-call-1",
      toolId: "read_file",
    });
  });

  it("creates tools workspace manifests and route intents", () => {
    expect(
      createToolsWorkspaceManifest({
        packageNames: [
          "@sdkwork/tools-pc-react",
          "@sdkwork/llm-pc-react",
          "@sdkwork/tools-pc-react",
        ],
        title: "Tools",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "tools",
      description: "Tools workspace for catalog browsing, risk-aware selection, and execution summaries.",
      detailRoutePattern: "/tools/:toolId",
      executionRoutePattern: "/tools/executions/:toolCallId",
      host: "tauri",
      id: "sdkwork-tools",
      packageNames: ["@sdkwork/tools-pc-react", "@sdkwork/llm-pc-react"],
      routePath: "/tools",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Tools",
    });

    expect(
      createToolsDirectoryRouteIntent({
        access: "read",
        category: "filesystem",
      }),
    ).toEqual({
      access: "read",
      category: "filesystem",
      focusWindow: true,
      route: "/tools?access=read&category=filesystem",
      source: "tools-workspace",
      type: "tools-directory-route-intent",
    });

    expect(createToolDetailRouteIntent("read_file")).toEqual({
      focusWindow: true,
      route: "/tools/read_file",
      source: "tools-workspace",
      toolId: "read_file",
      type: "tool-detail-route-intent",
    });

    expect(createToolExecutionRouteIntent("tool-call-1")).toEqual({
      focusWindow: true,
      route: "/tools/executions/tool-call-1",
      source: "tools-workspace",
      toolCallId: "tool-call-1",
      type: "tool-execution-route-intent",
    });
  });
});
