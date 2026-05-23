import { APP_API_PREFIX, type ClawRouterAppSdkClient } from './sdk-clients.ts';
import type { RuntimeEventItem } from '@sdkwork/clawrouter-app-sdk';

export type RuntimeStreamEvent = RuntimeEventItem;

export async function* streamRuntimeInvocationEvents(
  client: ClawRouterAppSdkClient,
  invocationId: string,
): AsyncIterable<RuntimeStreamEvent> {
  const runtimeInvocationEventStreamPath = `/runtime/invocations/${encodeURIComponent(invocationId)}/events/stream`;
  yield* client.http.streamJson<RuntimeStreamEvent>(
    `${APP_API_PREFIX}${runtimeInvocationEventStreamPath}`,
  );
}

export function readRuntimeTextDelta(event: RuntimeStreamEvent): string {
  if (!isRuntimeTextDeltaEvent(event)) {
    return '';
  }
  if (typeof event.textDelta === 'string' && event.textDelta.length > 0) {
    return event.textDelta;
  }
  return readRuntimePayloadTextDelta(event.payloadJson);
}

export interface RuntimeUsageSnapshot {
  cachedTokens: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export function emptyRuntimeUsageSnapshot(): RuntimeUsageSnapshot {
  return {
    cachedTokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  };
}

export function readRuntimeUsageSnapshot(value: unknown): Partial<RuntimeUsageSnapshot> | null {
  return readRuntimeUsageSnapshotFromUnknown(value);
}

export function mergeRuntimeUsageSnapshots(
  current: RuntimeUsageSnapshot,
  next: Partial<RuntimeUsageSnapshot> | null,
): RuntimeUsageSnapshot {
  if (!hasRuntimeUsageSnapshotValue(next)) {
    return current;
  }
  const previousDerivedTotal = current.inputTokens + current.outputTokens + current.cachedTokens;
  const merged: RuntimeUsageSnapshot = {
    ...current,
    ...compactRuntimeUsageSnapshot(next),
  };
  if (
    next?.totalTokens === undefined
    && (
      next?.inputTokens !== undefined
      || next?.outputTokens !== undefined
      || next?.cachedTokens !== undefined
      || merged.totalTokens === 0
    )
    && (current.totalTokens === 0 || current.totalTokens === previousDerivedTotal)
  ) {
    merged.totalTokens = merged.inputTokens + merged.outputTokens + merged.cachedTokens;
  }
  return merged;
}

export function readPreferredRuntimeUsageCount(primary: number | null | undefined, fallback: number): number {
  if (primary !== undefined && primary !== null && primary > 0) {
    return primary;
  }
  return fallback;
}

function isRuntimeTextDeltaEvent(event: RuntimeStreamEvent): boolean {
  const eventType = event.eventType.trim().toLowerCase();
  return eventType === 'message.delta'
    || eventType === 'response.delta'
    || eventType === 'runtime.delta'
    || eventType.endsWith('.delta');
}

function readRuntimePayloadTextDelta(payload: unknown): string {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return '';
  }
  const record = payload as Record<string, unknown>;
  for (const key of ['textDelta', 'delta', 'content', 'outputText', 'text']) {
    const value = record[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  const nestedDelta = readNestedRuntimeTextDelta(record.delta);
  if (nestedDelta) {
    return nestedDelta;
  }

  const choices = record.choices;
  if (Array.isArray(choices)) {
    for (const choice of choices) {
      const choiceDelta = readNestedRuntimeTextDelta(choice);
      if (choiceDelta) {
        return choiceDelta;
      }
    }
  }
  return '';
}

function readNestedRuntimeTextDelta(value: unknown): string {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return '';
  }
  const record = value as Record<string, unknown>;
  for (const key of ['textDelta', 'content', 'outputText', 'text']) {
    const item = record[key];
    if (typeof item === 'string' && item.length > 0) {
      return item;
    }
  }
  return readNestedRuntimeTextDelta(record.delta);
}

function readRuntimeUsageSnapshotFromUnknown(value: unknown, depth = 0): Partial<RuntimeUsageSnapshot> | null {
  if (depth > 5 || !isRuntimeRecord(value)) {
    return null;
  }

  const direct = readDirectRuntimeUsageSnapshot(value);
  if (hasRuntimeUsageSnapshotValue(direct)) {
    return direct;
  }

  for (const key of ['usage', 'usageJson', 'usage_json', 'tokenUsage', 'token_usage', 'metrics', 'payloadJson', 'payload', 'data', 'result', 'output', 'response']) {
    const nested = readRuntimeUsageSnapshotFromUnknown(value[key], depth + 1);
    if (nested) {
      return nested;
    }
  }
  return null;
}

function readDirectRuntimeUsageSnapshot(record: Record<string, unknown>): Partial<RuntimeUsageSnapshot> {
  const inputTokens = readFirstRuntimeUsageNumber(record, ['inputTokens', 'input_tokens', 'promptTokens', 'prompt_tokens']);
  const outputTokens = readFirstRuntimeUsageNumber(record, ['outputTokens', 'output_tokens', 'completionTokens', 'completion_tokens']);
  const cachedTokens = readFirstRuntimeUsageNumber(record, ['cachedTokens', 'cached_tokens'])
    ?? readNestedRuntimeUsageNumber(record.promptTokensDetails, ['cachedTokens', 'cached_tokens'])
    ?? readNestedRuntimeUsageNumber(record.prompt_tokens_details, ['cachedTokens', 'cached_tokens']);
  const totalTokens = readFirstRuntimeUsageNumber(record, ['totalTokens', 'total_tokens']);
  return compactRuntimeUsageSnapshot({
    cachedTokens,
    inputTokens,
    outputTokens,
    totalTokens,
  });
}

function readFirstRuntimeUsageNumber(record: Record<string, unknown>, keys: readonly string[]): number | undefined {
  for (const key of keys) {
    const value = readOptionalRuntimeUsageNumber(record[key]);
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
}

function readNestedRuntimeUsageNumber(value: unknown, keys: readonly string[]): number | undefined {
  return isRuntimeRecord(value) ? readFirstRuntimeUsageNumber(value, keys) : undefined;
}

function readOptionalRuntimeUsageNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const number = typeof value === 'number'
    ? value
    : typeof value === 'string'
      ? Number(value.trim())
      : Number.NaN;
  return Number.isFinite(number) && number >= 0 ? Math.trunc(number) : undefined;
}

function compactRuntimeUsageSnapshot(snapshot: Partial<RuntimeUsageSnapshot>): Partial<RuntimeUsageSnapshot> {
  return Object.fromEntries(
    Object.entries(snapshot).filter(([, value]) => value !== undefined),
  ) as Partial<RuntimeUsageSnapshot>;
}

function hasRuntimeUsageSnapshotValue(snapshot: Partial<RuntimeUsageSnapshot> | null): boolean {
  return Boolean(snapshot && Object.values(snapshot).some((value) => value !== undefined));
}

function isRuntimeRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export * from './api-result.ts';
export * from './api-request-url.ts';
export * from './app-session-token.ts';
export * from './decimal.ts';
export * from './iam-runtime.ts';
export * from './json-value.ts';
export * from './load-error.ts';
export * from './notificationService.ts';
export * from './portal-auth.ts';
export * from './portal-session.ts';
export * from './request-id.ts';
export * from './sdk-request-boundary.ts';
export * from './sdk-clients.ts';
export * from './sessionService.ts';
export * from './share-url.ts';
export * from './siteBranding.ts';
export * from './utils/index.ts';
export * from './utils/env.ts';
