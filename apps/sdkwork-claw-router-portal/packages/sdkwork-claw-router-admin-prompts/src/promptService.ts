import {
  createIdempotencyParams,
  ensureSdkworkApiSuccess,
  getClawRouterBackendSdkClient,
  requiredSafePathSegment,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminPromptCreateRequest,
  AdminPromptBindingCreateRequest,
  AdminPromptBindingItem,
  AdminPromptBindingUpdateRequest,
  AdminPromptItem,
  AdminPromptRenderRequest,
  AdminPromptVersionItem,
  AdminPromptVersionCreateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

type BackendPrompts = ReturnType<typeof getClawRouterBackendSdkClient>['prompts'];
type ListParams<TList> = TList extends (params?: infer TParams) => unknown ? TParams : never;

export type AdminPromptListParams = ListParams<BackendPrompts['definitions']['list']>;
export type AdminPrompt = AdminPromptItem;
export type AdminPromptVersion = AdminPromptVersionItem;
export type AdminPromptBinding = AdminPromptBindingItem;
export type AdminPromptCreateInput = AdminPromptCreateRequest;
export type AdminPromptBindingCreateInput = AdminPromptBindingCreateRequest;
export type AdminPromptBindingUpdateInput = AdminPromptBindingUpdateRequest;
export type AdminPromptVersionCreateInput = AdminPromptVersionCreateRequest;
export type AdminPromptRenderInput = AdminPromptRenderRequest;

export const DEFAULT_PROMPT_PAGE_PARAMS = {
  page: '1',
  pageSize: '100',
} as const;

export const EMPTY_PROMPT_ITEMS = {
  data: {
    items: [],
  },
} as const;

export async function listPrompts(params?: AdminPromptListParams) {
  return getClawRouterBackendSdkClient().prompts.definitions.list(normalizePromptListParams(params));
}

export async function createPrompt(input: AdminPromptCreateInput) {
  const result = await getClawRouterBackendSdkClient().prompts.definitions.create(
    input,
    createIdempotencyParams('admin-prompt-create'),
  );
  ensureSdkworkApiSuccess(result, 'Failed to create prompt');
  return result;
}

export async function listPromptVersions(promptId: string) {
  const safePromptId = requiredSafePathSegment(promptId, 'promptId');
  return getClawRouterBackendSdkClient().prompts.versions.list(safePromptId);
}

export async function createPromptVersion(promptId: string, input: AdminPromptVersionCreateInput) {
  const result = await getClawRouterBackendSdkClient().prompts.versions.create(
    requiredSafePathSegment(promptId, 'promptId'),
    input,
    createIdempotencyParams('admin-prompt-version-create'),
  );
  ensureSdkworkApiSuccess(result, 'Failed to create prompt version');
  return result;
}

export async function publishPromptVersion(versionId: string) {
  const result = await getClawRouterBackendSdkClient().prompts.versions.publish(
    requiredSafePathSegment(versionId, 'versionId'),
  );
  ensureSdkworkApiSuccess(result, 'Failed to publish prompt version');
  return result;
}

export async function renderPromptVersion(versionId: string, input: AdminPromptRenderInput) {
  const result = await getClawRouterBackendSdkClient().prompts.versionRenders.create(
    requiredSafePathSegment(versionId, 'versionId'),
    input,
  );
  ensureSdkworkApiSuccess(result, 'Failed to render prompt version');
  return result;
}

export async function listPromptBindings(promptId: string) {
  const safePromptId = requiredSafePathSegment(promptId, 'promptId');
  return getClawRouterBackendSdkClient().prompts.definitionBindings.list(safePromptId);
}

export async function createPromptBinding(promptId: string, input: AdminPromptBindingCreateInput) {
  const result = await getClawRouterBackendSdkClient().prompts.definitionBindings.create(
    requiredSafePathSegment(promptId, 'promptId'),
    input,
    createIdempotencyParams('admin-prompt-binding-create'),
  );
  ensureSdkworkApiSuccess(result, 'Failed to create prompt binding');
  return result;
}

export async function updatePromptBinding(bindingId: string, input: AdminPromptBindingUpdateInput) {
  const result = await getClawRouterBackendSdkClient().prompts.definitionBindings.update(
    requiredSafePathSegment(bindingId, 'bindingId'),
    input,
  );
  ensureSdkworkApiSuccess(result, 'Failed to update prompt binding');
  return result;
}

function normalizePromptListParams(params?: AdminPromptListParams): AdminPromptListParams {
  return {
    ...DEFAULT_PROMPT_PAGE_PARAMS,
    ...(params ?? {}),
    categoryId: optionalPromptListCategoryId(params?.categoryId),
  } as AdminPromptListParams;
}

function optionalPromptListCategoryId(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value).trim();
  return normalized ? normalized : undefined;
}
