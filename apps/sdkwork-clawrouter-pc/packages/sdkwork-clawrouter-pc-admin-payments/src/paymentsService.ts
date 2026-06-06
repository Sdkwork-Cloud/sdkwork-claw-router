import { createIdempotencyParams, createClientOperationToken, getClawRouterBackendSdkClient } from 'sdkwork-clawrouter-pc-commons/runtime';

type BackendCommerce = ReturnType<typeof getClawRouterBackendSdkClient>['commerce'];
export type PaymentProviderAccountMutationInput = Parameters<BackendCommerce['payments']['providerAccounts']['create']>[0];
export type PaymentProviderAccountStatusUpdateInput = Parameters<BackendCommerce['payments']['providerAccounts']['status']['update']>[1];

export async function backendPaymentsProvidersList(params?: Parameters<BackendCommerce['payments']['providers']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.payments.providers.list(params);
}

export async function backendPaymentsProviderAccountsList(
  params?: Parameters<BackendCommerce['payments']['providerAccounts']['list']>[0],
) {
  return getClawRouterBackendSdkClient().commerce.payments.providerAccounts.list(params);
}

export async function backendPaymentsProviderAccountsCreate(input: PaymentProviderAccountMutationInput) {
  const body: PaymentProviderAccountMutationInput = {
    ...input,
    clientRequestNo: input.clientRequestNo ?? createClientOperationToken('payment-provider-account'),
  };
  return getClawRouterBackendSdkClient().commerce.payments.providerAccounts.create(
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
  return getClawRouterBackendSdkClient().commerce.payments.providerAccounts.update(
    providerAccountId,
    body,
    createIdempotencyParams('backend-payment-provider-account-update'),
  );
}

export async function backendPaymentsProviderAccountsDelete(providerAccountId: string) {
  return getClawRouterBackendSdkClient().commerce.payments.providerAccounts.delete(providerAccountId);
}

export async function backendPaymentsProviderAccountsStatusUpdate(
  providerAccountId: string,
  input: PaymentProviderAccountStatusUpdateInput,
) {
  const body: PaymentProviderAccountStatusUpdateInput = {
    ...input,
    clientRequestNo: input.clientRequestNo ?? createClientOperationToken('payment-provider-account-status'),
  };
  return getClawRouterBackendSdkClient().commerce.payments.providerAccounts.status.update(
    providerAccountId,
    body,
    createIdempotencyParams('backend-payment-provider-account-status'),
  );
}

export async function backendPaymentsMethodsList(params?: Parameters<BackendCommerce['payments']['methods']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.payments.methods.list(params);
}

export async function backendPaymentsChannelsList(params?: Parameters<BackendCommerce['payments']['channels']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.payments.channels.list(params);
}

export async function backendPaymentsRouteRulesList(params?: Parameters<BackendCommerce['payments']['routeRules']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.payments.routeRules.list(params);
}

export async function backendPaymentsRuntimeSnapshotRetrieve(
  params?: Parameters<BackendCommerce['payments']['runtime']['snapshot']['retrieve']>[0],
) {
  return getClawRouterBackendSdkClient().commerce.payments.runtime.snapshot.retrieve(params);
}

export async function backendPaymentsIntentsList(params?: Parameters<BackendCommerce['payments']['intents']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.payments.intents.list(params);
}

export async function backendPaymentsAttemptsList(params?: Parameters<BackendCommerce['payments']['attempts']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.payments.attempts.list(params);
}

export async function backendPaymentsWebhookEventsList(params?: Parameters<BackendCommerce['payments']['webhookEvents']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.payments.webhookEvents.list(params);
}

export async function backendPaymentsReconciliationRunsList(
  params?: Parameters<BackendCommerce['payments']['reconciliationRuns']['list']>[0],
) {
  return getClawRouterBackendSdkClient().commerce.payments.reconciliationRuns.list(params);
}
