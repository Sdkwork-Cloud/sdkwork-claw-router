import type {
  ServiceProviderDownstreamCreateInput,
  ServiceProviderPricingRuleCreateInput,
  ServiceProviderPricingRuleUpdateInput,
} from './serviceProviderService';

export type ServiceProviderDownstreamFormState = {
  sellerProviderId: string;
  providerNo: string;
  displayName: string;
  providerType: string;
  defaultCurrency: string;
  settlementMode: string;
  pricePlanCode: string;
  defaultMultiplier: string;
};

export type ServiceProviderPricingRuleCreateFormState = {
  sellerProviderId: string;
  buyerProviderId: string;
  edgeId: string;
  pricePlanId: string;
  catalogKey: string;
  model: string;
  billingMeterCode: string;
  tokenKind: string;
  unitPrice: string;
  unitSize: string;
  minimumCharge: string;
  currency: string;
  priority: string;
};

export type ServiceProviderPricingRuleUpdateFormState = {
  ruleId: string;
  unitPrice: string;
  unitSize: string;
  minimumCharge: string;
  priority: string;
  status: string;
};

export type ServiceProviderPricingRuleUpdateCommand = {
  ruleId: string;
  input: ServiceProviderPricingRuleUpdateInput;
};

type PricingRuleStatus = NonNullable<ServiceProviderPricingRuleUpdateInput['status']>;

const DECIMAL_PATTERN = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;
const INTEGER_PATTERN = /^(?:0|[1-9]\d*)$/;
const PRICE_RULE_STATUSES: readonly PricingRuleStatus[] = ['active', 'inactive', 'suspended'];

export const DEFAULT_SERVICE_PROVIDER_DOWNSTREAM_FORM: ServiceProviderDownstreamFormState = {
  sellerProviderId: '',
  providerNo: '',
  displayName: '',
  providerType: 'reseller',
  defaultCurrency: 'USD',
  settlementMode: 'prepaid',
  pricePlanCode: '',
  defaultMultiplier: '1.0000',
};

export const DEFAULT_SERVICE_PROVIDER_PRICING_RULE_CREATE_FORM: ServiceProviderPricingRuleCreateFormState = {
  sellerProviderId: '',
  buyerProviderId: '',
  edgeId: '',
  pricePlanId: '',
  catalogKey: '',
  model: '',
  billingMeterCode: 'llm_input_token',
  tokenKind: 'input',
  unitPrice: '0.0000',
  unitSize: '1000',
  minimumCharge: '0',
  currency: 'USD',
  priority: '100',
};

export const DEFAULT_SERVICE_PROVIDER_PRICING_RULE_UPDATE_FORM: ServiceProviderPricingRuleUpdateFormState = {
  ruleId: '',
  unitPrice: '',
  unitSize: '',
  minimumCharge: '',
  priority: '',
  status: '',
};

export function toServiceProviderDownstreamCreateRequest(
  form: ServiceProviderDownstreamFormState,
): ServiceProviderDownstreamCreateInput {
  return {
    sellerProviderId: requiredText(form.sellerProviderId, 'sellerProviderId'),
    providerNo: requiredText(form.providerNo, 'providerNo'),
    displayName: requiredText(form.displayName, 'displayName'),
    ...optionalField('providerType', optionalText(form.providerType)),
    ...optionalField('defaultCurrency', optionalUppercaseText(form.defaultCurrency)),
    ...optionalField('settlementMode', optionalText(form.settlementMode)),
    ...optionalField('pricePlanCode', optionalText(form.pricePlanCode)),
    ...optionalField('defaultMultiplier', optionalDecimal(form.defaultMultiplier, 'defaultMultiplier', 'nonNegative')),
  };
}

export function toServiceProviderPricingRuleCreateRequest(
  form: ServiceProviderPricingRuleCreateFormState,
): ServiceProviderPricingRuleCreateInput {
  const edgeId = optionalText(form.edgeId);
  const pricePlanId = optionalText(form.pricePlanId);
  if (!edgeId && !pricePlanId) {
    throw new Error('edgeId or pricePlanId is required');
  }

  return {
    sellerProviderId: requiredText(form.sellerProviderId, 'sellerProviderId'),
    buyerProviderId: requiredText(form.buyerProviderId, 'buyerProviderId'),
    ...optionalField('edgeId', edgeId),
    ...optionalField('pricePlanId', pricePlanId),
    ...optionalField('catalogKey', optionalText(form.catalogKey)),
    ...optionalField('model', optionalText(form.model)),
    billingMeterCode: requiredText(form.billingMeterCode, 'billingMeterCode'),
    ...optionalField('tokenKind', optionalText(form.tokenKind)),
    unitPrice: requiredDecimal(form.unitPrice, 'unitPrice', 'nonNegative'),
    unitSize: requiredDecimal(form.unitSize, 'unitSize', 'positive'),
    minimumCharge: requiredDecimal(form.minimumCharge, 'minimumCharge', 'nonNegative'),
    ...optionalField('currency', optionalUppercaseText(form.currency)),
    ...optionalField('priority', optionalInteger(form.priority, 'priority')),
  };
}

export function toServiceProviderPricingRuleUpdateCommand(
  form: ServiceProviderPricingRuleUpdateFormState,
): ServiceProviderPricingRuleUpdateCommand {
  const input: ServiceProviderPricingRuleUpdateInput = {
    ...optionalField('unitPrice', optionalDecimal(form.unitPrice, 'unitPrice', 'nonNegative')),
    ...optionalField('unitSize', optionalDecimal(form.unitSize, 'unitSize', 'positive')),
    ...optionalField('minimumCharge', optionalDecimal(form.minimumCharge, 'minimumCharge', 'nonNegative')),
    ...optionalField('priority', optionalInteger(form.priority, 'priority')),
    ...optionalField('status', optionalPricingRuleStatus(form.status)),
  };
  if (Object.keys(input).length === 0) {
    throw new Error('price rule update must include at least one field');
  }
  return {
    ruleId: requiredText(form.ruleId, 'ruleId'),
    input,
  };
}

function requiredText(value: string, fieldName: string): string {
  const normalized = optionalText(value);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalText(value: string): string | undefined {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

function optionalUppercaseText(value: string): string | undefined {
  return optionalText(value)?.toUpperCase();
}

function requiredDecimal(value: string, fieldName: string, rule: 'positive' | 'nonNegative'): string {
  const normalized = requiredText(value, fieldName);
  validateDecimal(normalized, fieldName, rule);
  return normalized;
}

function optionalDecimal(value: string, fieldName: string, rule: 'positive' | 'nonNegative'): string | undefined {
  const normalized = optionalText(value);
  if (!normalized) {
    return undefined;
  }
  validateDecimal(normalized, fieldName, rule);
  return normalized;
}

function validateDecimal(value: string, fieldName: string, rule: 'positive' | 'nonNegative') {
  if (!DECIMAL_PATTERN.test(value)) {
    throw new Error(`${fieldName} must be a ${rule === 'positive' ? 'positive' : 'non-negative'} decimal`);
  }
  if (rule === 'positive' && Number(value) <= 0) {
    throw new Error(`${fieldName} must be a positive decimal`);
  }
}

function optionalInteger(value: string, fieldName: string): number | undefined {
  const normalized = optionalText(value);
  if (!normalized) {
    return undefined;
  }
  if (!INTEGER_PATTERN.test(normalized)) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }
  return Number(normalized);
}

function optionalPricingRuleStatus(value: string): PricingRuleStatus | undefined {
  const normalized = optionalText(value)?.toLowerCase();
  if (!normalized) {
    return undefined;
  }
  if (!PRICE_RULE_STATUSES.includes(normalized as PricingRuleStatus)) {
    throw new Error(`status must be one of ${PRICE_RULE_STATUSES.join(', ')}`);
  }
  return normalized as PricingRuleStatus;
}

function optionalField<TKey extends string, TValue>(
  key: TKey,
  value: TValue | undefined,
): TValue extends undefined ? Record<string, never> : Partial<Record<TKey, TValue>> {
  if (value === undefined) {
    return {} as TValue extends undefined ? Record<string, never> : Partial<Record<TKey, TValue>>;
  }
  return { [key]: value } as TValue extends undefined ? Record<string, never> : Partial<Record<TKey, TValue>>;
}
