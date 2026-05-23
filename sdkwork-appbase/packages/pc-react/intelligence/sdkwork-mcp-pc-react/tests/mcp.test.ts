import { describe, expect, it } from "vitest";
import {
  compileMcpServersForLlm,
  createMcpLibraryRouteIntent,
  createMcpServerDetailRouteIntent,
  createMcpWorkspaceManifest,
  filterMcpServerCatalog,
  flattenMcpServerCatalog,
  summarizeMcpServerCatalog,
} from "../src";

const catalog = {
  groups: [
    {
      id: "workspace",
      label: "Workspace",
      source: "workspace",
      servers: [
        {
          capabilities: ["tools", "resources"],
          description: "File and project access from the local workspace.",
          id: "filesystem",
          label: "Filesystem",
          transport: {
            args: ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
            command: "npx",
          },
        },
        {
          capabilities: ["resources"],
          description: "Remote docs exposed over streamable HTTP.",
          id: "remote-docs",
          label: "Remote Docs",
          transport: {
            url: "https://docs.sdkwork.ai/mcp",
          },
        },
        {
          capabilities: ["prompts"],
          description: "Broken placeholder server without transport.",
          id: "broken",
          label: "Broken",
          transport: {},
        },
      ],
    },
    {
      id: "bundles",
      label: "Bundles",
      source: "bundle",
      servers: [
        {
          capabilities: ["tools", "prompts"],
          description: "Packaged agent server from a plugin bundle.",
          id: "agent-skills",
          label: "Agent Skills",
          pluginId: "assistant-kit",
          transport: {
            command: "node",
          },
        },
        {
          capabilities: ["tools"],
          enabled: false,
          id: "legacy-disabled",
          label: "Legacy Disabled",
          transport: {
            command: "node",
          },
        },
      ],
    },
  ],
} as const;

describe("sdkwork-mcp-pc-react", () => {
  it("flattens MCP catalogs into readiness-aware descriptors with diagnostics", () => {
    const descriptors = flattenMcpServerCatalog(catalog);

    expect(descriptors).toEqual([
      {
        capabilities: [
          { kind: "tools", label: "Tools" },
          { kind: "prompts", label: "Prompts" },
        ],
        description: "Packaged agent server from a plugin bundle.",
        diagnostics: [],
        enabled: true,
        groupId: "bundles",
        groupLabel: "Bundles",
        id: "agent-skills",
        label: "Agent Skills",
        pluginId: "assistant-kit",
        readiness: "ready",
        source: "bundle",
        supportedTransport: true,
        transport: "stdio",
      },
      {
        capabilities: [{ kind: "prompts", label: "Prompts" }],
        description: "Broken placeholder server without transport.",
        diagnostics: [
          {
            code: "missing-transport",
            message: "MCP server broken does not declare a command or URL transport.",
          },
        ],
        enabled: true,
        groupId: "workspace",
        groupLabel: "Workspace",
        id: "broken",
        label: "Broken",
        readiness: "incomplete-config",
        source: "workspace",
        supportedTransport: false,
        transport: "unknown",
      },
      {
        capabilities: [
          { kind: "tools", label: "Tools" },
          { kind: "resources", label: "Resources" },
        ],
        description: "File and project access from the local workspace.",
        diagnostics: [],
        enabled: true,
        groupId: "workspace",
        groupLabel: "Workspace",
        id: "filesystem",
        label: "Filesystem",
        readiness: "ready",
        source: "workspace",
        supportedTransport: true,
        transport: "stdio",
      },
      {
        capabilities: [{ kind: "tools", label: "Tools" }],
        description: "Legacy Disabled",
        diagnostics: [],
        enabled: false,
        groupId: "bundles",
        groupLabel: "Bundles",
        id: "legacy-disabled",
        label: "Legacy Disabled",
        readiness: "disabled",
        source: "bundle",
        supportedTransport: true,
        transport: "stdio",
      },
      {
        capabilities: [{ kind: "resources", label: "Resources" }],
        description: "Remote docs exposed over streamable HTTP.",
        diagnostics: [
          {
            code: "unsupported-transport",
            message:
              "MCP server remote-docs uses streamable-http transport, but the current runtime only supports: stdio.",
          },
        ],
        enabled: true,
        groupId: "workspace",
        groupLabel: "Workspace",
        id: "remote-docs",
        label: "Remote Docs",
        readiness: "unsupported-transport",
        source: "workspace",
        supportedTransport: false,
        transport: "streamable-http",
      },
    ]);
  });

  it("filters, summarizes, and compiles ready MCP servers for llm registration", () => {
    const descriptors = flattenMcpServerCatalog(catalog);

    expect(
      filterMcpServerCatalog(descriptors, {
        capability: ["resources"],
        query: "remote",
        readiness: ["unsupported-transport"],
      }).map((server) => server.id),
    ).toEqual(["remote-docs"]);

    expect(summarizeMcpServerCatalog(descriptors)).toEqual({
      diagnosticCount: 2,
      readiness: {
        disabled: 1,
        "incomplete-config": 1,
        ready: 2,
        "unsupported-transport": 1,
      },
      supportedServerIds: ["agent-skills", "filesystem"],
      unsupportedServerIds: ["broken", "legacy-disabled", "remote-docs"],
    });

    expect(compileMcpServersForLlm(descriptors)).toEqual([
      {
        id: "agent-skills",
        name: "agent-skills",
        type: "mcp",
      },
      {
        id: "filesystem",
        name: "filesystem",
        type: "mcp",
      },
    ]);
  });

  it("creates MCP workspace manifests and route intents", () => {
    expect(
      createMcpWorkspaceManifest({
        packageNames: ["@sdkwork/mcp-pc-react", "@sdkwork/llm-pc-react", "@sdkwork/mcp-pc-react"],
        title: "MCP",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "mcp",
      description: "MCP workspace for server catalogs, transport readiness, and capability-aware routing.",
      detailRoutePattern: "/mcp/:serverId",
      host: "tauri",
      id: "sdkwork-mcp",
      packageNames: ["@sdkwork/mcp-pc-react", "@sdkwork/llm-pc-react"],
      routePath: "/mcp",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "MCP",
    });

    expect(
      createMcpLibraryRouteIntent({
        capability: "resources",
        readiness: "ready",
        transport: "stdio",
      }),
    ).toEqual({
      capability: "resources",
      focusWindow: true,
      readiness: "ready",
      route: "/mcp?capability=resources&transport=stdio&readiness=ready",
      source: "mcp-workspace",
      transport: "stdio",
      type: "mcp-library-route-intent",
    });

    expect(createMcpServerDetailRouteIntent("filesystem")).toEqual({
      focusWindow: true,
      route: "/mcp/filesystem",
      serverId: "filesystem",
      source: "mcp-workspace",
      type: "mcp-server-detail-route-intent",
    });
  });
});
