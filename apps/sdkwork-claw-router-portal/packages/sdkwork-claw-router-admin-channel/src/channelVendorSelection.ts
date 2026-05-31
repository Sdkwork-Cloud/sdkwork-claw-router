import { isCatalogModelKey, providerCodeForVendor } from './channelService.ts';

export type ChannelVendorSelectionType = 'official' | 'relay';

export type DeriveChannelTargetVendorCodesInput = {
  channelType?: string;
  accountVendor: string;
  models?: readonly string[];
  resourceCodes?: readonly string[];
};

export type ReconcileChannelVendorSelectionInput = {
  channelType?: string;
  accountVendor: string;
  selectedVendorCodes: readonly string[];
  selectedResourceCodes?: readonly string[];
  availableResourceCodes?: readonly string[];
};

export type ReconciledChannelVendorSelection = {
  selectedVendorCodes: string[];
  selectedResourceCodes: string[];
};

export function normalizeChannelVendorCode(value: string): string {
  return providerCodeForVendor(value);
}

export function normalizeChannelResourceCode(value: string): string {
  return value.trim().toLowerCase();
}

export function vendorResourceCode(vendorCode: string): string {
  return `vendor.${normalizeChannelVendorCode(vendorCode)}`;
}

export function isVendorResourceCode(resourceCode: string): boolean {
  return normalizeChannelResourceCode(resourceCode).startsWith('vendor.');
}

export function deriveChannelTargetVendorCodes(
  input: DeriveChannelTargetVendorCodesInput,
): string[] {
  const accountVendorCode = normalizeChannelVendorCode(input.accountVendor);
  if (resolveSelectionType(input.channelType) === 'official') {
    return [accountVendorCode];
  }

  const vendorCodes = [
    ...(input.models ?? []).map(vendorCodeFromCatalogModel).filter(isNonEmptyString),
    ...(input.resourceCodes ?? []).map(vendorCodeFromVendorResource).filter(isNonEmptyString),
  ];
  return uniqueStrings(vendorCodes.length > 0 ? vendorCodes : [accountVendorCode]);
}

export function reconcileChannelVendorSelection(
  input: ReconcileChannelVendorSelectionInput,
): ReconciledChannelVendorSelection {
  const selectionType = resolveSelectionType(input.channelType);
  const accountVendorCode = normalizeChannelVendorCode(input.accountVendor);
  const selectedVendorCodes = selectionType === 'official'
    ? [accountVendorCode]
    : uniqueStrings(input.selectedVendorCodes.map(normalizeChannelVendorCode))
      .filter(Boolean);
  const effectiveVendorCodes = selectedVendorCodes.length > 0 ? selectedVendorCodes : [accountVendorCode];
  const selectedResourceCodes = uniqueStrings((input.selectedResourceCodes ?? [])
    .map(normalizeChannelResourceCode)
    .filter(Boolean));
  const availableResourceCodes = new Set([
    ...(input.availableResourceCodes ?? []).map(normalizeChannelResourceCode).filter(Boolean),
    ...selectedResourceCodes,
  ]);
  const nonVendorResourceCodes = selectedResourceCodes.filter((code) => !isVendorResourceCode(code));
  const managedVendorResourceCodes = effectiveVendorCodes
    .map(vendorResourceCode)
    .filter((code) => availableResourceCodes.has(code));

  return {
    selectedVendorCodes: effectiveVendorCodes,
    selectedResourceCodes: uniqueStrings([...nonVendorResourceCodes, ...managedVendorResourceCodes]),
  };
}

function resolveSelectionType(value: string | undefined): ChannelVendorSelectionType {
  return value === 'relay' ? 'relay' : 'official';
}

function vendorCodeFromCatalogModel(model: string): string | undefined {
  const normalized = model.trim();
  if (!isCatalogModelKey(normalized)) {
    return undefined;
  }
  return normalizeChannelVendorCode(normalized.split('/')[0] ?? '');
}

function vendorCodeFromVendorResource(resourceCode: string): string | undefined {
  const normalized = normalizeChannelResourceCode(resourceCode);
  if (!normalized.startsWith('vendor.')) {
    return undefined;
  }
  return normalizeChannelVendorCode(normalized.slice('vendor.'.length));
}

function uniqueStrings(values: readonly string[]): string[] {
  return Array.from(new Set(values));
}

function isNonEmptyString(value: string | undefined): value is string {
  return Boolean(value);
}
