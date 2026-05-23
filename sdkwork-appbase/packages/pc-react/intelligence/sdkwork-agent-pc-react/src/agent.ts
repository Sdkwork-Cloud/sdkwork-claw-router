import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";
import type { SdkworkKnowledgeSpace } from "@sdkwork/knowledge-pc-react";
import type { SdkworkMemoryRecallScope } from "@sdkwork/memory-pc-react";
import type { SdkworkMcpServerDescriptor } from "@sdkwork/mcp-pc-react";
import {
  evaluatePromptExecutionReadiness,
  type SdkworkCompiledPromptAsset,
  type SdkworkPromptAsset,
  type SdkworkPromptStatus,
  type SdkworkPromptVariableValue,
} from "@sdkwork/prompt-pc-react";
import {
  resolveSkillReadiness,
  type SdkworkSkillDefinition,
} from "@sdkwork/skills-pc-react";
import type { SdkworkToolDescriptor } from "@sdkwork/tools-pc-react";

export type SdkworkAgentReadiness =
  | "missing-mcp"
  | "missing-model"
  | "missing-prompt"
  | "missing-skills"
  | "missing-tools"
  | "ready";
export type SdkworkAgentCatalogSortMode = "automation-fit" | "latest" | "name";

export interface SdkworkAgentManifest {
  automationFitScore: number;
  description: string;
  fallbackModelIds: readonly string[];
  focusAreas: readonly string[];
  id: string;
  isDefault?: boolean;
  knowledgeSpaceIds: readonly string[];
  maxToolCalls?: number;
  mcpServerIds: readonly string[];
  memoryScopes: readonly SdkworkMemoryRecallScope[];
  name: string;
  preferredModelId?: string;
  promptAssetId?: string;
  skillIds: readonly string[];
  tags: readonly string[];
  toolIds: readonly string[];
  updatedAt: number;
}

export interface EvaluateAgentReadinessOptions {
  knowledgeSpaces?: readonly Pick<SdkworkKnowledgeSpace, "id">[];
  mcpServers?: readonly Pick<SdkworkMcpServerDescriptor, "id" | "readiness">[];
  prompts?: readonly Pick<SdkworkPromptAsset, "id">[];
  skills?: readonly Pick<SdkworkSkillDefinition, "enabled" | "id" | "installState" | "missing">[];
  tools?: readonly Pick<SdkworkToolDescriptor, "id" | "status">[];
}

export interface SdkworkAgentCapabilitySummary {
  automationFitScore: number;
  fallbackModelCount: number;
  focusAreaCount: number;
  knowledgeSpaceCount: number;
  mcpServerCount: number;
  memoryScopeCount: number;
  skillCount: number;
  toolCount: number;
}

export interface SdkworkAgentDirectoryDigest {
  automationFitScore: number;
  focusAreaCount: number;
  id: string;
  isDefault: boolean;
  knowledgeSpaceCount: number;
  mcpServerCount: number;
  memoryScopeCount: number;
  name: string;
  preferredModelId?: string;
  promptAssetId?: string;
  readiness: SdkworkAgentReadiness;
  skillCount: number;
  tagCount: number;
  toolCount: number;
  updatedAt: number;
}

export interface SdkworkAgentDirectoryDigestSummary {
  agentsWithKnowledge: number;
  agentsWithMcp: number;
  agentsWithSkills: number;
  agentsWithTools: number;
  defaultAgents: number;
  latestUpdatedAt: number;
  readyAgents: number;
  totalAgents: number;
  totalFocusAreas: number;
  totalTags: number;
}

export interface FilterAgentCatalogOptions {
  focusAreas?: readonly string[];
  query?: string;
  readiness?: readonly SdkworkAgentReadiness[];
  sort?: SdkworkAgentCatalogSortMode;
  tags?: readonly string[];
}

export interface SdkworkAgentRuntimePolicyInput {
  agentId: string;
  fallbackModelIds: string[];
  knowledgeSpaceIds: string[];
  maxToolCalls: number;
  mcpServerIds: string[];
  memoryScopes: SdkworkMemoryRecallScope[];
  preferredModelId: string;
  promptAssetId: string;
  skillIds: string[];
  toolIds: string[];
}

export interface CreateAgentLaunchPlanOptions extends EvaluateAgentReadinessOptions {
  promptCatalog?: readonly SdkworkPromptAsset[];
  promptValues?: Record<string, SdkworkPromptVariableValue>;
}

export interface SdkworkAgentLaunchPlan {
  agentId: string;
  automationFitScore: number;
  focusAreas: string[];
  prompt: SdkworkCompiledPromptAsset;
  promptStatus: SdkworkPromptStatus;
  runtimePolicy: SdkworkAgentRuntimePolicyInput;
  tags: string[];
}

export type SdkworkAgentExecutionIssue =
  | SdkworkAgentReadiness
  | "archived-prompt"
  | "draft-prompt"
  | "empty-prompt"
  | "missing-prompt-variables";

export interface EvaluateAgentExecutionReadinessOptions extends CreateAgentLaunchPlanOptions {}

export interface SdkworkAgentExecutionReadiness {
  degraded: boolean;
  issues: SdkworkAgentExecutionIssue[];
  launchPlan?: SdkworkAgentLaunchPlan;
  ready: boolean;
}

export interface SdkworkAgentWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "agent";
  detailRoutePattern: string;
  routePath: string;
}

export interface CreateAgentWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkAgentDirectoryRouteIntent {
  focusArea?: string;
  focusWindow: boolean;
  readiness?: SdkworkAgentReadiness;
  route: string;
  source: "agent-workspace";
  type: "agent-directory-route-intent";
}

export interface CreateAgentDirectoryRouteIntentOptions {
  basePath?: string;
  focusArea?: string;
  focusWindow?: boolean;
  readiness?: SdkworkAgentReadiness;
}

export interface SdkworkAgentDetailRouteIntent {
  agentId: string;
  focusWindow: boolean;
  route: string;
  source: "agent-workspace";
  type: "agent-detail-route-intent";
}

export interface CreateAgentDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

function toUniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toUniqueAgentExecutionIssues(
  issues: readonly SdkworkAgentExecutionIssue[],
): SdkworkAgentExecutionIssue[] {
  const seen = new Set<SdkworkAgentExecutionIssue>();
  const uniqueIssues: SdkworkAgentExecutionIssue[] = [];

  for (const issue of issues) {
    if (seen.has(issue)) {
      continue;
    }

    seen.add(issue);
    uniqueIssues.push(issue);
  }

  return uniqueIssues;
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function searchValues(agent: SdkworkAgentManifest): string[] {
  return [
    agent.id,
    agent.name,
    agent.description,
    agent.preferredModelId ?? "",
    ...agent.fallbackModelIds,
    ...agent.focusAreas,
    ...agent.tags,
    ...agent.skillIds,
    ...agent.toolIds,
    ...agent.mcpServerIds,
    ...agent.knowledgeSpaceIds,
    ...agent.memoryScopes,
  ];
}

function sortAgents(
  agents: readonly SdkworkAgentManifest[],
  mode: SdkworkAgentCatalogSortMode = "automation-fit",
): SdkworkAgentManifest[] {
  return [...agents].sort((left, right) => {
    if (mode === "latest") {
      const updatedDifference = right.updatedAt - left.updatedAt;
      if (updatedDifference !== 0) {
        return updatedDifference;
      }
    }

    if (mode === "automation-fit") {
      const fitDifference = right.automationFitScore - left.automationFitScore;
      if (fitDifference !== 0) {
        return fitDifference;
      }
    }

    return left.name.localeCompare(right.name);
  });
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function findPromptAsset(
  promptAssetId: string | undefined,
  promptCatalog: readonly SdkworkPromptAsset[] | undefined,
): SdkworkPromptAsset | undefined {
  const normalizedPromptAssetId = promptAssetId?.trim();
  if (!normalizedPromptAssetId || !promptCatalog) {
    return undefined;
  }

  return promptCatalog.find((prompt) => prompt.id === normalizedPromptAssetId);
}

function mapPromptExecutionIssuesToAgentExecutionIssues(
  issues: readonly string[],
): SdkworkAgentExecutionIssue[] {
  return toUniqueAgentExecutionIssues(
    issues.map((issue) => {
      switch (issue) {
        case "draft-version":
          return "draft-prompt";
        case "archived-version":
          return "archived-prompt";
        case "empty-messages":
          return "empty-prompt";
        case "missing-variables":
          return "missing-prompt-variables";
        default:
          return "missing-prompt";
      }
    }),
  );
}

function isMissingPrompt(
  agent: Pick<SdkworkAgentManifest, "promptAssetId">,
  prompts: readonly Pick<SdkworkPromptAsset, "id">[] | undefined,
): boolean {
  const promptAssetId = agent.promptAssetId?.trim();
  if (!promptAssetId) {
    return true;
  }

  if (!prompts) {
    return false;
  }

  return !prompts.some((prompt) => prompt.id === promptAssetId);
}

function isMissingSkills(
  agent: Pick<SdkworkAgentManifest, "skillIds">,
  skills: readonly Pick<SdkworkSkillDefinition, "enabled" | "id" | "installState" | "missing">[] | undefined,
): boolean {
  if (agent.skillIds.length === 0) {
    return false;
  }

  if (!skills) {
    return false;
  }

  const skillMap = new Map(skills.map((skill) => [skill.id, skill] as const));

  return agent.skillIds.some((skillId) => {
    const skill = skillMap.get(skillId);
    return !skill || resolveSkillReadiness(skill) !== "ready";
  });
}

function isMissingTools(
  agent: Pick<SdkworkAgentManifest, "toolIds">,
  tools: readonly Pick<SdkworkToolDescriptor, "id" | "status">[] | undefined,
): boolean {
  if (agent.toolIds.length === 0) {
    return false;
  }

  if (!tools) {
    return false;
  }

  const toolMap = new Map(tools.map((tool) => [tool.id, tool] as const));

  return agent.toolIds.some((toolId) => {
    const tool = toolMap.get(toolId);
    return !tool || tool.status === "disabled";
  });
}

function isMissingMcp(
  agent: Pick<SdkworkAgentManifest, "mcpServerIds">,
  mcpServers: readonly Pick<SdkworkMcpServerDescriptor, "id" | "readiness">[] | undefined,
): boolean {
  if (agent.mcpServerIds.length === 0) {
    return false;
  }

  if (!mcpServers) {
    return false;
  }

  const mcpMap = new Map(mcpServers.map((server) => [server.id, server] as const));

  return agent.mcpServerIds.some((serverId) => {
    const server = mcpMap.get(serverId);
    return !server || server.readiness !== "ready";
  });
}

export function selectDefaultAgent(
  agents: readonly SdkworkAgentManifest[],
  preferredAgentId?: string,
): SdkworkAgentManifest | undefined {
  const normalizedPreferredAgentId = preferredAgentId?.trim();
  if (normalizedPreferredAgentId) {
    const preferredAgent = agents.find((agent) => agent.id === normalizedPreferredAgentId);
    if (preferredAgent) {
      return preferredAgent;
    }
  }

  return [...agents].sort((left, right) => {
    if ((left.isDefault ?? false) !== (right.isDefault ?? false)) {
      return left.isDefault ? -1 : 1;
    }

    if (right.automationFitScore !== left.automationFitScore) {
      return right.automationFitScore - left.automationFitScore;
    }

    if (right.updatedAt !== left.updatedAt) {
      return right.updatedAt - left.updatedAt;
    }

    return left.name.localeCompare(right.name);
  })[0];
}

export function evaluateAgentReadiness(
  agent: SdkworkAgentManifest,
  options: EvaluateAgentReadinessOptions = {},
): SdkworkAgentReadiness {
  if (!agent.preferredModelId?.trim()) {
    return "missing-model";
  }

  if (isMissingPrompt(agent, options.prompts)) {
    return "missing-prompt";
  }

  if (isMissingSkills(agent, options.skills)) {
    return "missing-skills";
  }

  if (isMissingTools(agent, options.tools)) {
    return "missing-tools";
  }

  if (isMissingMcp(agent, options.mcpServers)) {
    return "missing-mcp";
  }

  return "ready";
}

export function summarizeAgentCapabilities(
  agent: SdkworkAgentManifest,
): SdkworkAgentCapabilitySummary {
  return {
    automationFitScore: agent.automationFitScore,
    fallbackModelCount: toUniqueStrings(agent.fallbackModelIds).length,
    focusAreaCount: toUniqueStrings(agent.focusAreas).length,
    knowledgeSpaceCount: toUniqueStrings(agent.knowledgeSpaceIds).length,
    mcpServerCount: toUniqueStrings(agent.mcpServerIds).length,
    memoryScopeCount: toUniqueStrings(agent.memoryScopes).length,
    skillCount: toUniqueStrings(agent.skillIds).length,
    toolCount: toUniqueStrings(agent.toolIds).length,
  };
}

export function createAgentDirectoryDigest(
  agent: SdkworkAgentManifest,
  options: EvaluateAgentReadinessOptions = {},
): SdkworkAgentDirectoryDigest {
  return {
    automationFitScore: agent.automationFitScore,
    focusAreaCount: toUniqueStrings(agent.focusAreas).length,
    id: agent.id,
    isDefault: agent.isDefault ?? false,
    knowledgeSpaceCount: toUniqueStrings(agent.knowledgeSpaceIds).length,
    mcpServerCount: toUniqueStrings(agent.mcpServerIds).length,
    memoryScopeCount: toUniqueStrings(agent.memoryScopes).length,
    name: agent.name,
    ...(agent.preferredModelId ? { preferredModelId: agent.preferredModelId } : {}),
    ...(agent.promptAssetId ? { promptAssetId: agent.promptAssetId } : {}),
    readiness: evaluateAgentReadiness(agent, options),
    skillCount: toUniqueStrings(agent.skillIds).length,
    tagCount: toUniqueStrings(agent.tags).length,
    toolCount: toUniqueStrings(agent.toolIds).length,
    updatedAt: agent.updatedAt,
  };
}

export function summarizeAgentDirectoryDigests(
  digests: readonly SdkworkAgentDirectoryDigest[],
): SdkworkAgentDirectoryDigestSummary {
  let agentsWithKnowledge = 0;
  let agentsWithMcp = 0;
  let agentsWithSkills = 0;
  let agentsWithTools = 0;
  let defaultAgents = 0;
  let latestUpdatedAt = 0;
  let readyAgents = 0;
  let totalFocusAreas = 0;
  let totalTags = 0;

  for (const digest of digests) {
    latestUpdatedAt = Math.max(latestUpdatedAt, digest.updatedAt);
    totalFocusAreas += digest.focusAreaCount;
    totalTags += digest.tagCount;
    if (digest.isDefault) {
      defaultAgents += 1;
    }

    if (digest.readiness === "ready") {
      readyAgents += 1;
    }

    if (digest.knowledgeSpaceCount > 0) {
      agentsWithKnowledge += 1;
    }

    if (digest.mcpServerCount > 0) {
      agentsWithMcp += 1;
    }

    if (digest.skillCount > 0) {
      agentsWithSkills += 1;
    }

    if (digest.toolCount > 0) {
      agentsWithTools += 1;
    }
  }

  return {
    agentsWithKnowledge,
    agentsWithMcp,
    agentsWithSkills,
    agentsWithTools,
    defaultAgents,
    latestUpdatedAt,
    readyAgents,
    totalAgents: digests.length,
    totalFocusAreas,
    totalTags,
  };
}

export function filterAgentCatalog(
  agents: readonly SdkworkAgentManifest[],
  options: FilterAgentCatalogOptions = {},
  readinessOptions: EvaluateAgentReadinessOptions = {},
): SdkworkAgentManifest[] {
  const focusAreas = options.focusAreas ? new Set(options.focusAreas) : null;
  const readiness = options.readiness ? new Set(options.readiness) : null;
  const tags = options.tags ?? [];
  const query = normalizeQuery(options.query);

  return sortAgents(agents, options.sort)
    .filter((agent) =>
      focusAreas
        ? agent.focusAreas.some((focusArea) => focusAreas.has(focusArea))
        : true,
    )
    .filter((agent) =>
      readiness ? readiness.has(evaluateAgentReadiness(agent, readinessOptions)) : true,
    )
    .filter((agent) => (tags.length > 0 ? tags.every((tag) => agent.tags.includes(tag)) : true))
    .filter((agent) =>
      query ? searchValues(agent).some((value) => value.toLowerCase().includes(query)) : true,
    );
}

export function createAgentLaunchPlan(
  agent: SdkworkAgentManifest,
  options: CreateAgentLaunchPlanOptions = {},
): SdkworkAgentLaunchPlan {
  const runtimePolicy = buildAgentRuntimePolicyInput(agent, options);
  const promptAsset = findPromptAsset(runtimePolicy.promptAssetId, options.promptCatalog);
  if (!promptAsset) {
    throw new Error(`Agent ${agent.id} prompt asset ${runtimePolicy.promptAssetId} is unavailable.`);
  }

  const promptReadiness = evaluatePromptExecutionReadiness(promptAsset, {
    values: options.promptValues,
  });
  if (!promptReadiness.compiled || !promptReadiness.status) {
    throw new Error(`Agent ${agent.id} prompt asset ${runtimePolicy.promptAssetId} cannot be compiled.`);
  }

  return {
    agentId: agent.id,
    automationFitScore: agent.automationFitScore,
    focusAreas: toUniqueStrings(agent.focusAreas),
    prompt: promptReadiness.compiled,
    promptStatus: promptReadiness.status,
    runtimePolicy,
    tags: toUniqueStrings(agent.tags),
  };
}

export function evaluateAgentExecutionReadiness(
  agent: SdkworkAgentManifest,
  options: EvaluateAgentExecutionReadinessOptions = {},
): SdkworkAgentExecutionReadiness {
  const readiness = evaluateAgentReadiness(agent, options);
  if (readiness !== "ready") {
    return {
      degraded: false,
      issues: [readiness],
      ready: false,
    };
  }

  const promptAsset = findPromptAsset(agent.promptAssetId, options.promptCatalog);
  if (!promptAsset) {
    return {
      degraded: false,
      issues: ["missing-prompt"],
      ready: false,
    };
  }

  const promptReadiness = evaluatePromptExecutionReadiness(promptAsset, {
    values: options.promptValues,
  });
  const issues = mapPromptExecutionIssuesToAgentExecutionIssues(promptReadiness.issues);
  const launchPlan = promptReadiness.compiled && promptReadiness.status
    ? {
        agentId: agent.id,
        automationFitScore: agent.automationFitScore,
        focusAreas: toUniqueStrings(agent.focusAreas),
        prompt: promptReadiness.compiled,
        promptStatus: promptReadiness.status,
        runtimePolicy: buildAgentRuntimePolicyInput(agent, options),
        tags: toUniqueStrings(agent.tags),
      }
    : undefined;

  return {
    degraded: issues.some((issue) => issue === "draft-prompt" || issue === "archived-prompt"),
    ...(launchPlan ? { launchPlan } : {}),
    issues,
    ready: promptReadiness.ready,
  };
}

export function buildAgentRuntimePolicyInput(
  agent: SdkworkAgentManifest,
  options: EvaluateAgentReadinessOptions = {},
): SdkworkAgentRuntimePolicyInput {
  const preferredModelId = agent.preferredModelId?.trim();
  if (!preferredModelId) {
    throw new Error(`Agent ${agent.id} is missing its preferred model id.`);
  }

  const promptAssetId = agent.promptAssetId?.trim();
  if (!promptAssetId) {
    throw new Error(`Agent ${agent.id} is missing its prompt asset id.`);
  }

  const readySkillIds = !options.skills
    ? toUniqueStrings(agent.skillIds)
    : toUniqueStrings(
        agent.skillIds.filter((skillId) => {
          const skill = options.skills?.find((candidate) => candidate.id === skillId);
          return Boolean(skill && resolveSkillReadiness(skill) === "ready");
        }),
      );
  const availableToolIds = !options.tools
    ? toUniqueStrings(agent.toolIds)
    : toUniqueStrings(
        agent.toolIds.filter((toolId) =>
          options.tools?.some((tool) => tool.id === toolId && tool.status !== "disabled"),
        ),
      );
  const readyMcpServerIds = !options.mcpServers
    ? toUniqueStrings(agent.mcpServerIds)
    : toUniqueStrings(
        agent.mcpServerIds.filter((serverId) =>
          options.mcpServers?.some(
            (server) => server.id === serverId && server.readiness === "ready",
          ),
        ),
      );
  const availableKnowledgeSpaceIds = !options.knowledgeSpaces
    ? toUniqueStrings(agent.knowledgeSpaceIds)
    : toUniqueStrings(
        agent.knowledgeSpaceIds.filter((spaceId) =>
          options.knowledgeSpaces?.some((space) => space.id === spaceId),
        ),
      );

  return {
    agentId: agent.id,
    fallbackModelIds: toUniqueStrings(agent.fallbackModelIds),
    knowledgeSpaceIds: availableKnowledgeSpaceIds,
    maxToolCalls: Math.max(agent.maxToolCalls ?? 8, 1),
    mcpServerIds: readyMcpServerIds,
    memoryScopes: toUniqueStrings(agent.memoryScopes) as SdkworkMemoryRecallScope[],
    preferredModelId,
    promptAssetId,
    skillIds: readySkillIds,
    toolIds: availableToolIds,
  };
}

export function createAgentWorkspaceManifest({
  description = "Agent workspace for manifests, readiness evaluation, and runtime policy routing.",
  host,
  id = "sdkwork-agent",
  packageNames = [
    "@sdkwork/agent-pc-react",
    "@sdkwork/prompt-pc-react",
    "@sdkwork/skills-pc-react",
    "@sdkwork/tools-pc-react",
    "@sdkwork/mcp-pc-react",
    "@sdkwork/knowledge-pc-react",
    "@sdkwork/memory-pc-react",
  ],
  routePath = "/agents",
  theme,
  title = "Agents",
}: CreateAgentWorkspaceManifestOptions = {}): SdkworkAgentWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "agent",
    detailRoutePattern: `${routePath}/:agentId`,
    routePath,
  };
}

export function createAgentDirectoryRouteIntent(
  options: CreateAgentDirectoryRouteIntentOptions = {},
): SdkworkAgentDirectoryRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.focusArea) {
    queryParams.set("focus", options.focusArea);
  }

  if (options.readiness) {
    queryParams.set("readiness", options.readiness);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    ...(options.focusArea ? { focusArea: options.focusArea } : {}),
    focusWindow: options.focusWindow !== false,
    ...(options.readiness ? { readiness: options.readiness } : {}),
    route: `${options.basePath ?? "/agents"}${querySuffix}`,
    source: "agent-workspace",
    type: "agent-directory-route-intent",
  };
}

export function createAgentDetailRouteIntent(
  agentId: string,
  options: CreateAgentDetailRouteIntentOptions = {},
): SdkworkAgentDetailRouteIntent {
  return {
    agentId,
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/agents"}/${agentId}`,
    source: "agent-workspace",
    type: "agent-detail-route-intent",
  };
}

export const agentPackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/agent-pc-react",
  status: "ready",
} as const;

export type AgentPackageMeta = typeof agentPackageMeta;
