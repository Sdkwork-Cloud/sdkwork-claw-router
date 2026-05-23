import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";
import {
  createAgentLaunchPlan,
  evaluateAgentExecutionReadiness,
  evaluateAgentReadiness,
  type CreateAgentLaunchPlanOptions,
  type EvaluateAgentReadinessOptions,
  type SdkworkAgentExecutionIssue,
  type SdkworkAgentLaunchPlan,
  type SdkworkAgentManifest,
  type SdkworkAgentReadiness,
} from "@sdkwork/agent-pc-react";
import type { SdkworkMemoryRecallScope } from "@sdkwork/memory-pc-react";
import {
  evaluatePromptExecutionReadiness,
  type SdkworkCompiledPromptAsset,
  type SdkworkPromptAsset,
  type SdkworkPromptStatus,
  type SdkworkPromptVariableValue,
} from "@sdkwork/prompt-pc-react";
import {
  resolveSkillReadiness,
} from "@sdkwork/skills-pc-react";

export type SdkworkWorkflowTriggerKind = "event" | "manual" | "schedule" | "webhook";
export type SdkworkWorkflowRunPolicy = "parallel" | "queue" | "singleton";
export type SdkworkWorkflowCatalogSortMode = "automation-fit" | "latest" | "name";
export type SdkworkWorkflowNodeKind =
  | "agent"
  | "approval"
  | "condition"
  | "knowledge"
  | "mcp"
  | "memory"
  | "prompt"
  | "skill"
  | "tool";
export type SdkworkWorkflowNodeFailureMode = "continue" | "halt" | "route";
export type SdkworkWorkflowEdgeOutcome =
  | "approved"
  | "default"
  | "failed"
  | "matched"
  | "rejected"
  | "success"
  | "unmatched";
export type SdkworkWorkflowReadiness =
  | "invalid-graph"
  | "missing-agent"
  | "missing-knowledge"
  | "missing-mcp"
  | "missing-model"
  | "missing-prompt"
  | "missing-skills"
  | "missing-tools"
  | "ready";

export interface SdkworkWorkflowRetryPolicy {
  initialBackoffMs?: number;
  maxAttempts: number;
  maxBackoffMs?: number;
}

export interface SdkworkWorkflowTrigger {
  eventName?: string;
  id: string;
  kind: SdkworkWorkflowTriggerKind;
  label: string;
  schedule?: string;
  timezone?: string;
  webhookPath?: string;
}

export interface SdkworkWorkflowBaseNode {
  description?: string;
  id: string;
  kind: SdkworkWorkflowNodeKind;
  label: string;
  onFailure?: SdkworkWorkflowNodeFailureMode;
  retryPolicy?: SdkworkWorkflowRetryPolicy;
  timeoutSeconds?: number;
}

export interface SdkworkWorkflowAgentNode extends SdkworkWorkflowBaseNode {
  agentId: string;
  kind: "agent";
}

export interface SdkworkWorkflowApprovalNode extends SdkworkWorkflowBaseNode {
  approvalKey: string;
  kind: "approval";
  policy: "all" | "any";
}

export interface SdkworkWorkflowConditionNode extends SdkworkWorkflowBaseNode {
  expression: string;
  kind: "condition";
}

export interface SdkworkWorkflowKnowledgeNode extends SdkworkWorkflowBaseNode {
  kind: "knowledge";
  knowledgeSpaceId: string;
}

export interface SdkworkWorkflowMcpNode extends SdkworkWorkflowBaseNode {
  kind: "mcp";
  mcpServerId: string;
}

export interface SdkworkWorkflowMemoryNode extends SdkworkWorkflowBaseNode {
  kind: "memory";
  memoryScope: SdkworkMemoryRecallScope;
}

export interface SdkworkWorkflowPromptNode extends SdkworkWorkflowBaseNode {
  kind: "prompt";
  promptAssetId: string;
}

export interface SdkworkWorkflowSkillNode extends SdkworkWorkflowBaseNode {
  kind: "skill";
  skillId: string;
}

export interface SdkworkWorkflowToolNode extends SdkworkWorkflowBaseNode {
  kind: "tool";
  toolId: string;
}

export type SdkworkWorkflowNode =
  | SdkworkWorkflowAgentNode
  | SdkworkWorkflowApprovalNode
  | SdkworkWorkflowConditionNode
  | SdkworkWorkflowKnowledgeNode
  | SdkworkWorkflowMcpNode
  | SdkworkWorkflowMemoryNode
  | SdkworkWorkflowPromptNode
  | SdkworkWorkflowSkillNode
  | SdkworkWorkflowToolNode;

export interface SdkworkWorkflowEdge {
  from: string;
  id: string;
  label?: string;
  outcome: SdkworkWorkflowEdgeOutcome;
  to: string;
}

export interface SdkworkWorkflowManifest {
  automationFitScore: number;
  concurrencyLimit?: number;
  description: string;
  edges: readonly SdkworkWorkflowEdge[];
  entryNodeId: string;
  id: string;
  name: string;
  nodes: readonly SdkworkWorkflowNode[];
  runPolicy?: SdkworkWorkflowRunPolicy;
  tags: readonly string[];
  triggers: readonly SdkworkWorkflowTrigger[];
  updatedAt: number;
  version: number;
}

export interface EvaluateWorkflowReadinessOptions extends EvaluateAgentReadinessOptions {
  agents?: readonly SdkworkAgentManifest[];
}

export interface CreateWorkflowDigestOptions extends EvaluateWorkflowReadinessOptions {}

export interface SdkworkWorkflowDigest {
  automationFitScore: number;
  hasApproval: boolean;
  hasCycles: boolean;
  id: string;
  name: string;
  nodeCount: number;
  readiness: SdkworkWorkflowReadiness;
  runPolicy: SdkworkWorkflowRunPolicy;
  triggerKinds: SdkworkWorkflowTriggerKind[];
  updatedAt: number;
  version: number;
}

export interface SdkworkWorkflowDigestSummary {
  latestUpdatedAt: number;
  readyWorkflows: number;
  totalNodes: number;
  totalTriggers: number;
  totalWorkflows: number;
  uniqueTriggerKindCount: number;
  workflowsWithApprovals: number;
  workflowsWithSchedules: number;
  workflowsWithWebhooks: number;
}

export interface SdkworkWorkflowTopologySummary {
  agentCount: number;
  approvalNodeCount: number;
  edgeCount: number;
  hasCycles: boolean;
  keyCounts: Record<SdkworkWorkflowNodeKind, number>;
  knowledgeCount: number;
  mcpCount: number;
  memoryScopeCount: number;
  nodeCount: number;
  promptCount: number;
  reachableNodeCount: number;
  skillCount: number;
  toolCount: number;
  triggerCount: number;
  unreachableNodeCount: number;
}

export interface FilterWorkflowCatalogOptions {
  query?: string;
  readiness?: readonly SdkworkWorkflowReadiness[];
  sort?: SdkworkWorkflowCatalogSortMode;
  tags?: readonly string[];
  triggerKinds?: readonly SdkworkWorkflowTriggerKind[];
}

export interface SdkworkWorkflowDependencyIds {
  agentIds: string[];
  knowledgeSpaceIds: string[];
  mcpServerIds: string[];
  memoryScopes: SdkworkMemoryRecallScope[];
  promptAssetIds: string[];
  skillIds: string[];
  toolIds: string[];
}

export interface SdkworkWorkflowExecutionPlan {
  adjacency: Record<string, string[]>;
  approvalNodeIds: string[];
  dependencyIds: SdkworkWorkflowDependencyIds;
  entryNodeId: string;
  hasCycles: boolean;
  nodeOrder: string[];
  runPolicy: SdkworkWorkflowRunPolicy;
  triggerKinds: SdkworkWorkflowTriggerKind[];
  workflowId: string;
}

export interface EvaluateWorkflowExecutionReadinessOptions
  extends EvaluateWorkflowReadinessOptions,
    Pick<CreateAgentLaunchPlanOptions, "promptCatalog"> {
  promptValuesByAssetId?: Record<string, Record<string, SdkworkPromptVariableValue>>;
}

export interface SdkworkWorkflowPromptLaunchEntry {
  nodeId: string;
  prompt: SdkworkCompiledPromptAsset;
  promptAssetId: string;
  promptStatus: SdkworkPromptStatus;
}

export interface SdkworkWorkflowAgentLaunchEntry {
  agentId: string;
  launchPlan: SdkworkAgentLaunchPlan;
  nodeId: string;
}

export interface SdkworkWorkflowLaunchBlueprint {
  agentLaunchPlans: SdkworkWorkflowAgentLaunchEntry[];
  executionPlan: SdkworkWorkflowExecutionPlan;
  promptEntries: SdkworkWorkflowPromptLaunchEntry[];
}

export type SdkworkWorkflowExecutionIssue =
  | SdkworkWorkflowReadiness
  | "archived-prompt"
  | "draft-prompt"
  | "empty-prompt"
  | "missing-prompt-variables";

export interface SdkworkWorkflowAgentExecutionEntry {
  agentId: string;
  degraded?: boolean;
  issues: SdkworkWorkflowExecutionIssue[];
  kind: "agent";
  launchPlan?: SdkworkAgentLaunchPlan;
  nodeId: string;
  ready: boolean;
}

export interface SdkworkWorkflowPromptExecutionEntry {
  degraded?: boolean;
  issues: SdkworkWorkflowExecutionIssue[];
  kind: "prompt";
  nodeId: string;
  prompt?: SdkworkCompiledPromptAsset;
  promptAssetId: string;
  promptStatus?: SdkworkPromptStatus;
  ready: boolean;
}

export type SdkworkWorkflowExecutionEntry =
  | SdkworkWorkflowAgentExecutionEntry
  | SdkworkWorkflowPromptExecutionEntry;

export interface SdkworkWorkflowExecutionReadiness {
  blueprint?: SdkworkWorkflowLaunchBlueprint;
  degraded: boolean;
  entries: SdkworkWorkflowExecutionEntry[];
  issues: SdkworkWorkflowExecutionIssue[];
  ready: boolean;
}

export interface SdkworkWorkflowRunStartedEvent {
  at: number;
  runId: string;
  triggerKind: SdkworkWorkflowTriggerKind;
  type: "run-started";
  workflowId: string;
}

export interface SdkworkWorkflowNodeStartedEvent {
  at: number;
  nodeId: string;
  runId: string;
  type: "node-started";
  workflowId: string;
}

export interface SdkworkWorkflowNodeCompletedEvent {
  at: number;
  nodeId: string;
  runId: string;
  type: "node-completed";
  workflowId: string;
}

export interface SdkworkWorkflowAwaitingApprovalEvent {
  approvalNodeId: string;
  at: number;
  runId: string;
  type: "awaiting-approval";
  workflowId: string;
}

export interface SdkworkWorkflowNodeFailedEvent {
  at: number;
  error: string;
  nodeId: string;
  runId: string;
  type: "node-failed";
  workflowId: string;
}

export interface SdkworkWorkflowRunCompletedEvent {
  at: number;
  runId: string;
  type: "run-completed";
  workflowId: string;
}

export interface SdkworkWorkflowRunFailedEvent {
  at: number;
  error: string;
  failedNodeId?: string;
  runId: string;
  type: "run-failed";
  workflowId: string;
}

export type SdkworkWorkflowExecutionEvent =
  | SdkworkWorkflowAwaitingApprovalEvent
  | SdkworkWorkflowNodeCompletedEvent
  | SdkworkWorkflowNodeFailedEvent
  | SdkworkWorkflowNodeStartedEvent
  | SdkworkWorkflowRunCompletedEvent
  | SdkworkWorkflowRunFailedEvent
  | SdkworkWorkflowRunStartedEvent;

export interface SdkworkWorkflowExecutionSummary {
  awaitingApprovalNodeId?: string;
  completedAt?: number;
  completedNodeIds: string[];
  durationMs?: number;
  error?: string;
  failedNodeId?: string;
  lastNodeId?: string;
  runId?: string;
  startedAt?: number;
  status: "awaiting-approval" | "completed" | "failed" | "running";
  triggerKind?: SdkworkWorkflowTriggerKind;
  workflowId?: string;
}

export interface SdkworkWorkflowWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "workflow";
  detailRoutePattern: string;
  routePath: string;
  runDetailRoutePattern: string;
}

export interface CreateWorkflowWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkWorkflowLibraryRouteIntent {
  focusWindow: boolean;
  readiness?: SdkworkWorkflowReadiness;
  route: string;
  source: "workflow-workspace";
  trigger?: SdkworkWorkflowTriggerKind;
  type: "workflow-library-route-intent";
}

export interface CreateWorkflowLibraryRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  readiness?: SdkworkWorkflowReadiness;
  trigger?: SdkworkWorkflowTriggerKind;
}

export interface SdkworkWorkflowDetailRouteIntent {
  focusWindow: boolean;
  route: string;
  source: "workflow-workspace";
  type: "workflow-detail-route-intent";
  workflowId: string;
}

export interface CreateWorkflowDetailRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

export interface SdkworkWorkflowRunRouteIntent {
  focusWindow: boolean;
  route: string;
  runId: string;
  source: "workflow-workspace";
  type: "workflow-run-route-intent";
  workflowId: string;
}

export interface CreateWorkflowRunRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
}

interface WorkflowGraphAnalysis {
  adjacency: Record<string, string[]>;
  duplicateNodeIds: boolean;
  hasCycles: boolean;
  missingEntryNode: boolean;
  nodeMap: Map<string, SdkworkWorkflowNode>;
  nodeOrder: string[];
  unreachableNodeIds: string[];
  valid: boolean;
}

function createNodeKindCounts(): Record<SdkworkWorkflowNodeKind, number> {
  return {
    agent: 0,
    approval: 0,
    condition: 0,
    knowledge: 0,
    mcp: 0,
    memory: 0,
    prompt: 0,
    skill: 0,
    tool: 0,
  };
}

function normalizeQuery(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function toUniqueWorkflowExecutionIssues(
  issues: readonly SdkworkWorkflowExecutionIssue[],
): SdkworkWorkflowExecutionIssue[] {
  const seen = new Set<SdkworkWorkflowExecutionIssue>();
  const uniqueIssues: SdkworkWorkflowExecutionIssue[] = [];

  for (const issue of issues) {
    if (seen.has(issue)) {
      continue;
    }

    seen.add(issue);
    uniqueIssues.push(issue);
  }

  return uniqueIssues;
}

function toUniquePackages(packageNames: readonly string[]): string[] {
  return Array.from(new Set(packageNames.map((packageName) => packageName.trim()).filter(Boolean)));
}

function toUniqueOrderedStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function toSortedUniqueStrings(values: readonly string[]): string[] {
  return toUniqueOrderedStrings(values).sort((left, right) => left.localeCompare(right));
}

function toSortedUniqueMemoryScopes(
  values: readonly SdkworkMemoryRecallScope[],
): SdkworkMemoryRecallScope[] {
  return toSortedUniqueStrings(values) as SdkworkMemoryRecallScope[];
}

function findPromptAsset(
  promptAssetId: string,
  promptCatalog: readonly SdkworkPromptAsset[] | undefined,
): SdkworkPromptAsset | undefined {
  return promptCatalog?.find((prompt) => prompt.id === promptAssetId);
}

function triggerKindsForWorkflow(
  workflow: Pick<SdkworkWorkflowManifest, "triggers">,
): SdkworkWorkflowTriggerKind[] {
  return toUniqueOrderedStrings(workflow.triggers.map((trigger) => trigger.kind)) as SdkworkWorkflowTriggerKind[];
}

function workflowSearchValues(workflow: SdkworkWorkflowManifest): string[] {
  return [
    workflow.id,
    workflow.name,
    workflow.description,
    ...workflow.tags,
    ...workflow.triggers.flatMap((trigger) => [
      trigger.id,
      trigger.kind,
      trigger.label,
      trigger.eventName ?? "",
      trigger.schedule ?? "",
      trigger.webhookPath ?? "",
    ]),
    ...workflow.nodes.flatMap((node) => {
      switch (node.kind) {
        case "agent":
          return [node.id, node.kind, node.label, node.agentId];
        case "approval":
          return [node.id, node.kind, node.label, node.approvalKey, node.policy];
        case "condition":
          return [node.id, node.kind, node.label, node.expression];
        case "knowledge":
          return [node.id, node.kind, node.label, node.knowledgeSpaceId];
        case "mcp":
          return [node.id, node.kind, node.label, node.mcpServerId];
        case "memory":
          return [node.id, node.kind, node.label, node.memoryScope];
        case "prompt":
          return [node.id, node.kind, node.label, node.promptAssetId];
        case "skill":
          return [node.id, node.kind, node.label, node.skillId];
        case "tool":
          return [node.id, node.kind, node.label, node.toolId];
      }
    }),
  ];
}

function sortWorkflowCatalog(
  workflows: readonly SdkworkWorkflowManifest[],
  mode: SdkworkWorkflowCatalogSortMode = "automation-fit",
): SdkworkWorkflowManifest[] {
  return [...workflows].sort((left, right) => {
    if (mode === "latest") {
      const updatedDifference = right.updatedAt - left.updatedAt;
      if (updatedDifference !== 0) {
        return updatedDifference;
      }
    }

    if (mode === "automation-fit") {
      const scoreDifference = right.automationFitScore - left.automationFitScore;
      if (scoreDifference !== 0) {
        return scoreDifference;
      }
    }

    return left.name.localeCompare(right.name);
  });
}

function mapAgentReadiness(readiness: Exclude<SdkworkAgentReadiness, "ready">): SdkworkWorkflowReadiness {
  switch (readiness) {
    case "missing-model":
      return "missing-model";
    case "missing-prompt":
      return "missing-prompt";
    case "missing-skills":
      return "missing-skills";
    case "missing-tools":
      return "missing-tools";
    case "missing-mcp":
      return "missing-mcp";
    default:
      return "missing-agent";
  }
}

function mapAgentExecutionIssue(
  issue: SdkworkAgentExecutionIssue,
): SdkworkWorkflowExecutionIssue {
  switch (issue) {
    case "archived-prompt":
      return "archived-prompt";
    case "draft-prompt":
      return "draft-prompt";
    case "empty-prompt":
      return "empty-prompt";
    case "missing-prompt-variables":
      return "missing-prompt-variables";
    default:
      return issue;
  }
}

function mapPromptExecutionIssues(
  issues: readonly string[],
): SdkworkWorkflowExecutionIssue[] {
  return toUniqueWorkflowExecutionIssues(
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

function analyzeWorkflowGraph(workflow: SdkworkWorkflowManifest): WorkflowGraphAnalysis {
  const nodeMap = new Map<string, SdkworkWorkflowNode>();
  const adjacency = workflow.nodes.reduce<Record<string, string[]>>((accumulator, node) => {
    if (!accumulator[node.id]) {
      accumulator[node.id] = [];
    }
    return accumulator;
  }, {});

  let duplicateNodeIds = false;
  for (const node of workflow.nodes) {
    if (nodeMap.has(node.id)) {
      duplicateNodeIds = true;
      continue;
    }

    nodeMap.set(node.id, node);
  }

  let invalidEdges = false;
  for (const edge of workflow.edges) {
    const fromExists = nodeMap.has(edge.from);
    const toExists = nodeMap.has(edge.to);

    if (!fromExists || !toExists) {
      invalidEdges = true;
    }

    if (adjacency[edge.from]) {
      adjacency[edge.from].push(edge.to);
    }
  }

  const missingEntryNode = !nodeMap.has(workflow.entryNodeId);
  const nodeOrder: string[] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  let hasCycles = false;

  function visit(nodeId: string) {
    if (visiting.has(nodeId)) {
      hasCycles = true;
      return;
    }

    if (visited.has(nodeId)) {
      return;
    }

    const node = nodeMap.get(nodeId);
    if (!node) {
      invalidEdges = true;
      return;
    }

    visiting.add(nodeId);
    nodeOrder.push(node.id);

    for (const nextNodeId of adjacency[nodeId] ?? []) {
      visit(nextNodeId);
    }

    visiting.delete(nodeId);
    visited.add(nodeId);
  }

  if (!missingEntryNode) {
    visit(workflow.entryNodeId);
  }

  const unreachableNodeIds = workflow.nodes
    .map((node) => node.id)
    .filter((nodeId) => !visited.has(nodeId));

  return {
    adjacency,
    duplicateNodeIds,
    hasCycles,
    missingEntryNode,
    nodeMap,
    nodeOrder,
    unreachableNodeIds,
    valid:
      !duplicateNodeIds &&
      !invalidEdges &&
      !missingEntryNode &&
      unreachableNodeIds.length === 0,
  };
}

function collectDirectDependencies(workflow: SdkworkWorkflowManifest): SdkworkWorkflowDependencyIds {
  const agentIds: string[] = [];
  const knowledgeSpaceIds: string[] = [];
  const mcpServerIds: string[] = [];
  const memoryScopes: SdkworkMemoryRecallScope[] = [];
  const promptAssetIds: string[] = [];
  const skillIds: string[] = [];
  const toolIds: string[] = [];

  for (const node of workflow.nodes) {
    switch (node.kind) {
      case "agent":
        agentIds.push(node.agentId);
        break;
      case "knowledge":
        knowledgeSpaceIds.push(node.knowledgeSpaceId);
        break;
      case "mcp":
        mcpServerIds.push(node.mcpServerId);
        break;
      case "memory":
        memoryScopes.push(node.memoryScope);
        break;
      case "prompt":
        promptAssetIds.push(node.promptAssetId);
        break;
      case "skill":
        skillIds.push(node.skillId);
        break;
      case "tool":
        toolIds.push(node.toolId);
        break;
      default:
        break;
    }
  }

  return {
    agentIds: toSortedUniqueStrings(agentIds),
    knowledgeSpaceIds: toSortedUniqueStrings(knowledgeSpaceIds),
    mcpServerIds: toSortedUniqueStrings(mcpServerIds),
    memoryScopes: toSortedUniqueMemoryScopes(memoryScopes),
    promptAssetIds: toSortedUniqueStrings(promptAssetIds),
    skillIds: toSortedUniqueStrings(skillIds),
    toolIds: toSortedUniqueStrings(toolIds),
  };
}

function collectExpandedDependencies(
  workflow: SdkworkWorkflowManifest,
  options: EvaluateWorkflowReadinessOptions = {},
): SdkworkWorkflowDependencyIds {
  const dependencies = collectDirectDependencies(workflow);
  if (!options.agents || dependencies.agentIds.length === 0) {
    return dependencies;
  }

  const agentMap = new Map(options.agents.map((agent) => [agent.id, agent] as const));
  const knowledgeSpaceIds = [...dependencies.knowledgeSpaceIds];
  const mcpServerIds = [...dependencies.mcpServerIds];
  const memoryScopes = [...dependencies.memoryScopes];
  const promptAssetIds = [...dependencies.promptAssetIds];
  const skillIds = [...dependencies.skillIds];
  const toolIds = [...dependencies.toolIds];

  for (const agentId of dependencies.agentIds) {
    const agent = agentMap.get(agentId);
    if (!agent) {
      continue;
    }

    if (agent.promptAssetId) {
      promptAssetIds.push(agent.promptAssetId);
    }

    knowledgeSpaceIds.push(...agent.knowledgeSpaceIds);
    mcpServerIds.push(...agent.mcpServerIds);
    memoryScopes.push(...agent.memoryScopes);
    skillIds.push(...agent.skillIds);
    toolIds.push(...agent.toolIds);
  }

  return {
    agentIds: dependencies.agentIds,
    knowledgeSpaceIds: toSortedUniqueStrings(knowledgeSpaceIds),
    mcpServerIds: toSortedUniqueStrings(mcpServerIds),
    memoryScopes: toSortedUniqueMemoryScopes(memoryScopes),
    promptAssetIds: toSortedUniqueStrings(promptAssetIds),
    skillIds: toSortedUniqueStrings(skillIds),
    toolIds: toSortedUniqueStrings(toolIds),
  };
}

export function evaluateWorkflowReadiness(
  workflow: SdkworkWorkflowManifest,
  options: EvaluateWorkflowReadinessOptions = {},
): SdkworkWorkflowReadiness {
  const graph = analyzeWorkflowGraph(workflow);
  if (!graph.valid) {
    return "invalid-graph";
  }

  const promptIds = options.prompts ? new Set(options.prompts.map((prompt) => prompt.id)) : null;
  const skillMap = options.skills ? new Map(options.skills.map((skill) => [skill.id, skill] as const)) : null;
  const toolMap = options.tools ? new Map(options.tools.map((tool) => [tool.id, tool] as const)) : null;
  const mcpMap = options.mcpServers
    ? new Map(options.mcpServers.map((server) => [server.id, server] as const))
    : null;
  const knowledgeMap = options.knowledgeSpaces
    ? new Map(options.knowledgeSpaces.map((space) => [space.id, space] as const))
    : null;
  const agentMap = options.agents ? new Map(options.agents.map((agent) => [agent.id, agent] as const)) : null;

  for (const node of workflow.nodes) {
    switch (node.kind) {
      case "agent": {
        if (!agentMap) {
          break;
        }

        const agent = agentMap.get(node.agentId);
        if (!agent) {
          return "missing-agent";
        }

        const readiness = evaluateAgentReadiness(agent, options);
        if (readiness !== "ready") {
          return mapAgentReadiness(readiness);
        }
        break;
      }
      case "knowledge":
        if (knowledgeMap && !knowledgeMap.has(node.knowledgeSpaceId)) {
          return "missing-knowledge";
        }
        break;
      case "mcp": {
        const server = mcpMap?.get(node.mcpServerId);
        if (mcpMap && (!server || server.readiness !== "ready")) {
          return "missing-mcp";
        }
        break;
      }
      case "prompt":
        if (promptIds && !promptIds.has(node.promptAssetId)) {
          return "missing-prompt";
        }
        break;
      case "skill": {
        const skill = skillMap?.get(node.skillId);
        if (skillMap && (!skill || resolveSkillReadiness(skill) !== "ready")) {
          return "missing-skills";
        }
        break;
      }
      case "tool": {
        const tool = toolMap?.get(node.toolId);
        if (toolMap && (!tool || tool.status === "disabled")) {
          return "missing-tools";
        }
        break;
      }
      default:
        break;
    }
  }

  return "ready";
}

export function createWorkflowDigest(
  workflow: SdkworkWorkflowManifest,
  options: CreateWorkflowDigestOptions = {},
): SdkworkWorkflowDigest {
  const graph = analyzeWorkflowGraph(workflow);

  return {
    automationFitScore: workflow.automationFitScore,
    hasApproval: workflow.nodes.some((node) => node.kind === "approval"),
    hasCycles: graph.hasCycles,
    id: workflow.id,
    name: workflow.name,
    nodeCount: workflow.nodes.length,
    readiness: evaluateWorkflowReadiness(workflow, options),
    runPolicy: workflow.runPolicy ?? "singleton",
    triggerKinds: triggerKindsForWorkflow(workflow),
    updatedAt: workflow.updatedAt,
    version: workflow.version,
  };
}

export function summarizeWorkflowDigests(
  digests: readonly SdkworkWorkflowDigest[],
): SdkworkWorkflowDigestSummary {
  const triggerKinds = new Set<SdkworkWorkflowTriggerKind>();
  let latestUpdatedAt = 0;
  let readyWorkflows = 0;
  let totalNodes = 0;
  let totalTriggers = 0;
  let workflowsWithApprovals = 0;
  let workflowsWithSchedules = 0;
  let workflowsWithWebhooks = 0;

  for (const digest of digests) {
    latestUpdatedAt = Math.max(latestUpdatedAt, digest.updatedAt);
    totalNodes += digest.nodeCount;
    totalTriggers += digest.triggerKinds.length;

    if (digest.readiness === "ready") {
      readyWorkflows += 1;
    }

    if (digest.hasApproval) {
      workflowsWithApprovals += 1;
    }

    if (digest.triggerKinds.includes("schedule")) {
      workflowsWithSchedules += 1;
    }

    if (digest.triggerKinds.includes("webhook")) {
      workflowsWithWebhooks += 1;
    }

    digest.triggerKinds.forEach((kind) => triggerKinds.add(kind));
  }

  return {
    latestUpdatedAt,
    readyWorkflows,
    totalNodes,
    totalTriggers,
    totalWorkflows: digests.length,
    uniqueTriggerKindCount: triggerKinds.size,
    workflowsWithApprovals,
    workflowsWithSchedules,
    workflowsWithWebhooks,
  };
}

export function summarizeWorkflowTopology(
  workflow: SdkworkWorkflowManifest,
): SdkworkWorkflowTopologySummary {
  const graph = analyzeWorkflowGraph(workflow);
  const keyCounts = createNodeKindCounts();
  const dependencies = collectDirectDependencies(workflow);

  for (const node of workflow.nodes) {
    keyCounts[node.kind] += 1;
  }

  return {
    agentCount: dependencies.agentIds.length,
    approvalNodeCount: keyCounts.approval,
    edgeCount: workflow.edges.length,
    hasCycles: graph.hasCycles,
    keyCounts,
    knowledgeCount: dependencies.knowledgeSpaceIds.length,
    mcpCount: dependencies.mcpServerIds.length,
    memoryScopeCount: dependencies.memoryScopes.length,
    nodeCount: workflow.nodes.length,
    promptCount: dependencies.promptAssetIds.length,
    reachableNodeCount: graph.nodeOrder.length,
    skillCount: dependencies.skillIds.length,
    toolCount: dependencies.toolIds.length,
    triggerCount: workflow.triggers.length,
    unreachableNodeCount: graph.unreachableNodeIds.length,
  };
}

export function filterWorkflowCatalog(
  workflows: readonly SdkworkWorkflowManifest[],
  options: FilterWorkflowCatalogOptions = {},
  readinessOptions: EvaluateWorkflowReadinessOptions = {},
): SdkworkWorkflowManifest[] {
  const readiness = options.readiness ? new Set(options.readiness) : null;
  const tags = options.tags ?? [];
  const triggerKinds = options.triggerKinds ? new Set(options.triggerKinds) : null;
  const query = normalizeQuery(options.query);

  return sortWorkflowCatalog(workflows, options.sort)
    .filter((workflow) =>
      readiness ? readiness.has(evaluateWorkflowReadiness(workflow, readinessOptions)) : true,
    )
    .filter((workflow) => (tags.length > 0 ? tags.every((tag) => workflow.tags.includes(tag)) : true))
    .filter((workflow) =>
      triggerKinds ? triggerKindsForWorkflow(workflow).some((kind) => triggerKinds.has(kind)) : true,
    )
    .filter((workflow) =>
      query
        ? workflowSearchValues(workflow).some((value) => value.toLowerCase().includes(query))
        : true,
    );
}

export function buildWorkflowExecutionPlan(
  workflow: SdkworkWorkflowManifest,
  options: EvaluateWorkflowReadinessOptions = {},
): SdkworkWorkflowExecutionPlan {
  const graph = analyzeWorkflowGraph(workflow);
  if (!graph.valid) {
    throw new Error(`Workflow ${workflow.id} has an invalid graph.`);
  }

  return {
    adjacency: Object.fromEntries(
      workflow.nodes.map((node) => [node.id, [...(graph.adjacency[node.id] ?? [])]]),
    ),
    approvalNodeIds: workflow.nodes
      .filter((node): node is SdkworkWorkflowApprovalNode => node.kind === "approval")
      .map((node) => node.id)
      .sort((left, right) => left.localeCompare(right)),
    dependencyIds: collectExpandedDependencies(workflow, options),
    entryNodeId: workflow.entryNodeId,
    hasCycles: graph.hasCycles,
    nodeOrder: graph.nodeOrder,
    runPolicy: workflow.runPolicy ?? "singleton",
    triggerKinds: triggerKindsForWorkflow(workflow),
    workflowId: workflow.id,
  };
}

export function buildWorkflowLaunchBlueprint(
  workflow: SdkworkWorkflowManifest,
  options: EvaluateWorkflowExecutionReadinessOptions = {},
): SdkworkWorkflowLaunchBlueprint {
  const executionPlan = buildWorkflowExecutionPlan(workflow, options);
  const agentMap = new Map((options.agents ?? []).map((agent) => [agent.id, agent] as const));
  const agentLaunchPlans: SdkworkWorkflowAgentLaunchEntry[] = [];
  const promptEntries: SdkworkWorkflowPromptLaunchEntry[] = [];

  for (const node of workflow.nodes) {
    if (node.kind === "agent") {
      const agent = agentMap.get(node.agentId);
      if (!agent) {
        throw new Error(`Workflow ${workflow.id} references unknown agent ${node.agentId}.`);
      }

      agentLaunchPlans.push({
        agentId: node.agentId,
        launchPlan: createAgentLaunchPlan(agent, {
          ...options,
          promptValues: options.promptValuesByAssetId?.[agent.promptAssetId ?? ""],
        }),
        nodeId: node.id,
      });
      continue;
    }

    if (node.kind !== "prompt") {
      continue;
    }

    const promptAsset = findPromptAsset(node.promptAssetId, options.promptCatalog);
    if (!promptAsset) {
      throw new Error(`Workflow ${workflow.id} references unknown prompt ${node.promptAssetId}.`);
    }

    const promptReadiness = evaluatePromptExecutionReadiness(promptAsset, {
      values: options.promptValuesByAssetId?.[node.promptAssetId],
    });
    if (!promptReadiness.compiled || !promptReadiness.status) {
      throw new Error(`Workflow ${workflow.id} prompt ${node.promptAssetId} cannot be compiled.`);
    }

    promptEntries.push({
      nodeId: node.id,
      prompt: promptReadiness.compiled,
      promptAssetId: node.promptAssetId,
      promptStatus: promptReadiness.status,
    });
  }

  return {
    agentLaunchPlans,
    executionPlan,
    promptEntries,
  };
}

export function evaluateWorkflowExecutionReadiness(
  workflow: SdkworkWorkflowManifest,
  options: EvaluateWorkflowExecutionReadinessOptions = {},
): SdkworkWorkflowExecutionReadiness {
  const workflowReadiness = evaluateWorkflowReadiness(workflow, options);
  if (workflowReadiness !== "ready") {
    return {
      degraded: false,
      entries: [],
      issues: [workflowReadiness],
      ready: false,
    };
  }

  const executionPlan = buildWorkflowExecutionPlan(workflow, options);
  const agentMap = new Map((options.agents ?? []).map((agent) => [agent.id, agent] as const));
  const agentLaunchPlans: SdkworkWorkflowAgentLaunchEntry[] = [];
  const promptEntries: SdkworkWorkflowPromptLaunchEntry[] = [];
  const entries: SdkworkWorkflowExecutionEntry[] = [];

  for (const node of workflow.nodes) {
    if (node.kind === "agent") {
      const agent = agentMap.get(node.agentId);
      if (!agent) {
        entries.push({
          agentId: node.agentId,
          issues: ["missing-agent"],
          kind: "agent",
          nodeId: node.id,
          ready: false,
        });
        continue;
      }

      const readiness = evaluateAgentExecutionReadiness(agent, {
        ...options,
        promptValues: options.promptValuesByAssetId?.[agent.promptAssetId ?? ""],
      });
      const issues = toUniqueWorkflowExecutionIssues(readiness.issues.map(mapAgentExecutionIssue));

      if (readiness.launchPlan) {
        agentLaunchPlans.push({
          agentId: node.agentId,
          launchPlan: readiness.launchPlan,
          nodeId: node.id,
        });
      }

      entries.push({
        agentId: node.agentId,
        ...(readiness.degraded ? { degraded: true } : {}),
        issues,
        kind: "agent",
        ...(readiness.launchPlan ? { launchPlan: readiness.launchPlan } : {}),
        nodeId: node.id,
        ready: readiness.ready,
      });
      continue;
    }

    if (node.kind !== "prompt") {
      continue;
    }

    const promptAsset = findPromptAsset(node.promptAssetId, options.promptCatalog);
    if (!promptAsset) {
      entries.push({
        issues: ["missing-prompt"],
        kind: "prompt",
        nodeId: node.id,
        promptAssetId: node.promptAssetId,
        ready: false,
      });
      continue;
    }

    const readiness = evaluatePromptExecutionReadiness(promptAsset, {
      values: options.promptValuesByAssetId?.[node.promptAssetId],
    });
    const issues = mapPromptExecutionIssues(readiness.issues);

    if (readiness.compiled && readiness.status) {
      promptEntries.push({
        nodeId: node.id,
        prompt: readiness.compiled,
        promptAssetId: node.promptAssetId,
        promptStatus: readiness.status,
      });
    }

    entries.push({
      ...(readiness.degraded ? { degraded: true } : {}),
      issues,
      kind: "prompt",
      nodeId: node.id,
      ...(readiness.compiled ? { prompt: readiness.compiled } : {}),
      promptAssetId: node.promptAssetId,
      ...(readiness.status ? { promptStatus: readiness.status } : {}),
      ready: readiness.ready,
    });
  }

  const issues = toUniqueWorkflowExecutionIssues(entries.flatMap((entry) => entry.issues));

  return {
    blueprint: {
      agentLaunchPlans,
      executionPlan,
      promptEntries,
    },
    degraded: entries.some((entry) => entry.degraded === true),
    entries,
    issues,
    ready: entries.every((entry) => entry.ready),
  };
}

export function reduceWorkflowExecutionEvents(
  events: readonly SdkworkWorkflowExecutionEvent[],
): SdkworkWorkflowExecutionSummary {
  const completedNodeIds: string[] = [];
  const completedNodeIdSet = new Set<string>();
  let awaitingApprovalNodeId: string | undefined;
  let completedAt: number | undefined;
  let error: string | undefined;
  let failedNodeId: string | undefined;
  let lastNodeId: string | undefined;
  let runId: string | undefined;
  let startedAt: number | undefined;
  let status: SdkworkWorkflowExecutionSummary["status"] = "running";
  let triggerKind: SdkworkWorkflowTriggerKind | undefined;
  let workflowId: string | undefined;

  for (const event of events) {
    runId = event.runId;
    workflowId = event.workflowId;

    switch (event.type) {
      case "run-started":
        startedAt = event.at;
        triggerKind = event.triggerKind;
        break;
      case "node-started":
        lastNodeId = event.nodeId;
        break;
      case "node-completed":
        lastNodeId = event.nodeId;
        if (!completedNodeIdSet.has(event.nodeId)) {
          completedNodeIdSet.add(event.nodeId);
          completedNodeIds.push(event.nodeId);
        }
        break;
      case "awaiting-approval":
        awaitingApprovalNodeId = event.approvalNodeId;
        lastNodeId = event.approvalNodeId;
        status = "awaiting-approval";
        break;
      case "node-failed":
        completedAt = event.at;
        error = event.error;
        failedNodeId = event.nodeId;
        lastNodeId = event.nodeId;
        status = "failed";
        break;
      case "run-completed":
        completedAt = event.at;
        status = "completed";
        break;
      case "run-failed":
        completedAt = event.at;
        error = event.error;
        failedNodeId = event.failedNodeId ?? failedNodeId;
        status = "failed";
        break;
      default:
        break;
    }
  }

  return {
    ...(status === "awaiting-approval" && awaitingApprovalNodeId
      ? { awaitingApprovalNodeId }
      : {}),
    ...(completedAt !== undefined ? { completedAt } : {}),
    completedNodeIds,
    ...(startedAt !== undefined && completedAt !== undefined
      ? { durationMs: Math.max(completedAt - startedAt, 0) }
      : {}),
    ...(error ? { error } : {}),
    ...(failedNodeId ? { failedNodeId } : {}),
    ...(lastNodeId ? { lastNodeId } : {}),
    ...(runId ? { runId } : {}),
    ...(startedAt !== undefined ? { startedAt } : {}),
    status,
    ...(triggerKind ? { triggerKind } : {}),
    ...(workflowId ? { workflowId } : {}),
  };
}

export function createWorkflowWorkspaceManifest({
  description = "Workflow workspace for graph manifests, orchestration readiness, and execution routing.",
  host,
  id = "sdkwork-workflow",
  packageNames = [
    "@sdkwork/workflow-pc-react",
    "@sdkwork/agent-pc-react",
    "@sdkwork/prompt-pc-react",
    "@sdkwork/skills-pc-react",
    "@sdkwork/tools-pc-react",
    "@sdkwork/mcp-pc-react",
    "@sdkwork/knowledge-pc-react",
    "@sdkwork/memory-pc-react",
  ],
  routePath = "/workflows",
  theme,
  title = "Workflows",
}: CreateWorkflowWorkspaceManifestOptions = {}): SdkworkWorkflowWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames: toUniquePackages(packageNames),
      theme,
      title,
    }),
    capability: "workflow",
    detailRoutePattern: `${routePath}/:workflowId`,
    routePath,
    runDetailRoutePattern: `${routePath}/:workflowId/runs/:runId`,
  };
}

export function createWorkflowLibraryRouteIntent(
  options: CreateWorkflowLibraryRouteIntentOptions = {},
): SdkworkWorkflowLibraryRouteIntent {
  const queryParams = new URLSearchParams();

  if (options.trigger) {
    queryParams.set("trigger", options.trigger);
  }

  if (options.readiness) {
    queryParams.set("readiness", options.readiness);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.readiness ? { readiness: options.readiness } : {}),
    route: `${options.basePath ?? "/workflows"}${querySuffix}`,
    source: "workflow-workspace",
    ...(options.trigger ? { trigger: options.trigger } : {}),
    type: "workflow-library-route-intent",
  };
}

export function createWorkflowDetailRouteIntent(
  workflowId: string,
  options: CreateWorkflowDetailRouteIntentOptions = {},
): SdkworkWorkflowDetailRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/workflows"}/${workflowId}`,
    source: "workflow-workspace",
    type: "workflow-detail-route-intent",
    workflowId,
  };
}

export function createWorkflowRunRouteIntent(
  workflowId: string,
  runId: string,
  options: CreateWorkflowRunRouteIntentOptions = {},
): SdkworkWorkflowRunRouteIntent {
  return {
    focusWindow: options.focusWindow !== false,
    route: `${options.basePath ?? "/workflows"}/${workflowId}/runs/${runId}`,
    runId,
    source: "workflow-workspace",
    type: "workflow-run-route-intent",
    workflowId,
  };
}

export const workflowPackageMeta = {
  architecture: "pc-react",
  domain: "intelligence",
  package: "@sdkwork/workflow-pc-react",
  status: "ready",
} as const;

export type WorkflowPackageMeta = typeof workflowPackageMeta;
