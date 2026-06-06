import {
  createClientOperationToken,
  getClawRouterAppSdkClient,
  streamRuntimeInvocationEvents,
  type ClawRouterMediaResource,
  type ClawRouterAppSdkClient,
  type JsonValue,
  type RuntimeStreamEvent,
  type RuntimeUsageSnapshot,
} from 'sdkwork-clawrouter-pc-commons/runtime';

type JsonObject = Record<string, JsonValue>;
type SdkUsageSnapshot = {
  cachedTokens?: string;
  inputTokens?: string;
  outputTokens?: string;
  totalTokens?: string;
};

interface MutationOptions {
  idempotencyPrefix?: string;
  idempotencyKey?: string;
}

interface PageParams {
  page?: number;
  pageSize?: number;
}

export interface AgentDefinitionCreateBody {
  code?: string;
  description?: string;
  mcpPolicy?: JsonObject;
  memoryPolicy?: JsonObject;
  model?: string;
  name: string;
  runtimePolicy?: JsonObject;
  skillPolicy?: JsonObject;
  systemPrompt?: string;
  toolPolicy?: JsonObject;
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
  runtime?: string;
  sourceSurface?: string;
  traceId?: string;
}

export interface AgentRunCompleteBody {
  errorMessageMasked?: string;
  metadata?: JsonObject;
  outputMessage?: string;
  status?: 'completed' | 'failed' | 'cancelled';
  usageJson?: RuntimeUsageSnapshot;
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
  usageJson?: RuntimeUsageSnapshot;
}

export interface AgentRunStepCompleteBody {
  errorMessageMasked?: string;
  metadata?: JsonObject;
  outputJson?: JsonObject;
  status?: 'completed' | 'failed' | 'cancelled';
  usageJson?: RuntimeUsageSnapshot;
}

export interface ChatConversationCreateBody {
  agentId?: string;
  agentSessionId?: string;
  defaultModel?: string;
  defaultProvider?: string;
  memorySpaceId?: string;
  metadata?: JsonObject;
  sourceSurface?: string;
  title?: string;
}

export interface ChatTurnCreateBody {
  message: string;
  metadata?: JsonObject;
  mode?: string;
  model?: string;
  provider?: string;
}

export interface ChatTurnResponseBody {
  message: string;
  metadata?: JsonObject;
  model?: string;
  provider?: string;
  runtime?: string;
  runtimeInvocationId?: string;
  status?: 'completed' | 'failed' | 'cancelled' | 'streaming';
  usage?: Record<string, unknown>;
  usageFactId?: string;
}

export interface MemorySpaceCreateBody {
  metadata?: JsonObject;
  title: string;
}

export interface MemoryEntryCreateBody {
  content: string;
  contentJson?: JsonObject;
  memoryType?: string;
  metadata?: JsonObject;
  sourceConversationId?: string;
  sourceInvocationId?: string;
  sourceItemId?: string;
  sourceKind?: string;
  sourceTurnId?: string;
}

export interface RuntimeInvocationCreateBody {
  agentRunId?: string;
  agentRunStepId?: string;
  agentSessionId?: string;
  chatItemId?: string;
  chatTurnId?: string;
  conversationId?: string;
  endpoint?: string;
  invocationType?: string;
  metadata?: JsonObject;
  model?: string;
  provider?: string;
  requestJson?: JsonObject;
  runtime: string;
  status?: 'pending' | 'running' | 'streaming' | 'completed' | 'failed' | 'cancelled';
  streaming?: boolean;
}

export interface RuntimeInvocationCompleteBody {
  errorCode?: string;
  errorMessageMasked?: string;
  errorType?: string;
  finishReason?: string;
  metadata?: JsonObject;
  responseJson?: JsonObject;
  status?: 'pending' | 'running' | 'streaming' | 'completed' | 'failed' | 'cancelled';
  usageJson?: RuntimeUsageSnapshot;
}

export interface RuntimeEventCreateBody {
  eventSource?: string;
  eventType: string;
  metadata?: JsonObject;
  payloadJson?: JsonObject;
  textDelta?: string;
}

export interface RuntimeArtifactCreateBody {
  artifactType: string;
  contentJson?: JsonObject;
  contentText?: string;
  metadata?: JsonObject;
  mimeType?: string;
  name?: string;
  resource?: ClawRouterMediaResource;
  sha256?: string;
  sizeBytes?: number;
  storageKey?: string;
}

interface ModelCatalogParams {
  billingMeter?: string;
  capabilities?: string[];
  categories?: string[];
  groups?: string[];
  limit?: number;
  modalities?: string[];
  q?: string;
  vendorCode?: string;
  vendorCodes?: string[];
}

function appClient(client?: ClawRouterAppSdkClient): ClawRouterAppSdkClient {
  return client ?? getClawRouterAppSdkClient();
}

function mutationParams(prefix: string, options: MutationOptions = {}): { idempotencyKey: string } {
  return {
    idempotencyKey: options.idempotencyKey ?? createClientOperationToken(options.idempotencyPrefix ?? prefix),
  };
}

export async function listAgentDefinitions(
  params: PageParams & { q?: string } = { pageSize: 100 },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentDefinitions.list(sdkPageParams(params));
}

export async function createAgentDefinition(
  body: AgentDefinitionCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentDefinitions.create(body, mutationParams('agent-definition', options));
}

export async function retrieveAgentDefinition(
  agentId: string,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentDefinitions.retrieve(agentId);
}

export async function listGenerationHistory(
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  if (sdkClient) {
    return sdkClient.ai.generation.list();
  }
  return getClawRouterAppSdkClient().ai.generation.list();
}

export async function listModelCatalog(
  params: ModelCatalogParams = {},
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  if (sdkClient) {
    return sdkClient.ai.models.list(sdkModelCatalogParams(params));
  }
  return getClawRouterAppSdkClient().ai.models.list(sdkModelCatalogParams(params));
}

export async function listAgentSessions(
  agentId: string,
  params: PageParams = { pageSize: 100 },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentSessions.list(agentId, sdkPageParams(params));
}

export async function createAgentSession(
  agentId: string,
  body: AgentSessionCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentSessions.create(agentId, body, mutationParams('agent-session', options));
}

export async function retrieveAgentSession(
  sessionId: string,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentSessions.retrieve(sessionId);
}

export async function listAgentRuns(
  sessionId: string,
  params: PageParams = { pageSize: 100 },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentRuns.list(sessionId, sdkPageParams(params));
}

export async function createAgentRun(
  sessionId: string,
  body: AgentRunCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentRuns.create(sessionId, body, mutationParams('agent-run', options));
}

export async function retrieveAgentRun(
  runId: string,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentRuns.retrieve(runId);
}

export async function completeAgentRun(
  runId: string,
  body: AgentRunCompleteBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentRuns.submit(runId, sdkAgentRunCompleteBody(body), mutationParams('agent-run-complete', options));
}

export async function listAgentRunSteps(
  runId: string,
  params: PageParams = { pageSize: 100 },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentRunSteps.list(runId, sdkPageParams(params));
}

export async function createAgentRunStep(
  runId: string,
  body: AgentRunStepCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentRunSteps.create(runId, sdkAgentRunStepCreateBody(body), mutationParams('agent-run-step', options));
}

export async function completeAgentRunStep(
  runId: string,
  stepId: string,
  body: AgentRunStepCompleteBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.agents.agentRunSteps.submit(
    runId,
    stepId,
    sdkAgentRunStepCompleteBody(body),
    mutationParams('agent-run-step-complete', options),
  );
}

export async function listChatConversations(
  params: PageParams = { pageSize: 100 },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.chat.conversations.list(sdkPageParams(params));
}

export async function createChatConversation(
  body: ChatConversationCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.chat.conversations.create(body, mutationParams('chat-conversation', options));
}

export async function retrieveChatConversation(
  conversationId: string,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.chat.conversations.retrieve(conversationId);
}

export async function listChatMessages(
  conversationId: string,
  params: { limit?: number; order?: 'asc' | 'desc' } = { limit: 100, order: 'asc' },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.chat.conversationMessages.list(conversationId, {
    ...params,
    limit: params.limit === undefined ? undefined : String(params.limit),
  });
}

export async function createChatTurn(
  conversationId: string,
  body: ChatTurnCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.chat.turns.create(conversationId, body, mutationParams('chat-turn', options));
}

export async function completeChatTurnResponse(
  conversationId: string,
  turnId: string,
  body: ChatTurnResponseBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.chat.turnResponses.create(
    conversationId,
    turnId,
    body,
    mutationParams('chat-turn-response', options),
  );
}

export async function listMemorySpaces(
  params: PageParams = { pageSize: 100 },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.memory.spaces.list(sdkPageParams(params));
}

export async function createMemorySpace(
  body: MemorySpaceCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.memory.spaces.create(body, mutationParams('memory-space', options));
}

export async function retrieveMemorySpace(
  spaceId: string,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.memory.spaces.retrieve(spaceId);
}

export async function listMemoryEntries(
  spaceId: string,
  params: PageParams = { pageSize: 100 },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.memory.entries.list(spaceId, sdkPageParams(params));
}

export async function createMemoryEntry(
  spaceId: string,
  body: MemoryEntryCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.memory.entries.create(spaceId, body, mutationParams('memory-entry', options));
}

export async function retrieveMemoryEntry(
  entryId: string,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.memory.entries.retrieve(entryId);
}

export async function listRuntimeInvocations(
  params: PageParams & {
    agentSessionId?: string;
    chatTurnId?: string;
    conversationId?: string;
    runtime?: string;
    status?: string;
  } = { pageSize: 100 },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.runtime.invocations.list(sdkPageParams(params));
}

export async function createRuntimeInvocation(
  body: RuntimeInvocationCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.runtime.invocations.create(body, mutationParams('runtime-invocation', options));
}

export async function retrieveRuntimeInvocation(
  invocationId: string,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.runtime.invocations.retrieve(invocationId);
}

export async function completeRuntimeInvocation(
  invocationId: string,
  body: RuntimeInvocationCompleteBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.runtime.invocations.submit(
    invocationId,
    sdkRuntimeInvocationCompleteBody(body),
    mutationParams('runtime-invocation-complete', options),
  );
}

export async function listRuntimeEvents(
  invocationId: string,
  params: PageParams = { pageSize: 100 },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.runtime.invocationEvents.list(invocationId, sdkPageParams(params));
}

export async function streamRuntimeEvents(
  invocationId: string,
  afterEventNo = 0,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<AsyncIterable<RuntimeStreamEvent>> {
  const client = appClient(sdkClient);
  return streamRuntimeInvocationEvents(client, invocationId, afterEventNo);
}

export async function createRuntimeEvent(
  invocationId: string,
  body: RuntimeEventCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.runtime.invocationEvents.create(
    invocationId,
    body,
    mutationParams('runtime-event', options),
  );
}

export async function listRuntimeArtifacts(
  invocationId: string,
  params: PageParams = { pageSize: 100 },
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.runtime.artifacts.list(invocationId, sdkPageParams(params));
}

export async function createRuntimeArtifact(
  invocationId: string,
  body: RuntimeArtifactCreateBody,
  options?: MutationOptions,
  sdkClient?: ClawRouterAppSdkClient,
): Promise<unknown> {
  const client = appClient(sdkClient);
  return client.runtime.artifacts.create(invocationId, sdkRuntimeArtifactCreateBody(body), mutationParams('runtime-artifact', options));
}

function sdkPageParams<T extends PageParams>(params: T): Omit<T, 'page' | 'pageSize'> & {
  page?: string;
  pageSize?: string;
} {
  return {
    ...params,
    page: params.page === undefined ? undefined : String(params.page),
    pageSize: params.pageSize === undefined ? undefined : String(params.pageSize),
  };
}

function sdkModelCatalogParams(params: ModelCatalogParams): Omit<ModelCatalogParams, 'limit'> & { limit?: string } {
  return {
    ...params,
    limit: params.limit === undefined ? undefined : String(params.limit),
  };
}

function sdkUsageSnapshot(value: RuntimeUsageSnapshot | undefined): SdkUsageSnapshot | undefined {
  if (!value) {
    return undefined;
  }
  return {
    cachedTokens: String(value.cachedTokens),
    inputTokens: String(value.inputTokens),
    outputTokens: String(value.outputTokens),
    totalTokens: String(value.totalTokens),
  };
}

function sdkAgentRunCompleteBody(body: AgentRunCompleteBody): Omit<AgentRunCompleteBody, 'usageJson'> & { usageJson?: SdkUsageSnapshot } {
  return {
    ...body,
    usageJson: sdkUsageSnapshot(body.usageJson),
  };
}

function sdkAgentRunStepCreateBody(body: AgentRunStepCreateBody): Omit<AgentRunStepCreateBody, 'usageJson'> & { usageJson?: SdkUsageSnapshot } {
  return {
    ...body,
    usageJson: sdkUsageSnapshot(body.usageJson),
  };
}

function sdkAgentRunStepCompleteBody(body: AgentRunStepCompleteBody): Omit<AgentRunStepCompleteBody, 'usageJson'> & { usageJson?: SdkUsageSnapshot } {
  return {
    ...body,
    usageJson: sdkUsageSnapshot(body.usageJson),
  };
}

function sdkRuntimeInvocationCompleteBody(body: RuntimeInvocationCompleteBody): Omit<RuntimeInvocationCompleteBody, 'usageJson'> & { usageJson?: SdkUsageSnapshot } {
  return {
    ...body,
    usageJson: sdkUsageSnapshot(body.usageJson),
  };
}

function sdkRuntimeArtifactCreateBody(body: RuntimeArtifactCreateBody): Omit<RuntimeArtifactCreateBody, 'sizeBytes'> & { sizeBytes?: string } {
  return {
    ...body,
    sizeBytes: body.sizeBytes === undefined ? undefined : String(body.sizeBytes),
  };
}
