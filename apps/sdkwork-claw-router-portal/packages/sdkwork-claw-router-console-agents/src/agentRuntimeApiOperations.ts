import {
  createRequestToken,
  getClawRouterAppSdkClient,
  type ClawRouterAppSdkClient,
  type JsonValue,
} from 'sdkwork-claw-router-commons/runtime';

type JsonObject = Record<string, JsonValue>;

interface MutationOptions {
  idempotencyKey?: string;
  xRequestId?: string;
}

interface PageParams {
  page?: number;
  pageSize?: number;
}

export interface AgentSessionCreateBody {
  agentVersionId?: string;
  chatConversationId?: string;
  defaultModel?: string;
  memorySpaceId?: string;
  metadata?: JsonObject;
  runtime?: 'claude_code' | 'gemini' | 'codex' | 'openai' | 'anthropic' | 'custom';
  sessionKind?: 'chat' | 'coding' | 'interactive' | 'task' | 'background' | 'evaluation';
  sourceSurface?: string;
  title?: string;
}

export interface AgentRunCreateBody {
  agentId: string;
  agentVersionId: string;
  executionMode?: string;
  inputMessage?: string;
  memorySpaceId?: string;
  metadata?: JsonObject;
  model?: string;
  requestId: string;
  runtime?: string;
  sourceSurface?: string;
}

export interface AgentRunStepCreateBody {
  inputJson?: JsonObject;
  metadata?: JsonObject;
  model?: string;
  outputJson?: JsonObject;
  runtimeInvocationId?: string;
  status?: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  stepType?: 'input' | 'model' | 'tool' | 'memory' | 'runtime' | 'system' | 'custom';
  title?: string;
  toolName?: string;
}

export interface AgentRunCompleteBody {
  errorMessageMasked?: string;
  metadata?: JsonObject;
  outputMessage?: string;
  status?: 'completed' | 'failed' | 'cancelled';
}

export interface AgentRunStepCompleteBody {
  errorMessageMasked?: string;
  metadata?: JsonObject;
  outputJson?: JsonObject;
  status?: 'completed' | 'failed' | 'cancelled';
  usageJson?: JsonObject;
}

function appClient(client?: ClawRouterAppSdkClient): ClawRouterAppSdkClient {
  return client ?? getClawRouterAppSdkClient();
}

function mutationParams(prefix: string, options: MutationOptions = {}): { idempotencyKey: string; xRequestId?: string } {
  return {
    idempotencyKey: options.idempotencyKey ?? createRequestToken(prefix),
    xRequestId: options.xRequestId,
  };
}

export async function listAgentSessions(
  agentId: string,
  params: PageParams = { pageSize: 100 },
  client?: ClawRouterAppSdkClient,
): Promise<unknown> {
  return appClient(client).agents.agentSessions.list(agentId, params);
}

export async function createAgentSession(
  agentId: string,
  body: AgentSessionCreateBody,
  options?: MutationOptions,
  client?: ClawRouterAppSdkClient,
): Promise<unknown> {
  return appClient(client).agents.agentSessions.create(
    agentId,
    body,
    mutationParams('agent-session', options),
  );
}

export async function retrieveAgentSession(
  sessionId: string,
  client?: ClawRouterAppSdkClient,
): Promise<unknown> {
  return appClient(client).agents.agentSessions.retrieve(sessionId);
}

export async function listAgentRuns(
  sessionId: string,
  params: PageParams = { pageSize: 100 },
  client?: ClawRouterAppSdkClient,
): Promise<unknown> {
  return appClient(client).agents.agentRuns.list(sessionId, params);
}

export async function createAgentRun(
  sessionId: string,
  body: AgentRunCreateBody,
  options?: MutationOptions,
  client?: ClawRouterAppSdkClient,
): Promise<unknown> {
  return appClient(client).agents.agentRuns.create(
    sessionId,
    body,
    mutationParams('agent-run', options),
  );
}

export async function retrieveAgentRun(
  runId: string,
  client?: ClawRouterAppSdkClient,
): Promise<unknown> {
  return appClient(client).agents.agentRuns.retrieve(runId);
}

export async function listAgentRunSteps(
  runId: string,
  params: PageParams = { pageSize: 100 },
  client?: ClawRouterAppSdkClient,
): Promise<unknown> {
  return appClient(client).agents.agentRunSteps.list(runId, params);
}

export async function createAgentRunStep(
  runId: string,
  body: AgentRunStepCreateBody,
  options?: MutationOptions,
  client?: ClawRouterAppSdkClient,
): Promise<unknown> {
  return appClient(client).agents.agentRunSteps.create(
    runId,
    body,
    mutationParams('agent-run-step', options),
  );
}

export async function completeAgentRunStep(
  runId: string,
  stepId: string,
  body: AgentRunStepCompleteBody,
  options?: MutationOptions,
  client?: ClawRouterAppSdkClient,
): Promise<unknown> {
  return appClient(client).agents.agentRunSteps.submit(
    runId,
    stepId,
    body,
    mutationParams('agent-run-step-complete', options),
  );
}

export async function completeAgentRun(
  runId: string,
  body: AgentRunCompleteBody,
  options?: MutationOptions,
  client?: ClawRouterAppSdkClient,
): Promise<unknown> {
  return appClient(client).agents.agentRuns.submit(
    runId,
    body,
    mutationParams('agent-run-complete', options),
  );
}
