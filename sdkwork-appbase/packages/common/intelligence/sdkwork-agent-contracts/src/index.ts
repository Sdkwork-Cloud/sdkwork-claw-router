export type AgentOperationMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
export type AgentOperationSecurity = "adminToken" | "dualToken";
export type AgentSdkNamespace = "agents";
export type AgentDomainModelName = keyof typeof SDKWORK_AGENT_TABLES;
export type AgentRunStatus = (typeof SDKWORK_AGENT_LIFECYCLE.runStatuses)[number];
export type AgentStepType = (typeof SDKWORK_AGENT_LIFECYCLE.stepTypes)[number];
export type AgentMeteringEventType = (typeof SDKWORK_AGENT_METERING_EVENT_TYPES)[number];
export type AgentCapabilityName =
  | "adminAgentGovernance"
  | "agentDefinition"
  | "agentExecution"
  | "agentMcpBinding"
  | "agentMemory"
  | "agentMetering"
  | "agentSkillBinding";

export interface AgentOperationContract {
  method: AgentOperationMethod;
  operationId: string;
  path: string;
  queryParameters?: readonly string[];
  security: AgentOperationSecurity;
  tag: AgentSdkNamespace;
}

export interface AgentDomainModelContract {
  capabilities: readonly AgentCapabilityName[];
  domain: "agent";
  fields: readonly string[];
  name: AgentDomainModelName;
  table: (typeof SDKWORK_AGENT_TABLES)[AgentDomainModelName];
}

export interface AgentCapabilityContract {
  domain: "agent";
  models: readonly AgentDomainModelName[];
  name: AgentCapabilityName;
  operations: readonly string[];
  sdkNamespaces: readonly AgentSdkNamespace[];
}

export interface AgentRunLifecyclePolicy {
  auditEveryStep: boolean;
  requireTenantIsolation: boolean;
  requireToolPermission: boolean;
  terminalRunStatuses: readonly AgentRunStatus[];
  timeoutPolicy: {
    defaultRunTimeoutSeconds: number;
    defaultStepTimeoutSeconds: number;
  };
}

export interface CreateAgentMeteringEventInput {
  agentId: string;
  agentVersionId?: string;
  eventType: AgentMeteringEventType;
  mcpServerId?: string;
  quantity: string;
  runId: string;
  skillId?: string;
  stepId: string;
  toolId?: string;
}

export interface AgentMeteringEvent {
  agentId: string;
  agentVersionId?: string;
  eventType: AgentMeteringEventType;
  mcpServerId?: string;
  quantity: string;
  runId: string;
  skillId?: string;
  stepId: string;
  toolId?: string;
  usageFactMetadata: {
    agentId: string;
    agentVersionId?: string;
    mcpServerId?: string;
    meteringSource: "agent-runtime";
    runId: string;
    skillId?: string;
    stepId: string;
    toolId?: string;
  };
}

export const SDKWORK_AGENT_STANDARD = {
  api: {
    appPrefix: "/app/v3/api",
    backendPrefix: "/backend/v3/api",
    openapi: "3.1.2",
  },
  architecture: "common",
  databasePrefix: "ai_agent",
  domain: "agent",
  executionModel: "run-step-event-metering",
  sdkNamespaces: ["agents"],
} as const;

export const SDKWORK_AGENT_TABLES = {
  agent: "ai_agent",
  agentMemory: "ai_agent_memory",
  agentMcpServer: "ai_agent_mcp_server",
  agentRun: "ai_agent_run",
  agentRunStep: "ai_agent_run_step",
  agentToolBinding: "ai_agent_tool_binding",
  agentVersion: "ai_agent_version",
} as const;

export const SDKWORK_AGENT_LIFECYCLE = {
  runStatuses: [
    "queued",
    "planning",
    "running",
    "waiting_for_tool",
    "succeeded",
    "failed",
    "cancelled",
  ],
  stepStatuses: ["queued", "running", "succeeded", "failed", "skipped"],
  stepTypes: [
    "input",
    "memory_retrieval",
    "model_call",
    "skill_call",
    "mcp_tool_call",
    "media_generation",
    "metering",
    "output",
  ],
  terminalRunStatuses: ["succeeded", "failed", "cancelled"],
} as const;

export const SDKWORK_AGENT_METERING_EVENT_TYPES = [
  "token",
  "image",
  "video",
  "audio",
  "tool",
  "mcp",
  "skill",
  "storage",
  "network",
] as const;

export const SDKWORK_AGENT_DOMAIN_MODELS = [
  model("agent", ["agentDefinition", "adminAgentGovernance"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "owner_user_id",
    "agent_code",
    "name",
    "description",
    "visibility",
    "default_version_id",
    "status",
    "created_at",
    "updated_at",
  ]),
  model("agentVersion", ["agentDefinition", "agentExecution", "adminAgentGovernance"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "agent_id",
    "version_no",
    "release_status",
    "system_prompt",
    "model_policy",
    "tool_policy",
    "memory_policy",
    "mcp_policy",
    "skill_policy",
    "published_at",
    "created_at",
    "updated_at",
  ]),
  model("agentRun", ["agentExecution", "agentMetering"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "user_id",
    "agent_id",
    "agent_version_id",
    "run_uuid",
    "request_id",
    "run_status",
    "input_message",
    "output_message",
    "started_at",
    "completed_at",
    "metering_status",
    "usage_fact_id",
    "created_at",
    "updated_at",
  ]),
  model("agentRunStep", ["agentExecution", "agentMetering", "agentSkillBinding", "agentMcpBinding"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "run_id",
    "step_index",
    "step_type",
    "step_status",
    "tool_binding_id",
    "skill_id",
    "mcp_server_id",
    "input_snapshot",
    "output_snapshot",
    "error_message_masked",
    "started_at",
    "completed_at",
    "usage_fact_id",
    "created_at",
  ]),
  model("agentMemory", ["agentMemory", "agentExecution"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "agent_id",
    "owner_user_id",
    "memory_scope",
    "memory_type",
    "content_ref",
    "embedding_ref",
    "retention_policy",
    "created_at",
    "updated_at",
  ]),
  model("agentToolBinding", ["agentSkillBinding", "agentMcpBinding", "agentExecution"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "agent_id",
    "agent_version_id",
    "binding_key",
    "binding_type",
    "permission_policy",
    "runtime_config",
    "enabled",
    "created_at",
    "updated_at",
  ]),
  model("agentMcpServer", ["agentMcpBinding", "adminAgentGovernance"], [
    "id",
    "uuid",
    "tenant_id",
    "organization_id",
    "server_code",
    "name",
    "transport_type",
    "connection_config",
    "credential_ref",
    "tool_catalog",
    "health_status",
    "permission_policy",
    "created_at",
    "updated_at",
  ]),
] as const satisfies readonly AgentDomainModelContract[];

const app = SDKWORK_AGENT_STANDARD.api.appPrefix;
const backend = SDKWORK_AGENT_STANDARD.api.backendPrefix;

export const SDKWORK_AGENT_API_ROUTES = {
  app: {
    agents: {
      list: operation("GET", `${app}/agents`, "agents.list"),
      create: operation("POST", `${app}/agents`, "agents.create"),
      retrieve: operation("GET", `${app}/agents/{agentId}`, "agents.retrieve"),
      update: operation("PUT", `${app}/agents/{agentId}`, "agents.update"),
      runs: {
        create: operation("POST", `${app}/agents/{agentId}/runs`, "agents.runs.create"),
      },
    },
    agentRuns: {
      retrieve: operation("GET", `${app}/agent_runs/{runId}`, "agentRuns.retrieve"),
      steps: {
        list: operation("GET", `${app}/agent_runs/{runId}/steps`, "agentRuns.steps.list"),
      },
      events: {
        list: operation("GET", `${app}/agent_runs/{runId}/events`, "agentRuns.events.list"),
      },
    },
  },
  backend: {
    agents: {
      templates: {
        list: operation("GET", `${backend}/agents/templates`, "agents.templates.list", ["status"]),
      },
      publish: operation("POST", `${backend}/agents/{agentId}/publish`, "agents.publish"),
    },
    agentMcpServers: {
      list: operation("GET", `${backend}/agents/mcp_servers`, "agentMcpServers.list", ["status"]),
      create: operation("POST", `${backend}/agents/mcp_servers`, "agentMcpServers.create"),
      health: {
        retrieve: operation(
          "GET",
          `${backend}/agents/mcp_servers/{serverId}/health`,
          "agentMcpServers.health.retrieve",
        ),
      },
    },
    skills: {
      catalog: {
        list: operation("GET", `${backend}/agents/skills/catalog`, "skills.catalog.list", ["status"]),
      },
    },
  },
} as const;

export const SDKWORK_AGENT_OPERATION_IDS = flattenOperations(SDKWORK_AGENT_API_ROUTES);

export const SDKWORK_AGENT_CAPABILITIES = [
  capability("agentDefinition", ["agent", "agentVersion"], [
    "agents.create",
    "agents.list",
    "agents.retrieve",
    "agents.update",
  ]),
  capability("agentExecution", ["agent", "agentVersion", "agentRun", "agentRunStep"], [
    "agentRuns.events.list",
    "agentRuns.retrieve",
    "agentRuns.steps.list",
    "agents.runs.create",
  ]),
  capability("agentSkillBinding", ["agentToolBinding", "agentRunStep"], ["skills.catalog.list"]),
  capability("agentMcpBinding", ["agentMcpServer", "agentToolBinding", "agentRunStep"], [
    "agentMcpServers.create",
    "agentMcpServers.health.retrieve",
    "agentMcpServers.list",
  ]),
  capability("agentMemory", ["agentMemory"], []),
  capability("agentMetering", ["agentRun", "agentRunStep"], []),
  capability("adminAgentGovernance", ["agent", "agentVersion", "agentMcpServer"], [
    "agents.publish",
    "agents.templates.list",
  ]),
] as const satisfies readonly AgentCapabilityContract[];

export function createAgentRunLifecyclePolicy(): AgentRunLifecyclePolicy {
  return {
    auditEveryStep: true,
    requireTenantIsolation: true,
    requireToolPermission: true,
    terminalRunStatuses: [...SDKWORK_AGENT_LIFECYCLE.terminalRunStatuses],
    timeoutPolicy: {
      defaultRunTimeoutSeconds: 600,
      defaultStepTimeoutSeconds: 120,
    },
  };
}

export function createAgentMeteringEvent(input: CreateAgentMeteringEventInput): AgentMeteringEvent {
  return {
    agentId: input.agentId,
    ...(input.agentVersionId ? { agentVersionId: input.agentVersionId } : {}),
    eventType: input.eventType,
    ...(input.mcpServerId ? { mcpServerId: input.mcpServerId } : {}),
    quantity: input.quantity,
    runId: input.runId,
    ...(input.skillId ? { skillId: input.skillId } : {}),
    stepId: input.stepId,
    ...(input.toolId ? { toolId: input.toolId } : {}),
    usageFactMetadata: {
      agentId: input.agentId,
      ...(input.agentVersionId ? { agentVersionId: input.agentVersionId } : {}),
      ...(input.mcpServerId ? { mcpServerId: input.mcpServerId } : {}),
      meteringSource: "agent-runtime",
      runId: input.runId,
      ...(input.skillId ? { skillId: input.skillId } : {}),
      stepId: input.stepId,
      ...(input.toolId ? { toolId: input.toolId } : {}),
    },
  };
}

export function normalizeAgentToolBindingKey(value: string): string {
  const trimmed = value.trim();
  const prefixed = trimmed.includes(":")
    ? trimmed.replace(":", ".")
    : `tool.${trimmed}`;
  return prefixed
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/\.-/g, ".")
    .replace(/-\./g, ".")
    .replace(/(^[-.]+|[-.]+$)/g, "");
}

function operation(
  method: AgentOperationMethod,
  path: string,
  operationId: string,
  queryParameters?: readonly string[],
): AgentOperationContract {
  return {
    method,
    operationId,
    ...(queryParameters ? { queryParameters } : {}),
    path,
    security: path.startsWith(SDKWORK_AGENT_STANDARD.api.backendPrefix) ? "adminToken" : "dualToken",
    tag: "agents",
  };
}

function model(
  name: AgentDomainModelName,
  capabilities: readonly AgentCapabilityName[],
  fields: readonly string[],
): AgentDomainModelContract {
  return {
    capabilities,
    domain: "agent",
    fields,
    name,
    table: SDKWORK_AGENT_TABLES[name],
  };
}

function capability(
  name: AgentCapabilityName,
  models: readonly AgentDomainModelName[],
  operations: readonly string[],
): AgentCapabilityContract {
  return {
    domain: "agent",
    models,
    name,
    operations,
    sdkNamespaces: ["agents"],
  };
}

function flattenOperations(value: unknown): Record<string, AgentOperationContract> {
  const operations: AgentOperationContract[] = [];

  function visit(node: unknown) {
    if (!node || typeof node !== "object") {
      return;
    }

    if ("operationId" in node && "path" in node) {
      operations.push(node as AgentOperationContract);
      return;
    }

    for (const child of Object.values(node)) {
      visit(child);
    }
  }

  visit(value);
  return Object.fromEntries(
    operations
      .slice()
      .sort((left, right) => left.operationId.localeCompare(right.operationId))
      .map((operation) => [operation.operationId, operation]),
  );
}
