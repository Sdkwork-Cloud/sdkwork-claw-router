import { createClientOperationToken } from 'sdkwork-clawrouter-pc-commons/runtime';
import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

type CommerceRequestParams = Record<string, unknown>;
export type PaymentProviderAccountMutationInput = Record<string, unknown> & {
  clientRequestNo?: string;
};
export type PaymentProviderAccountStatusUpdateInput = Record<string, unknown> & {
  clientRequestNo?: string;
};

export async function backendPaymentsProvidersList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.payments.providers.list(params);
}

export async function backendPaymentsProviderAccountsList(
  params?: CommerceRequestParams,
) {
  return getSdkworkCommerceService().admin.payments.providerAccounts.list(params);
}

export async function backendPaymentsProviderAccountsCreate(input: PaymentProviderAccountMutationInput) {
  const body: PaymentProviderAccountMutationInput = {
    ...input,
    clientRequestNo: input.clientRequestNo ?? createClientOperationToken('payment-provider-account'),
  };
  return getSdkworkCommerceService().admin.payments.providerAccounts.create(body);
}

export async function backendPaymentsProviderAccountsUpdate(
  providerAccountId: string,
  input: PaymentProviderAccountMutationInput,
) {
  const body: PaymentProviderAccountMutationInput = {
    ...input,
    clientRequestNo: input.clientRequestNo ?? createClientOperationToken('payment-provider-account-update'),
  };
  return getSdkworkCommerceService().admin.payments.providerAccounts.update(
    providerAccountId,
    body,
  );
}

export async function backendPaymentsProviderAccountsDelete(providerAccountId: string) {
  return getSdkworkCommerceService().admin.payments.providerAccounts.delete(providerAccountId);
}

export async function backendPaymentsProviderAccountsStatusUpdate(
  providerAccountId: string,
  input: PaymentProviderAccountStatusUpdateInput,
) {
  const body: PaymentProviderAccountStatusUpdateInput = {
    ...input,
    clientRequestNo: input.clientRequestNo ?? createClientOperationToken('payment-provider-account-status'),
  };
  return getSdkworkCommerceService().admin.payments.providerAccounts.status.update(
    providerAccountId,
    body,
  );
}

export async function backendPaymentsMethodsList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.payments.methods.list(params);
}

export async function backendPaymentsChannelsList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.payments.channels.list(params);
}

export async function backendPaymentsRouteRulesList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.payments.routeRules.list(params);
}

export async function backendPaymentsRuntimeSnapshotRetrieve(
  params?: CommerceRequestParams,
) {
  return getSdkworkCommerceService().admin.payments.runtime.snapshot.retrieve(params);
}

export async function backendPaymentsIntentsList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.payments.intents.list(params);
}

export async function backendPaymentsAttemptsList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.payments.attempts.list(params);
}

export async function backendPaymentsWebhookEventsList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.payments.webhookEvents.list(params);
}

export async function backendPaymentsReconciliationRunsList(
  params?: CommerceRequestParams,
) {
  return getSdkworkCommerceService().admin.payments.reconciliationRuns.list(params);
}
