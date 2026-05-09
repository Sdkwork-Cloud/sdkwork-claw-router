import type { Model, ModelCreateInput, ModelUpdateInput, VendorCreateInput } from './modelService';

type KnownVendorOption = {
  id: string;
  name: string;
  desc: string;
};

const DEFAULT_VENDOR_COLOR = 'bg-indigo-500';
const DEFAULT_VENDOR_DESCRIPTION = 'Custom model vendor';
const DEFAULT_CONTEXT_TOKENS = '8k';
const MODEL_TYPES: readonly Model['type'][] = ['Chat', 'Image', 'Audio', 'Embedding', 'Music', 'SoundEffect', 'Video'];

export function createVendorInputFromForm(
  formData: FormData,
  vendorSelection: string,
  knownVendors: readonly KnownVendorOption[],
  vendorDescription: string,
): VendorCreateInput | null {
  const selectedVendor = knownVendors.find(vendor => vendor.id === vendorSelection);
  const name = vendorSelection === 'custom'
    ? readFormText(formData, 'customName')
    : selectedVendor?.name.trim() ?? '';

  if (!name) {
    return null;
  }

  return {
    name,
    status: 'active',
    color: DEFAULT_VENDOR_COLOR,
    description: firstNonEmpty(
      vendorDescription,
      readFormText(formData, 'description'),
      selectedVendor?.desc,
      DEFAULT_VENDOR_DESCRIPTION,
    ),
  };
}

export function createModelInputFromForm(formData: FormData, vendorId: string): ModelCreateInput {
  return {
    vendorId: vendorId.trim(),
    name: readFormText(formData, 'name'),
    type: readModelType(formData.get('type')),
    priceIn: readDecimalText(formData.get('priceIn')),
    priceOut: readDecimalText(formData.get('priceOut')),
    contextTokens: firstNonEmpty(readFormText(formData, 'contextTokens'), DEFAULT_CONTEXT_TOKENS),
  };
}

export function updateModelInputFromForm(
  formData: FormData,
  vendorId: string,
  currentModel: Model,
): ModelUpdateInput {
  return {
    ...createModelInputFromForm(formData, vendorId),
    currentType: currentModel.type,
  };
}

function readFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function readModelType(value: FormDataEntryValue | null): Model['type'] {
  if (typeof value === 'string' && MODEL_TYPES.includes(value as Model['type'])) {
    return value as Model['type'];
  }
  return 'Chat';
}

function readDecimalText(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim().replace(/,/g, '') : '';
}

function firstNonEmpty(...values: Array<string | undefined>): string {
  for (const value of values) {
    const normalized = value?.trim();
    if (normalized) {
      return normalized;
    }
  }
  return '';
}
