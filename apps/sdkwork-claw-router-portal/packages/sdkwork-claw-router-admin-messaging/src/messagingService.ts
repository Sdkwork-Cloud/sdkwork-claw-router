import {
  createClientOperationToken,
  getClawRouterBackendSdkClient,
} from 'sdkwork-claw-router-commons/runtime';

type BackendMessaging = ReturnType<typeof getClawRouterBackendSdkClient>['messaging'];
type ListParams<TList> = TList extends (params?: infer TParams) => unknown ? TParams : never;

export type MessagingProviderAccountListParams = ListParams<BackendMessaging['providerAccounts']['list']>;
export type MessagingProviderAccountCreateInput = Parameters<BackendMessaging['providerAccounts']['create']>[0];
export type MessagingSenderIdentityListParams = ListParams<BackendMessaging['senderIdentities']['list']>;
export type MessagingSenderIdentityCreateInput = Parameters<BackendMessaging['senderIdentities']['create']>[0];
export type MessagingTemplateListParams = ListParams<BackendMessaging['templates']['list']>;
export type MessagingTemplateCreateInput = Parameters<BackendMessaging['templates']['create']>[0];
export type MessagingRouteRuleListParams = ListParams<BackendMessaging['routeRules']['list']>;
export type MessagingRouteRuleCreateInput = Parameters<BackendMessaging['routeRules']['create']>[0];
export type MessagingSendRequestListParams = ListParams<BackendMessaging['sendRequests']['list']>;
export type MessagingRouteSimulationInput = Parameters<BackendMessaging['diagnostics']['routeSimulation']['create']>[0];
export type MessagingTestSendInput = Parameters<BackendMessaging['diagnostics']['testSends']['create']>[0];
export type MessagingTemplateSendInput = Parameters<BackendMessaging['templateSends']['create']>[0];
export type MessagingSuppressionListParams = ListParams<BackendMessaging['suppressions']['list']>;
export type MessagingSuppressionCreateInput = Parameters<BackendMessaging['suppressions']['create']>[0];
export type MessagingRateLimitBucketListParams = ListParams<BackendMessaging['rateLimitBuckets']['list']>;
export type VerificationPolicyListParams = ListParams<BackendMessaging['verificationPolicies']['list']>;
export type VerificationPolicyUpdateInput = Parameters<BackendMessaging['verificationPolicies']['update']>[1];

export const DEFAULT_MESSAGING_PAGE_PARAMS = {
  page: 1,
  pageSize: 100,
} as const;

export async function listMessagingProviderAccounts(params?: MessagingProviderAccountListParams) {
  return getClawRouterBackendSdkClient().messaging.providerAccounts.list(params);
}

export async function createMessagingProviderAccount(input: MessagingProviderAccountCreateInput) {
  const idempotencyKey = createClientOperationToken('admin-messaging-provider-account-create');
  return getClawRouterBackendSdkClient().messaging.providerAccounts.create(input, {
    idempotencyKey: idempotencyKey,
  });
}

export async function listMessagingSenderIdentities(params?: MessagingSenderIdentityListParams) {
  return getClawRouterBackendSdkClient().messaging.senderIdentities.list(params);
}

export async function createMessagingSenderIdentity(input: MessagingSenderIdentityCreateInput) {
  const idempotencyKey = createClientOperationToken('admin-messaging-sender-identity-create');
  return getClawRouterBackendSdkClient().messaging.senderIdentities.create(input, {
    idempotencyKey: idempotencyKey,
  });
}

export async function listMessagingTemplates(params?: MessagingTemplateListParams) {
  return getClawRouterBackendSdkClient().messaging.templates.list(params);
}

export async function createMessagingTemplate(input: MessagingTemplateCreateInput) {
  const idempotencyKey = createClientOperationToken('admin-messaging-template-create');
  return getClawRouterBackendSdkClient().messaging.templates.create(input, {
    idempotencyKey: idempotencyKey,
  });
}

export async function publishMessagingTemplateVersion(templateId: string, versionId: string) {
  return getClawRouterBackendSdkClient().messaging.templates.versions.publish(templateId, versionId);
}

export async function listMessagingRouteRules(params?: MessagingRouteRuleListParams) {
  return getClawRouterBackendSdkClient().messaging.routeRules.list(params);
}

export async function createMessagingRouteRule(input: MessagingRouteRuleCreateInput) {
  const idempotencyKey = createClientOperationToken('admin-messaging-route-rule-create');
  return getClawRouterBackendSdkClient().messaging.routeRules.create(input, {
    idempotencyKey: idempotencyKey,
  });
}

export async function listMessagingSendRequests(params?: MessagingSendRequestListParams) {
  return getClawRouterBackendSdkClient().messaging.sendRequests.list(params);
}

export async function simulateMessagingRoute(input: MessagingRouteSimulationInput) {
  return getClawRouterBackendSdkClient().messaging.diagnostics.routeSimulation.create(input);
}

export async function testMessagingSend(input: MessagingTestSendInput) {
  const idempotencyKey = createClientOperationToken('admin-messaging-test-send');
  return getClawRouterBackendSdkClient().messaging.diagnostics.testSends.create(input, {
    idempotencyKey: idempotencyKey,
  });
}

export async function sendMessagingTemplate(input: MessagingTemplateSendInput) {
  const idempotencyKey = createClientOperationToken('admin-messaging-template-send');
  return getClawRouterBackendSdkClient().messaging.templateSends.create(input, {
    idempotencyKey: idempotencyKey,
  });
}

export async function listMessagingSuppressions(params?: MessagingSuppressionListParams) {
  return getClawRouterBackendSdkClient().messaging.suppressions.list(params);
}

export async function createMessagingSuppression(input: MessagingSuppressionCreateInput) {
  const idempotencyKey = createClientOperationToken('admin-messaging-suppression-create');
  return getClawRouterBackendSdkClient().messaging.suppressions.create(input, {
    idempotencyKey: idempotencyKey,
  });
}

export async function listMessagingRateLimitBuckets(params?: MessagingRateLimitBucketListParams) {
  return getClawRouterBackendSdkClient().messaging.rateLimitBuckets.list(params);
}

export async function listVerificationPolicies(params?: VerificationPolicyListParams) {
  return getClawRouterBackendSdkClient().messaging.verificationPolicies.list(params);
}

export async function updateVerificationPolicy(policyId: string, input: VerificationPolicyUpdateInput) {
  return getClawRouterBackendSdkClient().messaging.verificationPolicies.update(policyId, input);
}
