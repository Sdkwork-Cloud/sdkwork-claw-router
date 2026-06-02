import {
  ensureSdkworkApiSuccess,
  isRecord,
  readApiRecord,
  readBoolean,
  readNullableString,
  readNumber,
  readRequiredApiItem,
  readRequiredApiItems,
  readRequiredString,
  readString,
  type ApiRecord,
} from './api-result.ts';
import { requiredSafePathSegment } from './sdk-request-boundary.ts';
import { getClawRouterBackendSdkClient } from './sdk-clients.ts';
import {
  readMediaResource,
  type ClawRouterMediaResource,
} from './media-resource.ts';
import type {
  AdminSkillCategoryCreateRequest,
  AdminSkillCategoryUpdateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

export interface AdminCategoryOption {
  id: string;
  name: string;
  code: string;
  description: string;
  icon?: ClawRouterMediaResource;
  parentId: string | null;
  path: string;
  sortWeight: number;
  status: number;
  type: number;
  visible: boolean;
}

export interface AdminAiCategoryCreateInput {
  name: string;
  code?: string;
  description?: string;
  icon?: ClawRouterMediaResource;
  parentId?: string | null;
  path?: string;
  sortWeight?: number;
  status?: number;
  type?: number;
  visible?: boolean;
}

export interface AdminAiCategoryUpdateInput {
  name?: string;
  code?: string | null;
  description?: string | null;
  icon?: ClawRouterMediaResource;
  parentId?: string | null;
  path?: string | null;
  sortWeight?: number;
  status?: number;
  type?: number;
  visible?: boolean;
}

export async function listAdminAiCategoryOptions(): Promise<AdminCategoryOption[]> {
  const result = await getClawRouterBackendSdkClient().ecosystem.skills.categories.list();
  ensureSdkworkApiSuccess(result, 'Failed to load plus_category options');
  return readRequiredApiItems(result, 'Failed to load plus_category options')
    .map(readAdminCategoryOption)
    .sort(compareAdminCategoryOptions);
}

export async function createAdminAiCategory(input: AdminAiCategoryCreateInput): Promise<AdminCategoryOption> {
  const result = await getClawRouterBackendSdkClient().ecosystem.skills.categories.create(
    normalizeAdminAiCategoryCreateInput(input),
  );
  ensureSdkworkApiSuccess(result, 'Failed to create plus_category');
  return readAdminCategoryOption(readRequiredApiItem(result, 'Created plus_category response is missing data'));
}

export async function updateAdminAiCategory(categoryId: string, input: AdminAiCategoryUpdateInput): Promise<AdminCategoryOption> {
  const result = await getClawRouterBackendSdkClient().ecosystem.skills.categories.update(
    requiredSafePathSegment(categoryId, 'categoryId'),
    normalizeAdminAiCategoryUpdateInput(input),
  );
  ensureSdkworkApiSuccess(result, 'Failed to update plus_category');
  return readAdminCategoryOption(readRequiredApiItem(result, 'Updated plus_category response is missing data'));
}

export async function deleteAdminAiCategory(categoryId: string): Promise<boolean> {
  const result = await getClawRouterBackendSdkClient().ecosystem.skills.categories.delete(
    requiredSafePathSegment(categoryId, 'categoryId'),
  );
  ensureSdkworkApiSuccess(result, 'Failed to delete plus_category');
  if (readBoolean(readApiRecord(result), 'deleted') !== true) {
    throw new Error('plus_category delete confirmation is required');
  }
  return true;
}

export function formatAdminCategoryOptionLabel(category: AdminCategoryOption): string {
  if (!category.code || category.code === category.name) {
    return category.name;
  }
  return `${category.name} (${category.code})`;
}

export function getAdminCategoryDisplayName(
  categoryOptions: readonly AdminCategoryOption[],
  categoryId: unknown,
  categoryCode: unknown,
): string {
  const normalizedId = normalizeDisplayValue(categoryId);
  const normalizedCode = normalizeDisplayValue(categoryCode);
  const category = normalizedId
    ? categoryOptions.find((item) => item.id === normalizedId)
    : normalizedCode
      ? categoryOptions.find((item) => item.code === normalizedCode)
      : undefined;
  if (category) {
    return category.name;
  }
  return normalizedCode ?? (normalizedId ? `#${normalizedId}` : '');
}

export function attachAdminCategoryNamesToResult<T>(
  result: T,
  categoryOptions: readonly AdminCategoryOption[],
): T {
  if (!isRecord(result) || !isRecord(result.data) || !Array.isArray(result.data.items)) {
    return result;
  }
  return {
    ...result,
    data: {
      ...result.data,
      items: result.data.items.map((item) => attachAdminCategoryName(item, categoryOptions)),
    },
  } as T;
}

function attachAdminCategoryName(
  item: unknown,
  categoryOptions: readonly AdminCategoryOption[],
): unknown {
  if (!isRecord(item)) {
    return item;
  }
  return {
    ...item,
    categoryName: getAdminCategoryDisplayName(categoryOptions, item.categoryId, item.categoryCode),
  };
}

function readAdminCategoryOption(value: unknown): AdminCategoryOption {
  if (!isRecord(value)) {
    throw new Error('plus_category option record is required');
  }
  return {
    id: readRequiredString(value, 'id', 'plus_category id is required'),
    name: readRequiredString(value, 'name', 'plus_category name is required'),
    code: readString(value, 'code'),
    description: readString(value, 'description'),
    icon: readMediaResource(value.icon),
    parentId: readNullableString(value, 'parentId'),
    path: readString(value, 'path'),
    sortWeight: readNonNegativeInteger(value, 'sortWeight'),
    status: readNonNegativeInteger(value, 'status'),
    type: readNonNegativeInteger(value, 'type'),
    visible: readBoolean(value, 'visible', true),
  };
}

function normalizeAdminAiCategoryCreateInput(input: AdminAiCategoryCreateInput): AdminSkillCategoryCreateRequest {
  return pruneUndefined({
    ...input,
    name: requiredText(input.name, 'name', 255),
    code: optionalText(input.code, 'code', 128),
    description: optionalText(input.description, 'description', 512),
    icon: input.icon,
    parentId: normalizeNullableText(input.parentId, 'parentId', 128),
    path: optionalText(input.path, 'path', 1024),
    sortWeight: optionalNonNegativeInteger(input.sortWeight, 'sortWeight'),
    status: optionalNonNegativeInteger(input.status, 'status'),
    type: normalizeCategoryType(input.type),
    visible: input.visible,
  });
}

function normalizeAdminAiCategoryUpdateInput(input: AdminAiCategoryUpdateInput): AdminSkillCategoryUpdateRequest {
  return pruneUndefined({
    ...input,
    name: optionalText(input.name, 'name', 255),
    code: normalizeNullableText(input.code, 'code', 128),
    description: normalizeNullableText(input.description, 'description', 512),
    icon: input.icon,
    parentId: normalizeNullableText(input.parentId, 'parentId', 128),
    path: normalizeNullableText(input.path, 'path', 1024),
    sortWeight: optionalNonNegativeInteger(input.sortWeight, 'sortWeight'),
    status: optionalNonNegativeInteger(input.status, 'status'),
    type: normalizeCategoryType(input.type),
    visible: input.visible,
  });
}

function requiredText(value: unknown, fieldName: string, maxLength: number): string {
  const text = optionalText(value, fieldName, maxLength);
  if (!text) {
    throw new Error(`${fieldName} is required`);
  }
  return text;
}

function optionalText(value: unknown, fieldName: string, maxLength: number): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  const text = value.trim();
  if (!text) {
    return undefined;
  }
  if (text.length > maxLength) {
    throw new Error(`${fieldName} must be at most ${maxLength} characters`);
  }
  return text;
}

function normalizeNullableText(value: unknown, fieldName: string, maxLength: number): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return optionalText(value, fieldName, maxLength) ?? null;
}

function optionalNonNegativeInteger(value: unknown, fieldName: string): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const numberValue = typeof value === 'number'
    ? value
    : typeof value === 'string'
      ? Number(value.trim())
      : Number.NaN;
  if (!Number.isSafeInteger(numberValue) || numberValue < 0) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }
  return numberValue;
}

function normalizeCategoryType(value: unknown): 19 | 20 | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const numberValue = typeof value === 'string' ? Number(value.trim()) : value;
  if (numberValue === 19 || numberValue === 20) {
    return numberValue;
  }
  throw new Error('type must be 19 or 20');
}

function pruneUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

function readNonNegativeInteger(record: ApiRecord, key: string): number {
  const value = readNumber(record, key, 0);
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function compareAdminCategoryOptions(left: AdminCategoryOption, right: AdminCategoryOption): number {
  return left.sortWeight - right.sortWeight
    || left.name.localeCompare(right.name)
    || left.id.localeCompare(right.id);
}

function normalizeDisplayValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized ? normalized : null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}
