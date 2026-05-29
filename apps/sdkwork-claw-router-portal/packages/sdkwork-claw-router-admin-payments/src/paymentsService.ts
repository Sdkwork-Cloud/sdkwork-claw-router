import { createIdempotencyParams, createClientOperationToken, getClawRouterBackendSdkClient } from 'sdkwork-claw-router-commons/runtime';

type BackendCommerce = ReturnType<typeof getClawRouterBackendSdkClient>['commerce'];
export type PaymentProviderAccountMutationInput = Parameters<BackendCommerce['payments']['providerAccounts']['create']>[0];

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

export async function backendPaymentsMethodsList(params?: Parameters<BackendCommerce['payments']['methods']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.payments.methods.list(params);
}

export async function backendPaymentsChannelsList(params?: Parameters<BackendCommerce['payments']['channels']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.payments.channels.list(params);
}

export async function backendPaymentsRouteRulesList(params?: Parameters<BackendCommerce['payments']['routeRules']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.payments.routeRules.list(params);
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
