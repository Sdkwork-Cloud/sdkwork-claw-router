import { describe, expect, it } from "vitest";
import {
  buildWorkflowLaunchBlueprint,
  buildWorkflowExecutionPlan,
  createWorkflowDigest,
  createWorkflowDetailRouteIntent,
  createWorkflowLibraryRouteIntent,
  createWorkflowRunRouteIntent,
  createWorkflowWorkspaceManifest,
  evaluateWorkflowExecutionReadiness,
  evaluateWorkflowReadiness,
  filterWorkflowCatalog,
  reduceWorkflowExecutionEvents,
  summarizeWorkflowDigests,
  summarizeWorkflowTopology,
} from "../src";

const NOW = 1_710_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

const promptAssets = [
  { id: "workflow-kickoff" },
  { id: "agent-plan" },
  { id: "workflow-draft" },
] as const;

const promptCatalog = [
  {
    id: "workflow-kickoff",
    kind: "workflow",
    name: "Workflow Kickoff Prompt",
    summary: "Starts the workflow with release framing.",
    tags: ["release"],
    variables: [
      {
        id: "releaseName",
        label: "Release Name",
        required: true,
        type: "string",
      },
    ],
    versions: [
      {
        createdAt: NOW - DAY,
        id: "workflow-kickoff-v1",
        labels: ["prod"],
        messages: [
          {
            id: "workflow-kickoff-message",
            role: "system",
            template: "Start orchestration for {{releaseName}}.",
          },
        ],
        status: "published",
        version: 1,
      },
    ],
    visibility: "shared",
  },
  {
    id: "agent-plan",
    kind: "agent",
    name: "Agent Plan Prompt",
    summary: "Guides the research agent toward an execution plan.",
    tags: ["agent"],
    variables: [
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
        id: "agent-plan-v1",
        labels: ["prod"],
        messages: [
          {
            id: "agent-plan-message",
            role: "system",
            template: "Produce a release plan for {{objective}}.",
          },
        ],
        status: "published",
        version: 1,
      },
    ],
    visibility: "shared",
  },
  {
    id: "workflow-draft",
    kind: "workflow",
    name: "Workflow Draft Prompt",
    summary: "Draft workflow kickoff used for staging experiments.",
    tags: ["draft"],
    variables: [],
    versions: [
      {
        createdAt: NOW - 2 * DAY,
        id: "workflow-draft-v1",
        labels: ["staging"],
        messages: [
          {
            id: "workflow-draft-message",
            role: "system",
            template: "Run the draft release automation flow.",
          },
        ],
        status: "draft",
        version: 1,
      },
    ],
    visibility: "private",
  },
] as const;

const skills = [
  {
    category: "Operations",
    description: "Publishes the workflow output into the release channel.",
    enabled: true,
    id: "publish-report",
    installState: "installed",
    missing: {
      bins: [],
      config: [],
      env: [],
    },
    name: "Publish Report",
    reusePolicy: "workflow-only",
    scope: "workspace",
    tags: ["release"],
    triggers: [
      {
        id: "manual-publish",
        kind: "manual",
        label: "Manual publish",
      },
    ],
    updatedAt: NOW - DAY,
  },
] as const;

const tools = [
  {
    access: "read",
    category: "observability",
    command: "tool:web.search",
    defaultProfiles: ["coding"],
    description: "Searches the web for release context.",
    groupId: "core",
    groupLabel: "Core",
    id: "web.search",
    label: "Web Search",
    risk: "low",
    source: "core",
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
    description: "Synthesizes evidence into a release-ready plan.",
    fallbackModelIds: ["openai/gpt-4.1"],
    focusAreas: ["Operations", "Research"],
    id: "research-director",
    knowledgeSpaceIds: ["product-docs"],
    maxToolCalls: 8,
    mcpServerIds: ["github-mcp"],
    memoryScopes: ["workspace"],
    name: "Research Director",
    preferredModelId: "anthropic/claude-3-7-sonnet",
    promptAssetId: "agent-plan",
    skillIds: ["publish-report"],
    tags: ["ops"],
    toolIds: ["web.search"],
    updatedAt: NOW - DAY,
  },
] as const;

const releaseWorkflow = {
  automationFitScore: 96,
  concurrencyLimit: 1,
  description: "Collects context, drafts a release plan, and routes human approval before publish.",
  edges: [
    {
      from: "kickoff",
      id: "edge-kickoff-research",
      outcome: "default",
      to: "research",
    },
    {
      from: "research",
      id: "edge-research-mcp",
      outcome: "success",
      to: "repo-context",
    },
    {
      from: "repo-context",
      id: "edge-mcp-knowledge",
      outcome: "success",
      to: "docs-context",
    },
    {
      from: "docs-context",
      id: "edge-knowledge-memory",
      outcome: "success",
      to: "workspace-memory",
    },
    {
      from: "workspace-memory",
      id: "edge-memory-tool",
      outcome: "success",
      to: "search",
    },
    {
      from: "search",
      id: "edge-tool-condition",
      outcome: "success",
      to: "needs-review",
    },
    {
      from: "needs-review",
      id: "edge-condition-approval",
      outcome: "matched",
      to: "human-review",
    },
    {
      from: "needs-review",
      id: "edge-condition-publish",
      outcome: "unmatched",
      to: "publish",
    },
    {
      from: "human-review",
      id: "edge-approval-publish",
      outcome: "approved",
      to: "publish",
    },
    {
      from: "human-review",
      id: "edge-approval-retry",
      outcome: "rejected",
      to: "research",
    },
  ],
  entryNodeId: "kickoff",
  id: "release-automation",
  name: "Release Automation",
  nodes: [
    {
      id: "kickoff",
      kind: "prompt",
      label: "Kickoff Prompt",
      promptAssetId: "workflow-kickoff",
    },
    {
      agentId: "research-director",
      id: "research",
      kind: "agent",
      label: "Research Director",
    },
    {
      id: "repo-context",
      kind: "mcp",
      label: "GitHub MCP",
      mcpServerId: "github-mcp",
    },
    {
      id: "docs-context",
      kind: "knowledge",
      knowledgeSpaceId: "product-docs",
      label: "Docs Context",
    },
    {
      id: "workspace-memory",
      kind: "memory",
      label: "Workspace Memory",
      memoryScope: "workspace",
    },
    {
      id: "search",
      kind: "tool",
      label: "Web Search",
      toolId: "web.search",
    },
    {
      expression: "score >= 0.8",
      id: "needs-review",
      kind: "condition",
      label: "Needs Approval?",
    },
    {
      approvalKey: "release-manager",
      id: "human-review",
      kind: "approval",
      label: "Human Review",
      policy: "any",
    },
    {
      id: "publish",
      kind: "skill",
      label: "Publish Report",
      skillId: "publish-report",
    },
  ],
  runPolicy: "queue",
  tags: ["ops", "release"],
  triggers: [
    {
      id: "manual-start",
      kind: "manual",
      label: "Run now",
    },
    {
      id: "nightly-release",
      kind: "schedule",
      label: "Nightly release",
      schedule: "0 2 * * *",
      timezone: "UTC",
    },
  ],
  updatedAt: NOW - DAY,
  version: 1,
} as const;

const supportWorkflow = {
  automationFitScore: 72,
  description: "Routes inbound support tickets through a lightweight triage loop.",
  edges: [
    {
      from: "triage-prompt",
      id: "edge-triage-publish",
      outcome: "default",
      to: "triage-skill",
    },
  ],
  entryNodeId: "triage-prompt",
  id: "support-intake-loop",
  name: "Support Intake Loop",
  nodes: [
    {
      id: "triage-prompt",
      kind: "prompt",
      label: "Triage Prompt",
      promptAssetId: "workflow-kickoff",
    },
    {
      id: "triage-skill",
      kind: "skill",
      label: "Publish Report",
      skillId: "publish-report",
    },
  ],
  tags: ["support"],
  triggers: [
    {
      id: "support-webhook",
      kind: "webhook",
      label: "Inbound webhook",
      webhookPath: "/support/intake",
    },
  ],
  updatedAt: NOW - 2 * DAY,
  version: 1,
} as const;

const workflowDependencies = {
  agents,
  knowledgeSpaces,
  mcpServers,
  prompts: promptAssets,
  skills,
  tools,
} as const;

describe("sdkwork-workflow-pc-react", () => {
  it("derives workflow readiness from graph structure and lower-level dependencies", () => {
    expect(evaluateWorkflowReadiness(releaseWorkflow, workflowDependencies)).toBe("ready");
    expect(
      evaluateWorkflowReadiness(releaseWorkflow, {
        ...workflowDependencies,
        agents: [],
      }),
    ).toBe("missing-agent");
    expect(
      evaluateWorkflowReadiness(releaseWorkflow, {
        ...workflowDependencies,
        agents: [
          {
            ...agents[0],
            preferredModelId: undefined,
          },
        ],
      }),
    ).toBe("missing-model");
    expect(
      evaluateWorkflowReadiness(releaseWorkflow, {
        ...workflowDependencies,
        prompts: [{ id: "agent-plan" }],
      }),
    ).toBe("missing-prompt");
    expect(
      evaluateWorkflowReadiness(releaseWorkflow, {
        ...workflowDependencies,
        skills: [],
      }),
    ).toBe("missing-skills");
    expect(
      evaluateWorkflowReadiness(releaseWorkflow, {
        ...workflowDependencies,
        tools: [],
      }),
    ).toBe("missing-tools");
    expect(
      evaluateWorkflowReadiness(releaseWorkflow, {
        ...workflowDependencies,
        mcpServers: [],
      }),
    ).toBe("missing-mcp");
    expect(
      evaluateWorkflowReadiness(releaseWorkflow, {
        ...workflowDependencies,
        knowledgeSpaces: [],
      }),
    ).toBe("missing-knowledge");
    expect(
      evaluateWorkflowReadiness(
        {
          ...releaseWorkflow,
          nodes: [
            ...releaseWorkflow.nodes,
            {
              id: "orphan",
              kind: "skill",
              label: "Orphaned Skill",
              skillId: "publish-report",
            },
          ],
        },
        workflowDependencies,
      ),
    ).toBe("invalid-graph");
  });

  it("summarizes workflow topology and filters the workflow catalog", () => {
    expect(summarizeWorkflowTopology(releaseWorkflow)).toEqual({
      agentCount: 1,
      approvalNodeCount: 1,
      edgeCount: 10,
      hasCycles: true,
      keyCounts: {
        agent: 1,
        approval: 1,
        condition: 1,
        knowledge: 1,
        mcp: 1,
        memory: 1,
        prompt: 1,
        skill: 1,
        tool: 1,
      },
      knowledgeCount: 1,
      mcpCount: 1,
      memoryScopeCount: 1,
      nodeCount: 9,
      promptCount: 1,
      reachableNodeCount: 9,
      skillCount: 1,
      toolCount: 1,
      triggerCount: 2,
      unreachableNodeCount: 0,
    });

    expect(
      filterWorkflowCatalog(
        [supportWorkflow, releaseWorkflow],
        {
          query: "release",
          readiness: ["ready"],
          tags: ["ops"],
          triggerKinds: ["schedule"],
        },
        workflowDependencies,
      ).map((workflow) => workflow.id),
    ).toEqual(["release-automation"]);
  });

  it("creates workflow digests and summarizes workflow directories", () => {
    expect(createWorkflowDigest(releaseWorkflow, workflowDependencies)).toEqual({
      automationFitScore: 96,
      hasApproval: true,
      hasCycles: true,
      id: "release-automation",
      name: "Release Automation",
      nodeCount: 9,
      readiness: "ready",
      runPolicy: "queue",
      triggerKinds: ["manual", "schedule"],
      updatedAt: NOW - DAY,
      version: 1,
    });

    expect(
      summarizeWorkflowDigests([
        createWorkflowDigest(releaseWorkflow, workflowDependencies),
        createWorkflowDigest(supportWorkflow, workflowDependencies),
      ]),
    ).toEqual({
      latestUpdatedAt: NOW - DAY,
      readyWorkflows: 2,
      totalNodes: 11,
      totalTriggers: 3,
      totalWorkflows: 2,
      uniqueTriggerKindCount: 3,
      workflowsWithApprovals: 1,
      workflowsWithSchedules: 1,
      workflowsWithWebhooks: 1,
    });
  });

  it("builds a deterministic execution plan with deduplicated dependency ids", () => {
    expect(buildWorkflowExecutionPlan(releaseWorkflow, workflowDependencies)).toEqual({
      adjacency: {
        "docs-context": ["workspace-memory"],
        "human-review": ["publish", "research"],
        kickoff: ["research"],
        "needs-review": ["human-review", "publish"],
        publish: [],
        "repo-context": ["docs-context"],
        research: ["repo-context"],
        search: ["needs-review"],
        "workspace-memory": ["search"],
      },
      approvalNodeIds: ["human-review"],
      dependencyIds: {
        agentIds: ["research-director"],
        knowledgeSpaceIds: ["product-docs"],
        mcpServerIds: ["github-mcp"],
        memoryScopes: ["workspace"],
        promptAssetIds: ["agent-plan", "workflow-kickoff"],
        skillIds: ["publish-report"],
        toolIds: ["web.search"],
      },
      entryNodeId: "kickoff",
      hasCycles: true,
      nodeOrder: [
        "kickoff",
        "research",
        "repo-context",
        "docs-context",
        "workspace-memory",
        "search",
        "needs-review",
        "human-review",
        "publish",
      ],
      runPolicy: "queue",
      triggerKinds: ["manual", "schedule"],
      workflowId: "release-automation",
    });
  });

  it("builds workflow launch blueprints with compiled prompt entries and agent launch plans", () => {
    expect(
      buildWorkflowLaunchBlueprint(releaseWorkflow, {
        ...workflowDependencies,
        promptCatalog,
        promptValuesByAssetId: {
          "agent-plan": {
            objective: "April Release",
          },
          "workflow-kickoff": {
            releaseName: "April Release",
          },
        },
      }),
    ).toEqual({
      agentLaunchPlans: [
        {
          agentId: "research-director",
          launchPlan: {
            agentId: "research-director",
            automationFitScore: 95,
            focusAreas: ["Operations", "Research"],
            prompt: {
              assetId: "agent-plan",
              messages: [
                {
                  parts: [
                    {
                      text: "Produce a release plan for April Release.",
                      type: "text",
                    },
                  ],
                  role: "system",
                },
              ],
              missingVariables: [],
              ready: true,
              usedVariables: ["objective"],
              version: 1,
              versionId: "agent-plan-v1",
            },
            promptStatus: "published",
            runtimePolicy: {
              agentId: "research-director",
              fallbackModelIds: ["openai/gpt-4.1"],
              knowledgeSpaceIds: ["product-docs"],
              maxToolCalls: 8,
              mcpServerIds: ["github-mcp"],
              memoryScopes: ["workspace"],
              preferredModelId: "anthropic/claude-3-7-sonnet",
              promptAssetId: "agent-plan",
              skillIds: ["publish-report"],
              toolIds: ["web.search"],
            },
            tags: ["ops"],
          },
          nodeId: "research",
        },
      ],
      executionPlan: {
        adjacency: {
          "docs-context": ["workspace-memory"],
          "human-review": ["publish", "research"],
          kickoff: ["research"],
          "needs-review": ["human-review", "publish"],
          publish: [],
          "repo-context": ["docs-context"],
          research: ["repo-context"],
          search: ["needs-review"],
          "workspace-memory": ["search"],
        },
        approvalNodeIds: ["human-review"],
        dependencyIds: {
          agentIds: ["research-director"],
          knowledgeSpaceIds: ["product-docs"],
          mcpServerIds: ["github-mcp"],
          memoryScopes: ["workspace"],
          promptAssetIds: ["agent-plan", "workflow-kickoff"],
          skillIds: ["publish-report"],
          toolIds: ["web.search"],
        },
        entryNodeId: "kickoff",
        hasCycles: true,
        nodeOrder: [
          "kickoff",
          "research",
          "repo-context",
          "docs-context",
          "workspace-memory",
          "search",
          "needs-review",
          "human-review",
          "publish",
        ],
        runPolicy: "queue",
        triggerKinds: ["manual", "schedule"],
        workflowId: "release-automation",
      },
      promptEntries: [
        {
          nodeId: "kickoff",
          prompt: {
            assetId: "workflow-kickoff",
            messages: [
              {
                parts: [
                  {
                    text: "Start orchestration for April Release.",
                    type: "text",
                  },
                ],
                role: "system",
              },
            ],
            missingVariables: [],
            ready: true,
            usedVariables: ["releaseName"],
            version: 1,
            versionId: "workflow-kickoff-v1",
          },
          promptAssetId: "workflow-kickoff",
          promptStatus: "published",
        },
      ],
    });
  });

  it("evaluates workflow execution readiness with blocking and degraded prompt states", () => {
    expect(
      evaluateWorkflowExecutionReadiness(releaseWorkflow, {
        ...workflowDependencies,
        promptCatalog,
        promptValuesByAssetId: {
          "workflow-kickoff": {
            releaseName: "April Release",
          },
        },
      }),
    ).toEqual({
      blueprint: {
        agentLaunchPlans: [
          {
            agentId: "research-director",
            launchPlan: {
              agentId: "research-director",
              automationFitScore: 95,
              focusAreas: ["Operations", "Research"],
              prompt: {
                assetId: "agent-plan",
                messages: [
                  {
                    parts: [
                      {
                        text: "Produce a release plan for {{objective}}.",
                        type: "text",
                      },
                    ],
                    role: "system",
                  },
                ],
                missingVariables: ["objective"],
                ready: false,
                usedVariables: ["objective"],
                version: 1,
                versionId: "agent-plan-v1",
              },
              promptStatus: "published",
              runtimePolicy: {
                agentId: "research-director",
                fallbackModelIds: ["openai/gpt-4.1"],
                knowledgeSpaceIds: ["product-docs"],
                maxToolCalls: 8,
                mcpServerIds: ["github-mcp"],
                memoryScopes: ["workspace"],
                preferredModelId: "anthropic/claude-3-7-sonnet",
                promptAssetId: "agent-plan",
                skillIds: ["publish-report"],
                toolIds: ["web.search"],
              },
              tags: ["ops"],
            },
            nodeId: "research",
          },
        ],
        executionPlan: {
          adjacency: {
            "docs-context": ["workspace-memory"],
            "human-review": ["publish", "research"],
            kickoff: ["research"],
            "needs-review": ["human-review", "publish"],
            publish: [],
            "repo-context": ["docs-context"],
            research: ["repo-context"],
            search: ["needs-review"],
            "workspace-memory": ["search"],
          },
          approvalNodeIds: ["human-review"],
          dependencyIds: {
            agentIds: ["research-director"],
            knowledgeSpaceIds: ["product-docs"],
            mcpServerIds: ["github-mcp"],
            memoryScopes: ["workspace"],
            promptAssetIds: ["agent-plan", "workflow-kickoff"],
            skillIds: ["publish-report"],
            toolIds: ["web.search"],
          },
          entryNodeId: "kickoff",
          hasCycles: true,
          nodeOrder: [
            "kickoff",
            "research",
            "repo-context",
            "docs-context",
            "workspace-memory",
            "search",
            "needs-review",
            "human-review",
            "publish",
          ],
          runPolicy: "queue",
          triggerKinds: ["manual", "schedule"],
          workflowId: "release-automation",
        },
        promptEntries: [
          {
            nodeId: "kickoff",
            prompt: {
              assetId: "workflow-kickoff",
              messages: [
                {
                  parts: [
                    {
                      text: "Start orchestration for April Release.",
                      type: "text",
                    },
                  ],
                  role: "system",
                },
              ],
              missingVariables: [],
              ready: true,
              usedVariables: ["releaseName"],
              version: 1,
              versionId: "workflow-kickoff-v1",
            },
            promptAssetId: "workflow-kickoff",
            promptStatus: "published",
          },
        ],
      },
      degraded: false,
      entries: [
        {
          issues: [],
          kind: "prompt",
          nodeId: "kickoff",
          prompt: {
            assetId: "workflow-kickoff",
            messages: [
              {
                parts: [
                  {
                    text: "Start orchestration for April Release.",
                    type: "text",
                  },
                ],
                role: "system",
              },
            ],
            missingVariables: [],
            ready: true,
            usedVariables: ["releaseName"],
            version: 1,
            versionId: "workflow-kickoff-v1",
          },
          promptAssetId: "workflow-kickoff",
          promptStatus: "published",
          ready: true,
        },
        {
          agentId: "research-director",
          issues: ["missing-prompt-variables"],
          kind: "agent",
          launchPlan: {
            agentId: "research-director",
            automationFitScore: 95,
            focusAreas: ["Operations", "Research"],
            prompt: {
              assetId: "agent-plan",
              messages: [
                {
                  parts: [
                    {
                      text: "Produce a release plan for {{objective}}.",
                      type: "text",
                    },
                  ],
                  role: "system",
                },
              ],
              missingVariables: ["objective"],
              ready: false,
              usedVariables: ["objective"],
              version: 1,
              versionId: "agent-plan-v1",
            },
            promptStatus: "published",
            runtimePolicy: {
              agentId: "research-director",
              fallbackModelIds: ["openai/gpt-4.1"],
              knowledgeSpaceIds: ["product-docs"],
              maxToolCalls: 8,
              mcpServerIds: ["github-mcp"],
              memoryScopes: ["workspace"],
              preferredModelId: "anthropic/claude-3-7-sonnet",
              promptAssetId: "agent-plan",
              skillIds: ["publish-report"],
              toolIds: ["web.search"],
            },
            tags: ["ops"],
          },
          nodeId: "research",
          ready: false,
        },
      ],
      issues: ["missing-prompt-variables"],
      ready: false,
    });

    expect(
      evaluateWorkflowExecutionReadiness(
        {
          ...supportWorkflow,
          nodes: [
            {
              id: "triage-prompt",
              kind: "prompt",
              label: "Draft Triage Prompt",
              promptAssetId: "workflow-draft",
            },
            supportWorkflow.nodes[1],
          ],
        },
        {
          ...workflowDependencies,
          promptCatalog,
        },
      ),
    ).toEqual({
      blueprint: {
        agentLaunchPlans: [],
        executionPlan: {
          adjacency: {
            "triage-prompt": ["triage-skill"],
            "triage-skill": [],
          },
          approvalNodeIds: [],
          dependencyIds: {
            agentIds: [],
            knowledgeSpaceIds: [],
            mcpServerIds: [],
            memoryScopes: [],
            promptAssetIds: ["workflow-draft"],
            skillIds: ["publish-report"],
            toolIds: [],
          },
          entryNodeId: "triage-prompt",
          hasCycles: false,
          nodeOrder: ["triage-prompt", "triage-skill"],
          runPolicy: "singleton",
          triggerKinds: ["webhook"],
          workflowId: "support-intake-loop",
        },
        promptEntries: [
          {
            nodeId: "triage-prompt",
            prompt: {
              assetId: "workflow-draft",
              messages: [
                {
                  parts: [
                    {
                      text: "Run the draft release automation flow.",
                      type: "text",
                    },
                  ],
                  role: "system",
                },
              ],
              missingVariables: [],
              ready: true,
              usedVariables: [],
              version: 1,
              versionId: "workflow-draft-v1",
            },
            promptAssetId: "workflow-draft",
            promptStatus: "draft",
          },
        ],
      },
      degraded: true,
      entries: [
        {
          degraded: true,
          issues: ["draft-prompt"],
          kind: "prompt",
          nodeId: "triage-prompt",
          prompt: {
            assetId: "workflow-draft",
            messages: [
              {
                parts: [
                  {
                    text: "Run the draft release automation flow.",
                    type: "text",
                  },
                ],
                role: "system",
              },
            ],
            missingVariables: [],
            ready: true,
            usedVariables: [],
            version: 1,
            versionId: "workflow-draft-v1",
          },
          promptAssetId: "workflow-draft",
          promptStatus: "draft",
          ready: true,
        },
      ],
      issues: ["draft-prompt"],
      ready: true,
    });
  });

  it("reduces workflow execution events into approval, completion, and failure summaries", () => {
    expect(
      reduceWorkflowExecutionEvents([
        {
          at: NOW,
          runId: "run-awaiting",
          triggerKind: "manual",
          type: "run-started",
          workflowId: "release-automation",
        },
        {
          at: NOW + 1_000,
          nodeId: "kickoff",
          runId: "run-awaiting",
          type: "node-completed",
          workflowId: "release-automation",
        },
        {
          at: NOW + 2_000,
          nodeId: "human-review",
          runId: "run-awaiting",
          type: "node-started",
          workflowId: "release-automation",
        },
        {
          approvalNodeId: "human-review",
          at: NOW + 3_000,
          runId: "run-awaiting",
          type: "awaiting-approval",
          workflowId: "release-automation",
        },
      ]),
    ).toEqual({
      awaitingApprovalNodeId: "human-review",
      completedNodeIds: ["kickoff"],
      lastNodeId: "human-review",
      runId: "run-awaiting",
      startedAt: NOW,
      status: "awaiting-approval",
      triggerKind: "manual",
      workflowId: "release-automation",
    });

    expect(
      reduceWorkflowExecutionEvents([
        {
          at: NOW,
          runId: "run-complete",
          triggerKind: "schedule",
          type: "run-started",
          workflowId: "release-automation",
        },
        {
          at: NOW + 2_000,
          nodeId: "publish",
          runId: "run-complete",
          type: "node-completed",
          workflowId: "release-automation",
        },
        {
          at: NOW + 5_000,
          runId: "run-complete",
          type: "run-completed",
          workflowId: "release-automation",
        },
      ]),
    ).toEqual({
      completedAt: NOW + 5_000,
      completedNodeIds: ["publish"],
      durationMs: 5_000,
      lastNodeId: "publish",
      runId: "run-complete",
      startedAt: NOW,
      status: "completed",
      triggerKind: "schedule",
      workflowId: "release-automation",
    });

    expect(
      reduceWorkflowExecutionEvents([
        {
          at: NOW,
          runId: "run-failed",
          triggerKind: "manual",
          type: "run-started",
          workflowId: "release-automation",
        },
        {
          at: NOW + 2_000,
          error: "Tool quota exceeded.",
          nodeId: "search",
          runId: "run-failed",
          type: "node-failed",
          workflowId: "release-automation",
        },
        {
          at: NOW + 4_000,
          error: "Tool quota exceeded.",
          failedNodeId: "search",
          runId: "run-failed",
          type: "run-failed",
          workflowId: "release-automation",
        },
      ]),
    ).toEqual({
      completedAt: NOW + 4_000,
      completedNodeIds: [],
      durationMs: 4_000,
      error: "Tool quota exceeded.",
      failedNodeId: "search",
      lastNodeId: "search",
      runId: "run-failed",
      startedAt: NOW,
      status: "failed",
      triggerKind: "manual",
      workflowId: "release-automation",
    });
  });

  it("builds workflow workspace manifests and route intents", () => {
    expect(
      createWorkflowWorkspaceManifest({
        packageNames: ["@sdkwork/workflow-pc-react", "@sdkwork/workflow-pc-react"],
        title: "Workflows",
      }),
    ).toEqual({
      architecture: "pc-react",
      capability: "workflow",
      description: "Workflow workspace for graph manifests, orchestration readiness, and execution routing.",
      detailRoutePattern: "/workflows/:workflowId",
      host: "tauri",
      id: "sdkwork-workflow",
      packageNames: ["@sdkwork/workflow-pc-react"],
      routePath: "/workflows",
      runDetailRoutePattern: "/workflows/:workflowId/runs/:runId",
      theme: {
        color: "lobster",
        preset: "sdkwork",
        selection: "system",
      },
      title: "Workflows",
    });

    expect(
      createWorkflowLibraryRouteIntent({
        readiness: "ready",
        trigger: "schedule",
      }),
    ).toEqual({
      focusWindow: true,
      readiness: "ready",
      route: "/workflows?trigger=schedule&readiness=ready",
      source: "workflow-workspace",
      trigger: "schedule",
      type: "workflow-library-route-intent",
    });

    expect(createWorkflowDetailRouteIntent("release-automation")).toEqual({
      focusWindow: true,
      route: "/workflows/release-automation",
      source: "workflow-workspace",
      type: "workflow-detail-route-intent",
      workflowId: "release-automation",
    });

    expect(createWorkflowRunRouteIntent("release-automation", "run-1")).toEqual({
      focusWindow: true,
      route: "/workflows/release-automation/runs/run-1",
      runId: "run-1",
      source: "workflow-workspace",
      type: "workflow-run-route-intent",
      workflowId: "release-automation",
    });
  });
});
