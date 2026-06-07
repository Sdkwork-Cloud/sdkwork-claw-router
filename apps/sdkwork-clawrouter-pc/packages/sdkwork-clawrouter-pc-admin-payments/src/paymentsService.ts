import { getSdkworkCommerceService } from '@sdkwork/commerce-service';
import { createIdempotencyParams, createClientOperationToken } from 'sdkwork-clawrouter-pc-commons/runtime';

type BackendCommerceService = ReturnType<typeof getSdkworkCommerceService>['admin'];
export type PaymentProviderAccountMutationInput = Parameters<BackendCommerceService['payments']['providerAccounts']['create']>[0];
export type PaymentProviderAccountStatusUpdateInput = Parameters<BackendCommerceService['payments']['providerAccounts']['status']['update']>[1];

export async function backendPaymentsProvidersList(params?: Parameters<BackendCommerceService['payments']['providers']['list']>[0]) {
  return getSdkworkCommerceService().admin.payments.providers.list(params);
}

export async function backendPaymentsProviderAccountsList(
  params?: Parameters<BackendCommerceService['payments']['providerAccounts']['list']>[0],
) {
  return getSdkworkCommerceService().admin.payments.providerAccounts.list(params);
}

export async function backendPaymentsProviderAccountsCreate(input: PaymentProviderAccountMutationInput) {
  const body: PaymentProviderAccountMutationInput = {
    ...input,
    clientRequestNo: input.clientRequestNo ?? createClientOperationToken('payment-provider-account'),
  };
  return getSdkworkCommerceService().admin.payments.providerAccounts.create(
    body,
    createIdempotencyParams('backend-payment-provider-account-create'),
  );
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
    createIdempotencyParams('backend-payment-provider-account-update'),
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
    createIdempotencyParams('backend-payment-provider-account-status'),
  );
}

export async function backendPaymentsMethodsList(params?: Parameters<BackendCommerceService['payments']['methods']['list']>[0]) {
  return getSdkworkCommerceService().admin.payments.methods.list(params);
}

export async function backendPaymentsChannelsList(params?: Parameters<BackendCommerceService['payments']['channels']['list']>[0]) {
  return getSdkworkCommerceService().admin.payments.channels.list(params);
}

export async function backendPaymentsRouteRulesList(params?: Parameters<BackendCommerceService['payments']['routeRules']['list']>[0]) {
  return getSdkworkCommerceService().admin.payments.routeRules.list(params);
}

export async function backendPaymentsRuntimeSnapshotRetrieve(
  params?: Parameters<BackendCommerceService['payments']['runtime']['snapshot']['retrieve']>[0],
) {
  return getSdkworkCommerceService().admin.payments.runtime.snapshot.retrieve(params);
}

export async function backendPaymentsIntentsList(params?: Parameters<BackendCommerceService['payments']['intents']['list']>[0]) {
  return getSdkworkCommerceService().admin.payments.intents.list(params);
}

export async function backendPaymentsAttemptsList(params?: Parameters<BackendCommerceService['payments']['attempts']['list']>[0]) {
  return getSdkworkCommerceService().admin.payments.attempts.list(params);
}

export async function backendPaymentsWebhookEventsList(params?: Parameters<BackendCommerceService['payments']['webhookEvents']['list']>[0]) {
  return getSdkworkCommerceService().admin.payments.webhookEvents.list(params);
}

export async function backendPaymentsReconciliationRunsList(
  params?: Parameters<BackendCommerceService['payments']['reconciliationRuns']['list']>[0],
) {
  return getSdkworkCommerceService().admin.payments.reconciliationRuns.list(params);
}
