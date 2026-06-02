import {
  ensureSdkworkApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readApiRecord,
  readBoolean,
  readRequiredApiItems,
  readRequiredApiItem,
  requiredSafePathSegment,
  readRequiredNonNegativeNumber,
  readRequiredNumber,
  readRequiredString,
  readString,
  readStringArray,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminChannelGroupCreateRequest,
  AdminChannelGroupUpdateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

export type GroupPriceReferenceMode = 'multiplier' | 'official_price';

export interface GroupData {
  id: string;
  groupCode: string;
  groupName: string;
  providerCode: string;
  priceReferenceMode: GroupPriceReferenceMode;
  rateMultiplier: number;
  officialPriceMultiplier: number | null;
  groupType: 'public' | 'dedicated';
  accountCount: { available: number; total: number };
  capacity: { used: number; total: number };
  usage: { today: number; total: number };
  status: 'active' | 'disabled';
}

export type GroupCreateInput = {
  groupName: string;
  groupCode: string;
  priceReferenceMode: GroupPriceReferenceMode;
  rateMultiplier?: number;
  officialPriceMultiplier?: number;
  groupType: GroupData['groupType'];
  capacity: { total: number };
  status: GroupData['status'];
};

export type GroupUpdateInput = {
  groupName?: string;
  groupCode?: string;
  priceReferenceMode?: GroupPriceReferenceMode;
  rateMultiplier?: number;
  officialPriceMultiplier?: number;
  groupType?: GroupData['groupType'];
  capacity?: { total: number };
  status?: GroupData['status'];
};

export interface GroupChannelBindingData {
  id: string;
  channelGroupId: string;
  channelId: string;
  channelName: string;
  providerCode: string;
  providerName: string;
  channelCode: string;
  models: string[];
  capabilities: string[];
  modelScope: string[];
  priority: number;
  weight: number;
  status: 'active' | 'disabled';
  healthStatus: 'active' | 'error';
}

export interface GroupChannelBindingInput {
  channelId: string;
  priority?: number;
  weight?: number;
  status?: GroupChannelBindingData['status'];
  modelScope?: string[];
  capabilities?: string[];
}

export interface GroupChannelOption {
  id: string;
  name: string;
  providerCode: string;
  providerName: string;
  channelCode: string;
  models: string[];
  capabilities: string[];
  status: 'active' | 'disabled' | 'error';
  healthStatus: 'active' | 'error';
}

export class GroupService {
  static async fetchGroups(): Promise<GroupData[]> {
    const result = await getClawRouterBackendSdkClient().ai.channelGroups.list();
    ensureSdkworkApiSuccess(result, 'Failed to fetch groups');
    return readRequiredApiItems(result, 'Failed to fetch groups').map(normalizeGroup);
  }

  static async addGroup(group: GroupCreateInput): Promise<GroupData> {
    const result = await getClawRouterBackendSdkClient().ai.channelGroups.create(
      toCreateGroupRequest(group),
    );
    ensureSdkworkApiSuccess(result, 'Failed to add group');
    return normalizeGroup(readRequiredApiItem(result, 'Created group response is missing data'));
  }

  static async updateGroup(id: string, updates: GroupUpdateInput): Promise<GroupData> {
    const channelGroupId = requiredSafePathSegment(id, 'channelGroupId');
    const result = await getClawRouterBackendSdkClient().ai.channelGroups.update(
      channelGroupId,
      toUpdateGroupRequest(updates),
    );
    ensureSdkworkApiSuccess(result, 'Failed to update group');
    return normalizeGroup(readRequiredApiItem(result, 'Updated group response is missing data'));
  }

  static async deleteGroup(id: string): Promise<boolean> {
    const channelGroupId = requiredSafePathSegment(id, 'channelGroupId');
    const result = await getClawRouterBackendSdkClient().ai.channelGroups.delete(channelGroupId);
    ensureDeleteResult(result, 'Group delete confirmation is required');
    return true;
  }

  static async fetchGroupChannelBindings(groupId: string): Promise<GroupChannelBindingData[]> {
    const channelGroupId = requiredSafePathSegment(groupId, 'channelGroupId');
    const result = await getClawRouterBackendSdkClient().ai.channelGroups.channelBindings.list(
      channelGroupId,
    );
    ensureSdkworkApiSuccess(result, 'Failed to fetch group channel bindings');
    return readRequiredApiItems(result, 'Failed to fetch group channel bindings')
      .map(normalizeGroupChannelBinding);
  }

  static async replaceGroupChannelBindings(
    groupId: string,
    items: GroupChannelBindingInput[],
  ): Promise<GroupChannelBindingData[]> {
    const channelGroupId = requiredSafePathSegment(groupId, 'channelGroupId');
    const result = await getClawRouterBackendSdkClient().ai.channelGroups.channelBindings.update(
      channelGroupId,
      toReplaceChannelBindingsRequest(items),
    );
    ensureSdkworkApiSuccess(result, 'Failed to save group channel bindings');
    return readRequiredApiItems(result, 'Failed to save group channel bindings')
      .map(normalizeGroupChannelBinding);
  }

  static async fetchAssignableChannels(): Promise<GroupChannelOption[]> {
    const result = await getClawRouterBackendSdkClient().integration.channels.list();
    ensureSdkworkApiSuccess(result, 'Failed to fetch channels');
    return readRequiredApiItems(result, 'Failed to fetch channels')
      .map(normalizeGroupChannelOption);
  }
}

function toCreateGroupRequest(group: GroupCreateInput): AdminChannelGroupCreateRequest {
  const request = baseChannelGroupRequest(group);
  if (group.priceReferenceMode === 'official_price') {
    request.officialPriceMultiplier = optionalPositiveNumber(
      group.officialPriceMultiplier,
      'officialPriceMultiplier',
    );
  } else {
    request.rateMultiplier = optionalPositiveNumber(group.rateMultiplier, 'rateMultiplier');
  }
  return request;
}

function toUpdateGroupRequest(updates: GroupUpdateInput): AdminChannelGroupUpdateRequest {
  const request: AdminChannelGroupUpdateRequest = pruneUndefined({
    groupName:
      updates.groupName === undefined ? undefined : requiredText(updates.groupName, 'groupName'),
    groupCode:
      updates.groupCode === undefined ? undefined : requiredText(updates.groupCode, 'groupCode'),
    priceReferenceMode:
      updates.priceReferenceMode === undefined
        ? undefined
        : toPriceReferenceMode(updates.priceReferenceMode),
    groupType:
      updates.groupType === undefined ? undefined : toBackendGroupType(updates.groupType),
    capacity:
      updates.capacity === undefined ? undefined : toCapacityRequest(updates.capacity.total),
    status: updates.status === undefined ? undefined : toBackendStatus(updates.status),
  });
  if (updates.rateMultiplier !== undefined) {
    request.rateMultiplier = optionalPositiveNumber(updates.rateMultiplier, 'rateMultiplier');
  }
  if (updates.officialPriceMultiplier !== undefined) {
    request.officialPriceMultiplier = optionalPositiveNumber(
      updates.officialPriceMultiplier,
      'officialPriceMultiplier',
    );
  }
  return request;
}

function baseChannelGroupRequest(
  group: Pick<
    GroupCreateInput,
    'groupName' | 'groupCode' | 'priceReferenceMode' | 'groupType' | 'capacity' | 'status'
  >,
): AdminChannelGroupCreateRequest {
  return {
    groupName: requiredText(group.groupName, 'groupName'),
    groupCode: requiredText(group.groupCode, 'groupCode'),
    priceReferenceMode: toPriceReferenceMode(group.priceReferenceMode),
    groupType: toBackendGroupType(group.groupType),
    capacity: toCapacityRequest(group.capacity.total),
    status: toBackendStatus(group.status),
  };
}

function toReplaceChannelBindingsRequest(
  items: GroupChannelBindingInput[],
): {
  items: Array<{
    channelId: string;
    priority?: number;
    weight?: number;
    status?: GroupChannelBindingData['status'];
    modelScope?: string[];
    capabilities?: string[];
  }>;
} {
  return {
    items: items.map((item) => pruneUndefined({
      channelId: requiredText(item.channelId, 'channelId'),
      priority: optionalNonNegativeInteger(item.priority, 'priority'),
      weight: optionalNonNegativeInteger(item.weight, 'weight'),
      status: item.status === undefined ? undefined : toBackendBindingStatus(item.status),
      modelScope: item.modelScope === undefined ? undefined : normalizedOptionalStringArray(item.modelScope),
      capabilities: item.capabilities === undefined ? undefined : normalizedOptionalStringArray(item.capabilities),
    })),
  };
}

function toCapacityRequest(total: number): { total: number } | undefined {
  const normalized = optionalPositiveInteger(total, 'capacity.total');
  return normalized === undefined ? undefined : { total: normalized };
}

function toPriceReferenceMode(value: GroupPriceReferenceMode): GroupPriceReferenceMode {
  if (value === 'multiplier' || value === 'official_price') {
    return value;
  }
  throw new Error('priceReferenceMode must be multiplier or official_price');
}

function toBackendGroupType(type: GroupData['groupType']): GroupData['groupType'] {
  if (type === 'public' || type === 'dedicated') {
    return type;
  }
  throw new Error('groupType must be public or dedicated');
}

function toBackendStatus(status: GroupData['status']): GroupData['status'] {
  if (status === 'active' || status === 'disabled') {
    return status;
  }
  throw new Error('status must be active or disabled');
}

function toBackendBindingStatus(
  status: GroupChannelBindingData['status'],
): NonNullable<GroupChannelBindingInput['status']> {
  if (status === 'active' || status === 'disabled') {
    return status;
  }
  throw new Error('status must be active or disabled');
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalPositiveNumber(value: number | undefined, fieldName: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
  return value;
}

function optionalPositiveInteger(value: number | undefined, fieldName: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return value;
}

function optionalNonNegativeInteger(value: number | undefined, fieldName: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }
  return value;
}

function normalizedOptionalStringArray(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function pruneUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

function ensureDeleteResult(result: unknown, message: string): void {
  ensureSdkworkApiSuccess(result, message);
  if (readBoolean(readApiRecord(result), 'deleted') !== true) {
    throw new Error(message);
  }
}

function normalizeGroup(value: unknown): GroupData {
  const item = readRequiredRecord(value, 'Group record is required');
  const accountCount = readRequiredNestedRecord(item, 'accountCount', 'Group account count is required');
  const capacity = readRequiredNestedRecord(item, 'capacity', 'Group capacity is required');
  const usage = readRequiredNestedRecord(item, 'usage', 'Group usage is required');
  return {
    id: readRequiredString(item, 'id', 'Group id is required'),
    groupCode: readRequiredString(item, 'groupCode', 'Group code is required'),
    groupName: readRequiredString(item, 'groupName', 'Group name is required'),
    providerCode: readDisplayString(item, 'providerCode', 'unknown'),
    priceReferenceMode: readPriceReferenceMode(item),
    rateMultiplier: readRequiredNumber(item, 'rateMultiplier', 'Group rate multiplier is required'),
    officialPriceMultiplier: readNullableNumber(item, 'officialPriceMultiplier'),
    groupType: readGroupType(item),
    accountCount: {
      available: readRequiredNonNegativeNumber(
        accountCount,
        'available',
        'Group available account count is required',
      ),
      total: readRequiredNonNegativeNumber(
        accountCount,
        'total',
        'Group total account count is required',
      ),
    },
    capacity: {
      used: readRequiredNonNegativeNumber(capacity, 'used', 'Group used capacity is required'),
      total: readRequiredNonNegativeNumber(capacity, 'total', 'Group total capacity is required'),
    },
    usage: {
      today: readRequiredNonNegativeNumber(usage, 'today', 'Group today usage is required'),
      total: readRequiredNonNegativeNumber(usage, 'total', 'Group total usage is required'),
    },
    status: readGroupStatus(item),
  };
}

function normalizeGroupChannelBinding(value: unknown): GroupChannelBindingData {
  const item = readRequiredRecord(value, 'Group channel binding record is required');
  return {
    id: readRequiredString(item, 'id', 'Group channel binding id is required'),
    channelGroupId: readRequiredString(
      item,
      'channelGroupId',
      'Group channel binding channel group id is required',
    ),
    channelId: readRequiredString(item, 'channelId', 'Group channel binding channel id is required'),
    channelName: readRequiredString(item, 'channelName', 'Group channel binding channel name is required'),
    providerCode: readRequiredString(item, 'providerCode', 'Group channel binding provider code is required'),
    providerName: readRequiredString(item, 'providerName', 'Group channel binding provider name is required'),
    channelCode: readRequiredString(item, 'channelCode', 'Group channel binding channel code is required'),
    models: readStringArray(item, 'models'),
    capabilities: readStringArray(item, 'capabilities'),
    modelScope: readStringArray(item, 'modelScope'),
    priority: readRequiredNonNegativeInteger(item, 'priority', 'Group channel binding priority is required'),
    weight: readRequiredNonNegativeInteger(item, 'weight', 'Group channel binding weight is required'),
    status: readBindingStatus(item),
    healthStatus: readBindingHealthStatus(item),
  };
}

function normalizeGroupChannelOption(value: unknown): GroupChannelOption {
  const item = readRequiredRecord(value, 'Channel record is required');
  const id = readRequiredString(item, 'id', 'Channel id is required');
  const providerCode = readDisplayString(item, 'providerCode', readDisplayString(item, 'vendor', 'unknown'));
  const providerName = readDisplayString(item, 'providerName', readDisplayString(item, 'vendor', providerCode));
  const status = readChannelStatus(item);
  return {
    id,
    name: readRequiredString(item, 'name', 'Channel name is required'),
    providerCode,
    providerName,
    channelCode: readDisplayString(item, 'channelCode', id),
    models: readStringArray(item, 'models'),
    capabilities: readStringArray(item, 'capabilities'),
    status,
    healthStatus: status === 'error' ? 'error' : 'active',
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readRequiredNestedRecord(record: ApiRecord, key: string, message: string): ApiRecord {
  return readRequiredRecord(record[key], message);
}

function readDisplayString(record: ApiRecord, key: string, fallback: string): string {
  const value = readString(record, key)?.trim();
  return value ? value : fallback;
}

function readNullableNumber(record: ApiRecord, key: string): number | null {
  const value = record[key];
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!normalized) {
      return null;
    }
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readPriceReferenceMode(item: ApiRecord): GroupPriceReferenceMode {
  const value = readString(item, 'priceReferenceMode')?.trim().toLowerCase();
  if (value === 'multiplier') {
    return 'multiplier';
  }
  if (value === 'official_price' || value === 'official_reference') {
    return 'official_price';
  }
  throw new Error(value ? `Unsupported group price reference mode: ${value}` : 'Group price reference mode is required');
}

function readGroupType(item: ApiRecord): GroupData['groupType'] {
  const type = readString(item, 'groupType');
  if (type === 'public' || type === 'dedicated') {
    return type;
  }
  throw new Error(type ? `Unsupported group type: ${type}` : 'Group type is required');
}

function readGroupStatus(item: ApiRecord): GroupData['status'] {
  const status = readString(item, 'status');
  if (status === 'active' || status === 'disabled') {
    return status;
  }
  throw new Error(status ? `Unsupported group status: ${status}` : 'Group status is required');
}

function readBindingStatus(item: ApiRecord): GroupChannelBindingData['status'] {
  const status = readString(item, 'status');
  if (status === 'active' || status === 'disabled') {
    return status;
  }
  throw new Error(
    status
      ? `Unsupported group channel binding status: ${status}`
      : 'Group channel binding status is required',
  );
}

function readBindingHealthStatus(item: ApiRecord): GroupChannelBindingData['healthStatus'] {
  const status = readString(item, 'healthStatus');
  if (status === 'active' || status === 'error') {
    return status;
  }
  throw new Error(
    status
      ? `Unsupported group channel binding health status: ${status}`
      : 'Group channel binding health status is required',
  );
}

function readChannelStatus(item: ApiRecord): GroupChannelOption['status'] {
  const status = readString(item, 'status');
  if (status === 'active' || status === 'disabled' || status === 'error') {
    return status;
  }
  throw new Error(status ? `Unsupported channel status: ${status}` : 'Channel status is required');
}

function readRequiredNonNegativeInteger(item: ApiRecord, key: string, message: string): number {
  const value = readRequiredNonNegativeNumber(item, key, message);
  if (!Number.isInteger(value)) {
    throw new Error(message);
  }
  return value;
}
