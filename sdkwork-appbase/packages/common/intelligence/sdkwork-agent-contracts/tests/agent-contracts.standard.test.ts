import { describe, expect, it } from "vitest";

import {
  SDKWORK_AGENT_API_ROUTES,
  SDKWORK_AGENT_CAPABILITIES,
  SDKWORK_AGENT_DOMAIN_MODELS,
  SDKWORK_AGENT_LIFECYCLE,
  SDKWORK_AGENT_METERING_EVENT_TYPES,
  SDKWORK_AGENT_OPERATION_IDS,
  SDKWORK_AGENT_STANDARD,
  SDKWORK_AGENT_TABLES,
  createAgentMeteringEvent,
  createAgentRunLifecyclePolicy,
  normalizeAgentToolBindingKey,
} from "../src/index";

describe("SDKWork agent standard contracts", () => {
  it("defines a framework-neutral common intelligence standard", () => {
    expect(SDKWORK_AGENT_STANDARD.domain).toBe("agent");
    expect(SDKWORK_AGENT_STANDARD.architecture).toBe("common");
    expect(SDKWORK_AGENT_STANDARD.api.appPrefix).toBe("/app/v3/api");
    expect(SDKWORK_AGENT_STANDARD.api.backendPrefix).toBe("/backend/v3/api");
    expect(SDKWORK_AGENT_STANDARD.sdkNamespaces).toEqual(["agents"]);
    expect(SDKWORK_AGENT_STANDARD.executionModel).toBe("run-step-event-metering");
  });

  it("defines first-class agent tables without plus legacy prefixes", () => {
    expect(SDKWORK_AGENT_TABLES).toEqual({
      agent: "ai_agent",
      agentMemory: "ai_agent_memory",
      agentMcpServer: "ai_agent_mcp_server",
      agentRun: "ai_agent_run",
      agentRunStep: "ai_agent_run_step",
      agentToolBinding: "ai_agent_tool_binding",
      agentVersion: "ai_agent_version",
    });

    for (const tableName of Object.values(SDKWORK_AGENT_TABLES)) {
      expect(tableName).toMatch(/^ai_agent[a-z0-9_]*$/);
      expect(tableName).not.toMatch(/^plus_/);
      expect(tableName).not.toContain("__");
    }
  });

  it("models agent definition, version, run, step, memory, MCP, and tool binding domains", () => {
    expect(SDKWORK_AGENT_DOMAIN_MODELS.map((model) => model.name)).toEqual([
      "agent",
      "agentVersion",
      "agentRun",
      "agentRunStep",
      "agentMemory",
      "agentToolBinding",
      "agentMcpServer",
    ]);

    for (const model of SDKWORK_AGENT_DOMAIN_MODELS) {
      expect(model.domain).toBe("agent");
      expect(model.table).toBe(SDKWORK_AGENT_TABLES[model.name]);
      expect(model.fields).toContain("id");
      expect(model.fields).toContain("tenant_id");
      expect(model.fields).toContain("organization_id");
      expect(model.capabilities.length).toBeGreaterThan(0);
    }

    expect(SDKWORK_AGENT_DOMAIN_MODELS.find((model) => model.name === "agent")?.fields).toEqual(
      expect.arrayContaining(["agent_code", "name", "owner_user_id", "visibility", "default_version_id"]),
    );
    expect(SDKWORK_AGENT_DOMAIN_MODELS.find((model) => model.name === "agentVersion")?.fields).toEqual(
      expect.arrayContaining(["agent_id", "version_no", "release_status", "model_policy", "tool_policy"]),
    );
    expect(SDKWORK_AGENT_DOMAIN_MODELS.find((model) => model.name === "agentRun")?.fields).toEqual(
      expect.arrayContaining(["agent_id", "agent_version_id", "run_uuid", "run_status", "metering_status"]),
    );
    expect(SDKWORK_AGENT_DOMAIN_MODELS.find((model) => model.name === "agentRunStep")?.fields).toEqual(
      expect.arrayContaining(["run_id", "step_index", "step_type", "tool_binding_id", "usage_fact_id"]),
    );
  });

  it("keeps lifecycle states explicit and terminal states separated", () => {
    expect(SDKWORK_AGENT_LIFECYCLE.runStatuses).toEqual([
      "queued",
      "planning",
      "running",
      "waiting_for_tool",
      "succeeded",
      "failed",
      "cancelled",
    ]);
    expect(SDKWORK_AGENT_LIFECYCLE.stepTypes).toEqual([
      "input",
      "memory_retrieval",
      "model_call",
      "skill_call",
      "mcp_tool_call",
      "media_generation",
      "metering",
      "output",
    ]);
    expect(SDKWORK_AGENT_LIFECYCLE.terminalRunStatuses).toEqual(["succeeded", "failed", "cancelled"]);

    expect(createAgentRunLifecyclePolicy()).toEqual({
      auditEveryStep: true,
      requireTenantIsolation: true,
      requireToolPermission: true,
      terminalRunStatuses: ["succeeded", "failed", "cancelled"],
      timeoutPolicy: {
        defaultRunTimeoutSeconds: 600,
        defaultStepTimeoutSeconds: 120,
      },
    });
  });

  it("defines app and backend routes with dotted operation ids under one agents SDK namespace", () => {
    expect(SDKWORK_AGENT_API_ROUTES.app.agents.list.path).toBe("/app/v3/api/agents");
    expect(SDKWORK_AGENT_API_ROUTES.app.agents.runs.create.path).toBe("/app/v3/api/agents/{agentId}/runs");
    expect(SDKWORK_AGENT_API_ROUTES.app.agentRuns.events.list.path).toBe("/app/v3/api/agent_runs/{runId}/events");
    expect(SDKWORK_AGENT_API_ROUTES.backend.agents.templates.list.path).toBe("/backend/v3/api/agents/templates");
    expect(SDKWORK_AGENT_API_ROUTES.backend.agentMcpServers.health.retrieve.path).toBe(
      "/backend/v3/api/agents/mcp_servers/{serverId}/health",
    );

    const operationIds = Object.keys(SDKWORK_AGENT_OPERATION_IDS);
    expect(operationIds).toEqual([
      "agentMcpServers.create",
      "agentMcpServers.health.retrieve",
      "agentMcpServers.list",
      "agentRuns.events.list",
      "agentRuns.retrieve",
      "agentRuns.steps.list",
      "agents.create",
      "agents.list",
      "agents.publish",
      "agents.retrieve",
      "agents.runs.create",
      "agents.templates.list",
      "agents.update",
      "skills.catalog.list",
    ]);
    for (const operationId of operationIds) {
      expect(operationId).toMatch(/^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)+$/);
      expect(SDKWORK_AGENT_OPERATION_IDS[operationId].tag).toBe("agents");
    }
  });

  it("assigns every operation to an agent capability", () => {
    const operationIds = Object.keys(SDKWORK_AGENT_OPERATION_IDS).sort();
    const capabilityOperationIds = SDKWORK_AGENT_CAPABILITIES.flatMap((capability) => capability.operations).sort();

    expect(SDKWORK_AGENT_CAPABILITIES.map((capability) => capability.name)).toEqual([
      "agentDefinition",
      "agentExecution",
      "agentSkillBinding",
      "agentMcpBinding",
      "agentMemory",
      "agentMetering",
      "adminAgentGovernance",
    ]);
    expect(capabilityOperationIds).toEqual(operationIds);
  });

  it("normalizes metering events for tokens, images, video, audio, tools, MCP, and skills", () => {
    expect(SDKWORK_AGENT_METERING_EVENT_TYPES).toEqual([
      "token",
      "image",
      "video",
      "audio",
      "tool",
      "mcp",
      "skill",
      "storage",
      "network",
    ]);

    expect(
      createAgentMeteringEvent({
        agentId: "agent_123",
        eventType: "token",
        quantity: "42",
        runId: "run_123",
        stepId: "step_1",
      }),
    ).toEqual({
      agentId: "agent_123",
      eventType: "token",
      quantity: "42",
      runId: "run_123",
      stepId: "step_1",
      usageFactMetadata: {
        agentId: "agent_123",
        meteringSource: "agent-runtime",
        runId: "run_123",
        stepId: "step_1",
      },
    });
  });

  it("normalizes tool binding keys for dynamic skill and MCP catalogs", () => {
    expect(normalizeAgentToolBindingKey("MCP: GitHub Search")).toBe("mcp.github-search");
    expect(normalizeAgentToolBindingKey("skill: Image Polish")).toBe("skill.image-polish");
    expect(normalizeAgentToolBindingKey("Sdkwork Planner")).toBe("tool.sdkwork-planner");
  });
});
