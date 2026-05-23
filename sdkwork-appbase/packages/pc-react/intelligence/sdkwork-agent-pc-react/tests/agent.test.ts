import { describe, expect, it } from "vitest";
import {
  buildAgentRuntimePolicyInput,
  createAgentDirectoryDigest,
  createAgentDetailRouteIntent,
  createAgentDirectoryRouteIntent,
  createAgentLaunchPlan,
  createAgentWorkspaceManifest,
  evaluateAgentExecutionReadiness,
  evaluateAgentReadiness,
  filterAgentCatalog,
  selectDefaultAgent,
  summarizeAgentDirectoryDigests,
  summarizeAgentCapabilities,
} from "../src";

const NOW = 1_710_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

const promptAssets = [
  { id: "agent-research" },
  { id: "agent-notes" },
  { id: "agent-release" },
  { id: "agent-github" },
  { id: "agent-support" },
] as const;

const promptCatalog = [
  {
    id: "agent-research",
    kind: "agent",
    name: "Research Director Prompt",
    summary: "Drives research programs with structured operating rules.",
    tags: ["research"],
    variables: [
      {
        defaultValue: "Research",
        id: "team",
        label: "Team",
        required: false,
        type: "string",
      },
      {
        id: "objective",
        label: "Objective",
        required: true,
        type: "string",
      },
    ],
    versions: [
      {
        createdAt: NOW - DAY,
        id: "agent-research-v1",
        labels: ["prod"],
        messages: [
          {
            id: "agent-research-message",
            role: "system",
            template: "Lead the {{team}} program on {{objective}}.",
          },
        ],
        status: "published",
        version: 1,
      },
    ],
    visibility: "shared",
  },
  {
    id: "agent-release",
    kind: "agent",
    name: "Release Operator Prompt",
    summary: "Coordinates guarded release execution.",
    tags: ["ops"],
    variables: [
      {
        defaultValue: "current release",
        id: "release",
        label: "Release",
        required: false,
        type: "string",
      },
    ],
    versions: [
      {
        createdAt: NOW - 2 * DAY,
        id: "agent-release-v2",
        labels: ["staging"],
        messages: [
          {
            id: "agent-release-message",
            role: "system",
            template: "Coordinate {{release}} with rollback guardrails.",
          },
        ],
        status: "draft",
        version: 2,
      },
    ],
    visibility: "private",
  },
] as const;

const skills = [
  {
    category: "Development",
    description: "Reviews pull requests from the command palette.",
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
    tags: ["github"],
    triggers: [
      {
        id: "command-review-pr",
        kind: "command",
        label: "Review pull request",
      },
    ],
    updatedAt: NOW - DAY,
  },
  {
    category: "Knowledge",
    description: "Summarizes local notes but still needs setup.",
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
        id: "shortcut-notes",
        kind: "shortcut",
        label: "Notes shortcut",
      },
    ],
    updatedAt: NOW - 2 * DAY,
  },
] as const;

const tools = [
  {
    access: "read",
    category: "observability",
    command: "tool:web.search",
    defaultProfiles: [],
    description: "Search the web.",
    groupId: "core",
    groupLabel: "Core",
    id: "web.search",
    label: "Web Search",
    risk: "low",
    source: "core",
    status: "ready",
  },
  {
    access: "write",
    category: "automation",
    command: "tool:deploy.exec",
    defaultProfiles: [],
    description: "Deploy the active release.",
    groupId: "ops",
    groupLabel: "Operations",
    id: "deploy.exec",
    label: "Deploy Exec",
    risk: "medium",
    source: "plugin",
    status: "disabled",
  },
] as const;

const executableTools = [
  tools[0],
  {
    ...tools[1],
    status: "ready",
  },
] as const;

const mcpServers = [
  {
    capabilities: [{ kind: "tools", label: "Tools" }],
    description: "GitHub MCP bridge",
    diagnostics: [],
    enabled: true,
    groupId: "workspace",
    groupLabel: "Workspace",
    id: "github-mcp",
    label: "GitHub MCP",
    readiness: "ready",
    source: "workspace",
    supportedTransport: true,
    transport: "stdio",
  },
  {
    capabilities: [{ kind: "tools", label: "Tools" }],
    description: "Release orchestration bridge",
    diagnostics: [],
    enabled: true,
    groupId: "workspace",
    groupLabel: "Workspace",
    id: "release-hub",
    label: "Release Hub",
    readiness: "unsupported-transport",
    source: "workspace",
    supportedTransport: false,
    transport: "streamable-http",
  },
] as const;

const knowledgeSpaces = [
  {
    id: "product-docs",
    name: "Product Docs",
    tags: ["product"],
    updatedAt: NOW - DAY,
    visibility: "workspace",
  },
] as const;

const agents = [
  {
    automationFitScore: 95,
    description: "Synthesizes evidence into product direction.",
    fallbackModelIds: ["openai/gpt-4.1"],
    focusAreas: ["Research", "Strategy"],
    id: "research-director",
    isDefault: true,
    knowledgeSpaceIds: ["product-docs"],
    maxToolCalls: 12,
    mcpServerIds: ["github-mcp"],
    memoryScopes: ["user", "workspace"],
    name: "Research Director",
    preferredModelId: "anthropic/claude-3-7-sonnet",
    promptAssetId: "agent-research",
    skillIds: ["github-pr"],
    tags: ["research"],
    toolIds: ["web.search"],
    updatedAt: NOW - DAY,
  },
  {
    automationFitScore: 84,
    description: "Triages support issues from multiple queues.",
    fallbackModelIds: [],
    focusAreas: ["Support"],
    id: "support-triage",
    isDefault: false,
    knowledgeSpaceIds: [],
    mcpServerIds: [],
    memoryScopes: ["session"],
    name: "Support Triage",
    promptAssetId: "agent-support",
    skillIds: [],
    tags: ["support"],
    toolIds: [],
    updatedAt: NOW - 2 * DAY,
  },
  {
    automationFitScore: 80,
    description: "Turns note fragments into action items.",
    fallbackModelIds: [],
    focusAreas: ["Knowledge"],
    id: "notes-coach",
    isDefault: false,
    knowledgeSpaceIds: [],
    mcpServerIds: [],
    memoryScopes: ["user"],
    name: "Notes Coach",
    preferredModelId: "openai/gpt-4.1-mini",
    promptAssetId: "agent-notes",
    skillIds: ["local-notes"],
    tags: ["notes"],
    toolIds: ["web.search"],
    updatedAt: NOW - 3 * DAY,
  },
  {
    automationFitScore: 78,
    description: "Coordinates release execution under policy guardrails.",
    fallbackModelIds: [],
    focusAreas: ["Operations"],
    id: "release-operator",
    isDefault: false,
    knowledgeSpaceIds: [],
    mcpServerIds: [],
    memoryScopes: ["workspace"],
    name: "Release Operator",
    preferredModelId: "openai/gpt-4.1",
    promptAssetId: "agent-release",
    skillIds: [],
    tags: ["ops"],
    toolIds: ["deploy.exec"],
    updatedAt: NOW - 4 * DAY,
  },
  {
    automationFitScore: 76,
    description: "Coordinates GitHub workflows through MCP.",
    fallbackModelIds: [],
    focusAreas: ["Coordination"],
    id: "github-orchestrator",
    isDefault: false,
    knowledgeSpaceIds: [],
    mcpServerIds: ["release-hub"],
    memoryScopes: ["workspace"],
    name: "GitHub Orchestrator",
    preferredModelId: "openai/gpt-4.1",
    promptAssetId: "agent-github",
    skillIds: [],
    tags: ["coordination"],
    toolIds: ["web.search"],
    updatedAt: NOW - 5 * DAY,
  },
  {
    automationFitScore: 74,
    description: "Keeps ad hoc support requests moving.",
    fallbackModelIds: [],
    focusAreas: ["Support"],
    id: "promptless-ops",
    isDefault: false,
    knowledgeSpaceIds: [],
    mcpServerIds: [],
    memoryScopes: ["session"],
    name: "Promptless Ops",
    preferredModelId: "openai/gpt-4.1-mini",
    skillIds: [],
    tags: ["ops"],
    toolIds: [],
    updatedAt: NOW - 6 * DAY,
  },
] as const;

describe("sdkwork-agent-pc-react", () => {
  it("selects the effective default agent and derives readiness from lower-level resources", () => {
    expect(selectDefaultAgent(agents)?.id).toBe("research-director");
    expect(selectDefaultAgent(agents, "support-triage")?.id).toBe("support-triage");

    expect(
      evaluateAgentReadiness(agents[0], {
        knowledgeSpaces,
        mcpServers,
        prompts: promptAssets,
        skills,
        tools,
      }),
    ).toBe("ready");
    expect(evaluateAgentReadiness(agents[1], { prompts: promptAssets, skills, tools, mcpServers })).toBe("missing-model");
    expect(evaluateAgentReadiness(agents[2], { prompts: promptAssets, skills, tools, mcpServers })).toBe("missing-skills");
    expect(evaluateAgentReadiness(agents[3], { prompts: promptAssets, skills, tools, mcpServers })).toBe("missing-tools");
    expect(evaluateAgentReadiness(agents[4], { prompts: promptAssets, skills, tools, mcpServers })).toBe("missing-mcp");
    expect(evaluateAgentReadiness(agents[5], { prompts: promptAssets, skills, tools, mcpServers })).toBe("missing-prompt");
  });

  it("summarizes capability shape and filters the agent catalog", () => {
    expect(summarizeAgentCapabilities(agents[0])).toEqual({
      automationFitScore: 95,
      fallbackModelCount: 1,
      focusAreaCount: 2,
      knowledgeSpaceCount: 1,
      mcpServerCount: 1,
      memoryScopeCount: 2,
      skillCount: 1,
      toolCount: 1,
    });

    expect(
      filterAgentCatalog(
        agents,
        {
          focusAreas: ["Research"],
          query: "research",
          readiness: ["ready"],
        },
        {
          knowledgeSpaces,
          mcpServers,
          prompts: promptAssets,
          skills,
          tools,
        },
      ).map((agent) => agent.id),
    ).toEqual(["research-director"]);
  });

  it("creates agent directory digests and summarizes the directory surface", () => {
    expect(
      createAgentDirectoryDigest(agents[0], {
        knowledgeSpaces,
        mcpServers,
        prompts: promptAssets,
        skills,
        tools,
      }),
    ).toEqual({
      automationFitScore: 95,
      focusAreaCount: 2,
      id: "research-director",
      isDefault: true,
      knowledgeSpaceCount: 1,
      mcpServerCount: 1,
      memoryScopeCount: 2,
      name: "Research Director",
      preferredModelId: "anthropic/claude-3-7-sonnet",
      promptAssetId: "agent-research",
      readiness: "ready",
      skillCount: 1,
      tagCount: 1,
      toolCount: 1,
      updatedAt: NOW - DAY,
    });

    expect(
      summarizeAgentDirectoryDigests(
        agents.map((agent) =>
          createAgentDirectoryDigest(agent, {
            knowledgeSpaces,
            mcpServers,
            prompts: promptAssets,
            skills,
            tools,
          }),
        ),
      ),
    ).toEqual({
      agentsWithKnowledge: 1,
      agentsWithMcp: 2,
      agentsWithSkills: 2,
      agentsWithTools: 4,
      defaultAgents: 1,
      latestUpdatedAt: NOW - DAY,
      readyAgents: 1,
      totalAgents: 6,
      totalFocusAreas: 7,
      totalTags: 6,
    });
  });

  it("creates agent launch plans from runtime policy and compiled prompts", () => {
    expect(
      createAgentLaunchPlan(agents[0], {
        knowledgeSpaces,
        mcpServers,
        promptCatalog,
        prompts: promptAssets,
        promptValues: {
          objective: "Q2 desktop AI strategy",
        },
        skills,
        tools,
      }),
    ).toEqual({
      agentId: "research-director",
      automationFitScore: 95,
      focusAreas: ["Research", "Strategy"],
      prompt: {
        assetId: "agent-research",
        messages: [
          {
            parts: [
              {
                text: "Lead the Research program on Q2 desktop AI strategy.",
                type: "text",
              },
            ],
            role: "system",
          },
        ],
        missingVariables: [],
        ready: true,
        usedVariables: ["team", "objective"],
        version: 1,
        versionId: "agent-research-v1",
      },
      promptStatus: "published",
      runtimePolicy: {
        agentId: "research-director",
        fallbackModelIds: ["openai/gpt-4.1"],
        knowledgeSpaceIds: ["product-docs"],
        maxToolCalls: 12,
        mcpServerIds: ["github-mcp"],
        memoryScopes: ["user", "workspace"],
        preferredModelId: "anthropic/claude-3-7-sonnet",
        promptAssetId: "agent-research",
        skillIds: ["github-pr"],
        toolIds: ["web.search"],
      },
      tags: ["research"],
    });
  });

  it("evaluates agent execution readiness with prompt-aware blocking and degraded states", () => {
    expect(
      evaluateAgentExecutionReadiness(agents[0], {
        knowledgeSpaces,
        mcpServers,
        promptCatalog,
        prompts: promptAssets,
        skills,
        tools,
      }),
    ).toEqual({
      degraded: false,
      issues: ["missing-prompt-variables"],
      launchPlan: {
        agentId: "research-director",
        automationFitScore: 95,
        focusAreas: ["Research", "Strategy"],
        prompt: {
          assetId: "agent-research",
          messages: [
            {
              parts: [
                {
                  text: "Lead the Research program on {{objective}}.",
                  type: "text",
                },
              ],
              role: "system",
            },
          ],
          missingVariables: ["objective"],
          ready: false,
          usedVariables: ["team", "objective"],
          version: 1,
          versionId: "agent-research-v1",
        },
        promptStatus: "published",
        runtimePolicy: {
          agentId: "research-director",
          fallbackModelIds: ["openai/gpt-4.1"],
          knowledgeSpaceIds: ["product-docs"],
          maxToolCalls: 12,
          mcpServerIds: ["github-mcp"],
          memoryScopes: ["user", "workspace"],
          preferredModelId: "anthropic/claude-3-7-sonnet",
          promptAssetId: "agent-research",
          skillIds: ["github-pr"],
          toolIds: ["web.search"],
        },
        tags: ["research"],
      },
      ready: false,
    });

    expect(
      evaluateAgentExecutionReadiness(agents[3], {
        mcpServers,
        promptCatalog,
        prompts: promptAssets,
        promptValues: {
          release: "2026.04",
        },
        skills,
        tools: executableTools,
      }),
    ).toEqual({
      degraded: true,
      issues: ["draft-prompt"],
      launchPlan: {
        agentId: "release-operator",
        automationFitScore: 78,
        focusAreas: ["Operations"],
        prompt: {
          assetId: "agent-release",
          messages: [
            {
              parts: [
                {
                  text: "Coordinate 2026.04 with rollback guardrails.",
                  type: "text",
                },
              ],
              role: "system",
            },
          ],
          missingVariables: [],
          ready: true,
          usedVariables: ["release"],
          version: 2,
          versionId: "agent-release-v2",
        },
        promptStatus: "draft",
        runtimePolicy: {
          agentId: "release-operator",
          fallbackModelIds: [],
          knowledgeSpaceIds: [],
          maxToolCalls: 8,
          mcpServerIds: [],
          memoryScopes: ["workspace"],
          preferredModelId: "openai/gpt-4.1",
          promptAssetId: "agent-release",
          skillIds: [],
          toolIds: ["deploy.exec"],
        },
        tags: ["ops"],
      },
      ready: true,
    });
  });

  it("builds runtime policy inputs plus workspace manifests and route intents", () => {
    expect(
      buildAgentRuntimePolicyInput(agents[0], {
        knowledgeSpaces,
        mcpServers,
        prompts: promptAssets,
        skills,
        tools,
      }),
    ).toEqual({
      agentId: "research-director",
      fallbackModelIds: ["openai/gpt-4.1"],
      knowledgeSpaceIds: ["product-docs"],
      maxToolCalls: 12,
      mcpServerIds: ["github-mcp"],
      memoryScopes: ["user", "workspace"],
      preferredModelId: "anthropic/claude-3-7-sonnet",
      promptAssetId: "agent-research",
      skillIds: ["github-pr"],
      toolIds: ["web.search"],
    });

    expect(
      createAgentWorkspaceManifest({
        packageNames: ["@sdkwork/agent-pc-react", "@sdkwork/agent-pc-react"],
        title: "Agents",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "agent",
      description: "Agent workspace for manifests, readiness evaluation, and runtime policy routing.",
      detailRoutePattern: "/agents/:agentId",
      host: "tauri",
      id: "sdkwork-agent",
      packageNames: ["@sdkwork/agent-pc-react"],
      routePath: "/agents",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Agents",
    });

    expect(
      createAgentDirectoryRouteIntent({
        focusArea: "Research",
        readiness: "ready",
      }),
    ).toEqual({
      focusArea: "Research",
      focusWindow: true,
      readiness: "ready",
      route: "/agents?focus=Research&readiness=ready",
      source: "agent-workspace",
      type: "agent-directory-route-intent",
    });

    expect(createAgentDetailRouteIntent("research-director")).toEqual({
      agentId: "research-director",
      focusWindow: true,
      route: "/agents/research-director",
      source: "agent-workspace",
      type: "agent-detail-route-intent",
    });
  });
});
