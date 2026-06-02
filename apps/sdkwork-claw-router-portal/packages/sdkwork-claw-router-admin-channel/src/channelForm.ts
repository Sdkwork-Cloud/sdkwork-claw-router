import type {
  AiResource,
  AiResourceCreateInput,
  AiResourceMemberInput,
  AiResourceUpdateInput,
  ChannelItem,
  ChannelCreateInput,
  ChannelUpdateInput,
  ProviderSecretInput,
  ChannelEndpoint,
  ChannelEndpointCreateInput,
  ChannelEndpointUpdateInput,
  ProviderSecretUpdateInput,
} from './channelService';

export type ChannelFormValues = {
  name: string;
  vendor: string;
  channelType?: string;
  protocol: string;
  accessType: string;
  baseUrl: string;
  apiKey?: string;
  secretRef?: string;
  expiresAt?: string;
  capabilities: string[];
  resourceCodes?: string[];
  models: string[];
  circuitBreakerEnabled?: boolean;
  circuitBreakerFailureThreshold?: number | string | null;
  weight: number;
  status: string;
};

export type ProviderSecretFormValues = {
  providerCode: string;
  name: string;
  authType: string;
  secretRef: string;
  status: string;
};

export type ChannelEndpointFormValues = {
  channelId?: string;
  vendorCode?: string;
  regionCode?: string;
  apiEndpointCode?: string;
  baseUrl?: string;
  priority?: number | string | null;
  weight?: number | string | null;
  status?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
};

export type AiResourceFormValues = {
  resourceCode?: string;
  resourceType?: string;
  displayName?: string;
  vendorCode?: string;
  modalityCode?: string;
  apiEndpointCode?: string;
  catalogKey?: string;
  model?: string;
  providerNativeModel?: string;
  compositionMode?: string;
  status?: string;
  sortOrder?: number | string | null;
  membersText?: string;
};

export function createChannelEditDraft(channel: ChannelItem): ChannelFormValues {
  return {
    name: channel.name,
    vendor: channel.vendor,
    channelType: channel.channelType,
    protocol: channel.protocol,
    accessType: channel.accessType,
    baseUrl: channel.baseUrl ?? '',
    apiKey: '',
    expiresAt: channel.expiresAt ?? '',
    capabilities: [...channel.capabilities],
    resourceCodes: [...channel.resourceCodes],
    models: [...channel.models],
    circuitBreakerEnabled: Boolean(channel.circuitBreakerPolicy),
    circuitBreakerFailureThreshold: channel.circuitBreakerPolicy?.failureThreshold ?? '',
    weight: channel.weight,
    status: channel.status,
  };
}

export function createChannelCopyDraft(channel: ChannelItem): ChannelFormValues {
  const draft = createChannelEditDraft(channel);
  return {
    ...draft,
    status: channel.status === 'active' ? 'active' : 'disabled',
  };
}

const CHANNEL_CAPABILITIES = ['llm', 'image', 'audio', 'music', 'sfx', 'video'] as const;

type ChannelCapability = (typeof CHANNEL_CAPABILITIES)[number];
type SelectOption = {
  id: string;
  label?: string;
  title?: string;
  name?: string;
  aliases?: readonly string[];
};
type AuthTypeOption = {
  id: string;
  title: string;
  wireValue?: string;
  aliases?: readonly string[];
};

export function resolveChannelSelectFormValue(
  value: string | undefined,
  options: readonly SelectOption[],
  fallback: string,
): string {
  const normalized = optionalText(value ?? '');
  if (!normalized) {
    return fallback;
  }
  return findOptionByWireValue(normalized, options)?.id ?? normalized;
}

export function resolveChannelSelectSubmitValue(
  value: string,
  options: readonly SelectOption[],
  fieldName: string,
): string {
  const normalized = requiredText(value, fieldName);
  return findOptionByWireValue(normalized, options)?.id ?? normalized;
}

export function resolveAuthTypeFormValue(value: string | undefined, authTypes: readonly AuthTypeOption[]): string {
  const normalized = optionalText(value ?? '');
  if (!normalized) {
    return 'api-key';
  }
  const lowerValue = normalized.toLowerCase();
  return authTypes.find((type) => {
    const aliases = type.aliases ?? [];
    return type.id === lowerValue
      || type.title.toLowerCase() === lowerValue
      || type.wireValue?.toLowerCase() === lowerValue
      || aliases.some((alias) => alias.toLowerCase() === lowerValue);
  })?.id ?? normalized;
}

export function resolveAuthTypeSubmitValue(value: string, authTypes: readonly AuthTypeOption[]): string {
  const normalized = requiredText(value, 'authType');
  const option = authTypes.find((type) => type.id === normalized);
  return option?.wireValue ?? option?.title ?? normalized;
}

export function createChannelInputFromForm(values: ChannelFormValues): ChannelCreateInput {
  const weight = positiveInteger(values.weight, 'weight');
  return omitUndefined({
    name: values.name.trim(),
    vendor: values.vendor.trim(),
    channelType: optionalChannelType(values.channelType),
    protocol: optionalText(values.protocol),
    accessType: optionalText(values.accessType),
    baseUrl: optionalText(values.baseUrl),
    apiKey: optionalText(values.apiKey),
    secretRef: optionalText(values.secretRef),
    expiresAt: optionalText(values.expiresAt),
    capabilities: normalizedCapabilities(values.capabilities),
    resourceCodes: normalizedResourceCodes(values.resourceCodes),
    models: normalizedTextArray(values.models),
    circuitBreakerPolicy: normalizeCreateCircuitBreakerPolicy(values),
    weight,
    status: channelStatus(values.status),
  });
}

export function createChannelUpdateInputFromForm(values: ChannelFormValues): ChannelUpdateInput {
  const weight = positiveInteger(values.weight, 'weight');
  return omitUndefined({
    name: optionalText(values.name),
    vendor: optionalText(values.vendor),
    channelType: optionalChannelType(values.channelType),
    protocol: optionalText(values.protocol),
    accessType: optionalText(values.accessType),
    baseUrl: optionalText(values.baseUrl),
    apiKey: optionalText(values.apiKey),
    secretRef: optionalText(values.secretRef),
    expiresAt: values.expiresAt === undefined ? undefined : optionalText(values.expiresAt) ?? null,
    capabilities: normalizedCapabilities(values.capabilities),
    resourceCodes: normalizedResourceCodesForUpdate(values.resourceCodes),
    models: normalizedTextArray(values.models),
    circuitBreakerPolicy: 'circuitBreakerEnabled' in values
      ? normalizeCircuitBreakerPolicy(values, true)
      : undefined,
    weight,
    status: channelStatus(values.status),
  });
}

export function createChannelStatusUpdateInput(status: string): ChannelUpdateInput {
  return { status: channelStatus(status) };
}

export function createProviderSecretInputFromForm(values: ProviderSecretFormValues): ProviderSecretInput {
  return omitUndefined({
    providerCode: values.providerCode.trim(),
    name: values.name.trim(),
    authType: optionalText(values.authType) ?? 'api-key',
    secretRef: values.secretRef.trim(),
    status: providerSecretStatus(values.status),
  });
}

export function createProviderSecretUpdateInputFromForm(values: ProviderSecretFormValues): ProviderSecretUpdateInput {
  return omitUndefined({
    providerCode: optionalText(values.providerCode),
    name: optionalText(values.name),
    authType: optionalText(values.authType),
    secretRef: optionalText(values.secretRef),
    status: providerSecretStatus(values.status),
  });
}

export function createProviderSecretStatusUpdateInput(status: string): ProviderSecretUpdateInput {
  return { status: providerSecretStatus(status) };
}

export function createChannelEndpointEditDraft(
  endpoint: ChannelEndpoint,
): ChannelEndpointFormValues {
  return {
    channelId: endpoint.channelId,
    vendorCode: endpoint.vendorCode,
    regionCode: endpoint.regionCode,
    apiEndpointCode: endpoint.apiEndpointCode,
    baseUrl: endpoint.baseUrl,
    priority: endpoint.priority,
    weight: endpoint.weight,
    status: endpoint.status,
    effectiveFrom: endpoint.effectiveFrom ?? '',
    effectiveTo: endpoint.effectiveTo ?? '',
  };
}

export function createChannelEndpointInputFromForm(
  values: ChannelEndpointFormValues,
): ChannelEndpointCreateInput {
  return omitUndefined({
    channelId: positiveIdText(values.channelId, 'channelId'),
    vendorCode: providerEndpointCode(values.vendorCode, 'vendorCode'),
    regionCode: providerEndpointCode(values.regionCode, 'regionCode'),
    apiEndpointCode: providerEndpointCode(values.apiEndpointCode, 'apiEndpointCode'),
    baseUrl: providerEndpointBaseUrl(values.baseUrl),
    priority: optionalPositiveInteger(values.priority, 'priority'),
    weight: optionalPositiveInteger(values.weight, 'weight'),
    status: channelEndpointStatus(values.status ?? 'active'),
    effectiveFrom: optionalText(values.effectiveFrom),
    effectiveTo: optionalText(values.effectiveTo),
  });
}

export function createChannelEndpointUpdateInputFromForm(
  values: ChannelEndpointFormValues,
): ChannelEndpointUpdateInput {
  return omitUndefined({
    vendorCode: optionalProviderEndpointCode(values.vendorCode, 'vendorCode'),
    regionCode: optionalProviderEndpointCode(values.regionCode, 'regionCode'),
    apiEndpointCode: optionalProviderEndpointCode(values.apiEndpointCode, 'apiEndpointCode'),
    baseUrl: values.baseUrl === undefined ? undefined : providerEndpointBaseUrl(values.baseUrl),
    priority: optionalPositiveInteger(values.priority, 'priority'),
    weight: optionalPositiveInteger(values.weight, 'weight'),
    status: optionalChannelEndpointStatus(values.status),
    effectiveFrom: values.effectiveFrom === undefined ? undefined : optionalNullableText(values.effectiveFrom) ?? null,
    effectiveTo: values.effectiveTo === undefined ? undefined : optionalNullableText(values.effectiveTo) ?? null,
  });
}

export function createAiResourceEditDraft(resource: AiResource): AiResourceFormValues {
  return {
    resourceCode: resource.resourceCode,
    resourceType: resource.resourceType,
    displayName: resource.displayName,
    vendorCode: resource.vendorCode ?? '',
    modalityCode: resource.modalityCode ?? '',
    apiEndpointCode: resource.apiEndpointCode ?? '',
    catalogKey: resource.catalogKey ?? '',
    model: resource.model ?? '',
    providerNativeModel: resource.providerNativeModel ?? '',
    compositionMode: resource.compositionMode,
    status: resource.status,
    sortOrder: resource.sortOrder ?? '',
    membersText: aiResourceMembersToText(resource),
  };
}

export function createAiResourceInputFromForm(
  values: AiResourceFormValues,
): AiResourceCreateInput {
  return omitUndefined({
    resourceCode: requiredText(values.resourceCode ?? '', 'resourceCode'),
    resourceType: aiResourceType(values.resourceType ?? 'bundle'),
    displayName: requiredText(values.displayName ?? '', 'displayName'),
    vendorCode: optionalText(values.vendorCode),
    modalityCode: optionalText(values.modalityCode),
    apiEndpointCode: optionalText(values.apiEndpointCode),
    catalogKey: optionalText(values.catalogKey),
    model: optionalText(values.model),
    providerNativeModel: optionalText(values.providerNativeModel),
    compositionMode: aiResourceCompositionMode(values.compositionMode ?? 'single'),
    status: aiResourceStatus(values.status ?? 'active'),
    sortOrder: optionalNonNegativeInteger(values.sortOrder, 'sortOrder'),
    members: parseAiResourceMembers(values.membersText ?? ''),
  });
}

export function createAiResourceUpdateInputFromForm(
  values: AiResourceFormValues,
): AiResourceUpdateInput {
  return omitUndefined({
    resourceCode: optionalText(values.resourceCode),
    resourceType: optionalAiResourceType(values.resourceType),
    displayName: optionalText(values.displayName),
    vendorCode: optionalNullableText(values.vendorCode),
    modalityCode: optionalNullableText(values.modalityCode),
    apiEndpointCode: optionalNullableText(values.apiEndpointCode),
    catalogKey: optionalNullableText(values.catalogKey),
    model: optionalNullableText(values.model),
    providerNativeModel: optionalNullableText(values.providerNativeModel),
    compositionMode: optionalAiResourceCompositionMode(values.compositionMode),
    status: optionalAiResourceStatus(values.status),
    sortOrder: optionalNullableNonNegativeInteger(values.sortOrder, 'sortOrder'),
    members: values.membersText === undefined ? undefined : parseAiResourceMembers(values.membersText),
  });
}

function normalizedTextArray(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function findOptionByWireValue(value: string, options: readonly SelectOption[]): SelectOption | undefined {
  const lowerValue = value.toLowerCase();
  return options.find((option) => {
    const aliases = option.aliases ?? [];
    return option.id.toLowerCase() === lowerValue
      || option.label?.toLowerCase() === lowerValue
      || option.title?.toLowerCase() === lowerValue
      || option.name?.toLowerCase() === lowerValue
      || aliases.some((alias) => alias.toLowerCase() === lowerValue);
  });
}

function normalizedCapabilities(values: string[]): ChannelCapability[] | undefined {
  const allowed = new Set<string>(CHANNEL_CAPABILITIES);
  const normalized: ChannelCapability[] = [];
  for (const rawValue of normalizedTextArray(values)) {
    const value = rawValue.toLowerCase();
    if (!allowed.has(value)) {
      throw new Error(`Unsupported channel capability: ${value}`);
    }
    normalized.push(value as ChannelCapability);
  }
  return normalized.length > 0 ? normalized : undefined;
}

function optionalChannelType(value: string | undefined): ChannelCreateInput['channelType'] | undefined {
  const normalized = optionalText(value)?.toLowerCase();
  if (!normalized) {
    return undefined;
  }
  if (normalized === 'official' || normalized === 'relay') {
    return normalized;
  }
  throw new Error(`Unsupported channel type: ${normalized}`);
}

function normalizedResourceCodes(values: string[] | undefined): string[] | undefined {
  const normalized = Array.from(new Set(
    normalizedTextArray(values ?? []).map((value) => value.toLowerCase()),
  ));
  validateResourceCodes(normalized);
  return normalized.length > 0 ? normalized : undefined;
}

function normalizedResourceCodesForUpdate(values: string[] | undefined): string[] | undefined {
  if (values === undefined) {
    return undefined;
  }
  const normalized = Array.from(new Set(
    normalizedTextArray(values).map((value) => value.toLowerCase()),
  ));
  validateResourceCodes(normalized);
  return normalized;
}

function validateResourceCodes(values: string[]): void {
  for (const code of values) {
    if (!/^[a-z0-9._-]+$/.test(code)) {
      throw new Error(`Unsupported AI resource code: ${code}`);
    }
  }
}

function optionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function positiveInteger(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return value;
}

function optionalBoundedInteger(
  value: number | string | null | undefined,
  fieldName: string,
  min: number,
  max: number,
): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim()
      ? Number(value.trim())
      : Number.NaN;
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  return parsed;
}

function normalizeCircuitBreakerPolicy(
  values: ChannelFormValues,
  allowClear: boolean,
): ChannelCreateInput['circuitBreakerPolicy'] | ChannelUpdateInput['circuitBreakerPolicy'] {
  if (!values.circuitBreakerEnabled) {
    return allowClear ? null : undefined;
  }
  const failureThreshold = optionalBoundedInteger(
    values.circuitBreakerFailureThreshold ?? 3,
    'circuitBreakerPolicy.failureThreshold',
    1,
    100,
  );
  if (failureThreshold === undefined) {
    throw new Error('circuitBreakerPolicy.failureThreshold must be between 1 and 100');
  }
  return { failureThreshold };
}

function normalizeCreateCircuitBreakerPolicy(values: ChannelFormValues): ChannelCreateInput['circuitBreakerPolicy'] {
  const policy = normalizeCircuitBreakerPolicy(values, false);
  return policy === null ? undefined : policy;
}

function channelStatus(value: string): NonNullable<ChannelCreateInput['status']> {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'active' || normalized === 'disabled' || normalized === 'error') {
    return normalized;
  }
  throw new Error(normalized ? `Unsupported channel status: ${normalized}` : 'Channel status is required');
}

function providerSecretStatus(value: string): NonNullable<ProviderSecretInput['status']> {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'active' || normalized === 'disabled') {
    return normalized;
  }
  throw new Error(normalized ? `Unsupported provider credential status: ${normalized}` : 'Provider credential status is required');
}

function channelEndpointStatus(value: string): NonNullable<ChannelEndpointCreateInput['status']> {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'active' || normalized === 'disabled' || normalized === 'inactive') {
    return normalized;
  }
  throw new Error(normalized ? `Unsupported channel endpoint status: ${normalized}` : 'Channel endpoint status is required');
}

function optionalChannelEndpointStatus(
  value: string | undefined,
): ChannelEndpointUpdateInput['status'] {
  const normalized = optionalText(value);
  return normalized === undefined ? undefined : channelEndpointStatus(normalized);
}

function positiveIdText(value: string | undefined, fieldName: string): string {
  const normalized = requiredText(value ?? '', fieldName);
  if (!/^[1-9][0-9]*$/.test(normalized)) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return normalized;
}

function providerEndpointCode(value: string | undefined, fieldName: string): string {
  const normalized = requiredText(value ?? '', fieldName).toLowerCase();
  if (!/^[a-z0-9._*-]+$/.test(normalized)) {
    throw new Error(`${fieldName} may only contain letters, numbers, ., -, _, and *`);
  }
  return normalized;
}

function optionalProviderEndpointCode(value: string | undefined, fieldName: string): string | undefined {
  const normalized = optionalText(value);
  return normalized === undefined ? undefined : providerEndpointCode(normalized, fieldName);
}

function providerEndpointBaseUrl(value: string | undefined): string {
  const normalized = requiredText(value ?? '', 'baseUrl');
  if (!/^https?:\/\//i.test(normalized)) {
    throw new Error('baseUrl must start with http:// or https://');
  }
  if (/\s|[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new Error('baseUrl must not contain whitespace or control characters');
  }
  return normalized;
}

function aiResourceMembersToText(resource: AiResource): string {
  return resource.members
    .map((member) => [
      member.memberResourceCode,
      member.memberRole,
      String(member.required),
      member.sortOrder ?? '',
    ].join(' | ').replace(/\s+\|\s*$/u, ''))
    .join('\n');
}

function parseAiResourceMembers(value: string): AiResourceMemberInput[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [rawCode, rawRole, rawRequired, rawSortOrder] = line.split('|').map((part) => part.trim());
      if (!rawCode) {
        throw new Error(`members[${index}].memberResourceCode is required`);
      }
      const member: AiResourceMemberInput = {
        memberResourceCode: rawCode,
      };
      if (rawRole) {
        member.memberRole = aiResourceMemberRole(rawRole);
      }
      if (rawRequired) {
        const normalizedRequired = rawRequired.toLowerCase();
        if (normalizedRequired !== 'true' && normalizedRequired !== 'false') {
          throw new Error(`members[${index}].required must be true or false`);
        }
        member.required = normalizedRequired === 'true';
      }
      if (rawSortOrder) {
        member.sortOrder = nonNegativeIntegerFromString(
          rawSortOrder,
          `members[${index}].sortOrder must be a non-negative integer`,
        );
      }
      return member;
    });
}

function optionalNullableText(value: string | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  return optionalText(value) ?? null;
}

function optionalNonNegativeInteger(
  value: number | string | null | undefined,
  fieldName: string,
): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  if (typeof value === 'string' && !value.trim()) {
    return undefined;
  }
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim()
      ? nonNegativeIntegerFromString(value.trim(), `${fieldName} must be a non-negative integer`)
      : Number.NaN;
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }
  return parsed;
}

function optionalPositiveInteger(
  value: number | string | null | undefined,
  fieldName: string,
): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim()
      ? Number(value.trim())
      : Number.NaN;
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return parsed;
}

function optionalNullableNonNegativeInteger(
  value: number | string | null | undefined,
  fieldName: string,
): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null || value === '') {
    return null;
  }
  if (typeof value === 'string' && !value.trim()) {
    return null;
  }
  return optionalNonNegativeInteger(value, fieldName) ?? null;
}

function nonNegativeIntegerFromString(value: string, message: string): number {
  if (!/^\d+$/.test(value)) {
    throw new Error(message);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(message);
  }
  return parsed;
}

function aiResourceType(value: string): AiResource['resourceType'] {
  const normalized = value.trim().toLowerCase();
  if (
    normalized === 'vendor'
    || normalized === 'modality'
    || normalized === 'api_endpoint'
    || normalized === 'model_api'
    || normalized === 'bundle'
  ) {
    return normalized;
  }
  throw new Error(normalized ? `Unsupported AI resource type: ${normalized}` : 'AI resource type is required');
}

function optionalAiResourceType(value: string | undefined): AiResourceUpdateInput['resourceType'] {
  const normalized = optionalText(value);
  return normalized === undefined ? undefined : aiResourceType(normalized);
}

function aiResourceCompositionMode(value: string): AiResource['compositionMode'] {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'single' || normalized === 'any' || normalized === 'all') {
    return normalized;
  }
  throw new Error(normalized ? `Unsupported AI resource composition mode: ${normalized}` : 'AI resource composition mode is required');
}

function optionalAiResourceCompositionMode(
  value: string | undefined,
): AiResourceUpdateInput['compositionMode'] {
  const normalized = optionalText(value);
  return normalized === undefined ? undefined : aiResourceCompositionMode(normalized);
}

function aiResourceStatus(value: string): AiResource['status'] {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'active' || normalized === 'disabled' || normalized === 'inactive') {
    return normalized;
  }
  throw new Error(normalized ? `Unsupported AI resource status: ${normalized}` : 'AI resource status is required');
}

function optionalAiResourceStatus(value: string | undefined): AiResourceUpdateInput['status'] {
  const normalized = optionalText(value);
  return normalized === undefined ? undefined : aiResourceStatus(normalized);
}

function aiResourceMemberRole(
  value: string,
): NonNullable<AiResourceMemberInput['memberRole']> {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'included' || normalized === 'optional' || normalized === 'fallback') {
    return normalized;
  }
  throw new Error(`Unsupported AI resource member role: ${value}`);
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
