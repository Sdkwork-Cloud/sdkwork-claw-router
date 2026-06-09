import { getSdkworkAppbaseBackendSdkClient } from 'sdkwork-clawrouter-pc-commons/sdk-clients';

export type OAuthListParams = {
  page?: string;
  pageSize?: string;
  providerCode?: string;
  status?: string;
  surface?: string;
  resourceAccountKind?: string;
  ownerMode?: string;
  q?: string;
};

export type OAuthResourceRecord = Record<string, unknown>;

type OAuthListResource = {
  list(params?: OAuthListParams): Promise<unknown>;
};

type OAuthCreateResource = OAuthListResource & {
  create(input?: OAuthResourceRecord, options?: OAuthResourceRecord): Promise<unknown>;
};

type OAuthCrudResource = OAuthCreateResource & {
  delete(id: string): Promise<unknown>;
  retrieve?(id: string): Promise<unknown>;
  update(id: string, input?: OAuthResourceRecord): Promise<unknown>;
};

type OAuthOperatorPlatformResource = OAuthCrudResource & {
  preAuthorizations?: {
    create(operatorPlatformId: string, input?: OAuthResourceRecord): Promise<unknown>;
  };
};

type OAuthResourceAccountResource = OAuthCrudResource & {
  authorizationRefreshes?: {
    create(resourceAccountId: string, input?: OAuthResourceRecord): Promise<unknown>;
  };
  miniProgramLoginChecks?: {
    create(resourceAccountId: string, input?: OAuthResourceRecord): Promise<unknown>;
  };
  verifications?: {
    create(resourceAccountId: string, input?: OAuthResourceRecord): Promise<unknown>;
  };
};

type OAuthWebhookConfigResource = OAuthCrudResource & {
  verifications?: {
    create(webhookConfigId: string, input?: OAuthResourceRecord): Promise<unknown>;
  };
};

type OAuthOperationalResourceResource = OAuthCrudResource & {
  publishes?: {
    create(resourceId: string, input?: OAuthResourceRecord): Promise<unknown>;
  };
};

type OAuthGrantResource = OAuthListResource & {
  delete(id: string): Promise<unknown>;
};

type OAuthResources = {
  providerCatalog: OAuthListResource;
  integrations: OAuthCrudResource;
  clients: OAuthCrudResource;
  secrets: OAuthCreateResource;
  surfaces: OAuthCrudResource;
  flowConfigs: OAuthCrudResource;
  scopeProfiles: OAuthCrudResource;
  claimMappings: OAuthCrudResource;
  policies: OAuthCrudResource;
  tenantBindings: OAuthCrudResource;
  operatorPlatforms: OAuthOperatorPlatformResource;
  resourceAccounts: OAuthResourceAccountResource;
  resourceAuthorizations: OAuthCrudResource;
  webhookConfigs?: OAuthWebhookConfigResource;
  webhooks?: OAuthWebhookConfigResource;
  operationalResources: OAuthOperationalResourceResource;
  accountLinks: OAuthCrudResource;
  grants: OAuthGrantResource;
  callbackEvents: OAuthListResource;
  diagnosticRuns: OAuthCreateResource & {
    retrieve?(diagnosticRunId: string): Promise<unknown>;
  };
};

type OAuthClient = {
  iam?: {
    oauth?: OAuthResources;
  };
  iamOauth?: {
    iam?: {
      oauth?: OAuthResources;
    };
  };
};

export const OAUTH_SDK_RESOURCE_UNAVAILABLE_ERROR = 'oauth.sdk_resource_unavailable';

export const DEFAULT_OAUTH_PAGE_PARAMS = {
  page: '1',
  pageSize: '100',
} as const satisfies OAuthListParams;

export function getOAuthAdminClient() {
  return oauthClient();
}

export async function listOAuthProviderCatalog(params?: OAuthListParams) {
  return oauthProviderCatalog().list(params);
}

export async function listOAuthIntegrations(params?: OAuthListParams) {
  return oauthIntegrations().list(params);
}

export async function createOAuthIntegration(input: OAuthResourceRecord) {
  return oauthIntegrations().create(input);
}

export async function updateOAuthIntegration(integrationId: string, input: OAuthResourceRecord) {
  return oauthIntegrations().update(integrationId, input);
}

export async function listOAuthClients(params?: OAuthListParams) {
  return oauthClients().list(params);
}

export async function createOAuthClient(input: OAuthResourceRecord) {
  return oauthClients().create(input);
}

export async function updateOAuthClient(clientId: string, input: OAuthResourceRecord) {
  return oauthClients().update(clientId, input);
}

export async function listOAuthSecrets(params?: OAuthListParams) {
  return oauthSecrets().list(params);
}

export async function createOAuthSecret(input: OAuthResourceRecord) {
  return oauthSecrets().create(input);
}

export async function listOAuthSurfaces(params?: OAuthListParams) {
  return oauthSurfaces().list(params);
}

export async function createOAuthSurface(input: OAuthResourceRecord) {
  return oauthSurfaces().create(input);
}

export async function updateOAuthSurface(surfaceId: string, input: OAuthResourceRecord) {
  return oauthSurfaces().update(surfaceId, input);
}

export async function listOAuthFlowConfigs(params?: OAuthListParams) {
  return oauthFlowConfigs().list(params);
}

export async function createOAuthFlowConfig(input: OAuthResourceRecord) {
  return oauthFlowConfigs().create(input);
}

export async function updateOAuthFlowConfig(flowConfigId: string, input: OAuthResourceRecord) {
  return oauthFlowConfigs().update(flowConfigId, input);
}

export async function listOAuthScopeProfiles(params?: OAuthListParams) {
  return oauthScopeProfiles().list(params);
}

export async function createOAuthScopeProfile(input: OAuthResourceRecord) {
  return oauthScopeProfiles().create(input);
}

export async function updateOAuthScopeProfile(scopeProfileId: string, input: OAuthResourceRecord) {
  return oauthScopeProfiles().update(scopeProfileId, input);
}

export async function listOAuthClaimMappings(params?: OAuthListParams) {
  return oauthClaimMappings().list(params);
}

export async function createOAuthClaimMapping(input: OAuthResourceRecord) {
  return oauthClaimMappings().create(input);
}

export async function updateOAuthClaimMapping(mappingId: string, input: OAuthResourceRecord) {
  return oauthClaimMappings().update(mappingId, input);
}

export async function listOAuthPolicies(params?: OAuthListParams) {
  return oauthPolicies().list(params);
}

export async function createOAuthPolicy(input: OAuthResourceRecord) {
  return oauthPolicies().create(input);
}

export async function updateOAuthPolicy(policyId: string, input: OAuthResourceRecord) {
  return oauthPolicies().update(policyId, input);
}

export async function listOAuthTenantBindings(params?: OAuthListParams) {
  return oauthTenantBindings().list(params);
}

export async function createOAuthTenantBinding(input: OAuthResourceRecord) {
  return oauthTenantBindings().create(input);
}

export async function updateOAuthTenantBinding(bindingId: string, input: OAuthResourceRecord) {
  return oauthTenantBindings().update(bindingId, input);
}

export async function listOAuthOperatorPlatforms(params?: OAuthListParams) {
  return oauthOperatorPlatforms().list(params);
}

export async function createOAuthOperatorPlatform(input: OAuthResourceRecord) {
  return oauthOperatorPlatforms().create(input);
}

export async function createOAuthOperatorPreAuthorization(operatorPlatformId: string, input: OAuthResourceRecord) {
  const resource = oauthOperatorPlatforms().preAuthorizations;
  if (!resource) {
    throw createOAuthSdkResourceUnavailableError('operatorPlatforms.preAuthorizations');
  }
  return resource.create(operatorPlatformId, input);
}

export async function listOAuthResourceAccounts(params?: OAuthListParams) {
  return oauthResourceAccounts().list(params);
}

export async function createOAuthResourceAccount(input: OAuthResourceRecord) {
  return oauthResourceAccounts().create(input);
}

export async function updateOAuthResourceAccount(resourceAccountId: string, input: OAuthResourceRecord) {
  return oauthResourceAccounts().update(resourceAccountId, input);
}

export async function verifyOAuthResourceAccount(resourceAccountId: string, input: OAuthResourceRecord = {}) {
  const resource = oauthResourceAccounts().verifications;
  if (!resource) {
    throw createOAuthSdkResourceUnavailableError('resourceAccounts.verifications');
  }
  return resource.create(resourceAccountId, input);
}

export async function checkOAuthMiniProgramLogin(resourceAccountId: string, input: OAuthResourceRecord = {}) {
  const resource = oauthResourceAccounts().miniProgramLoginChecks;
  if (!resource) {
    throw createOAuthSdkResourceUnavailableError('resourceAccounts.miniProgramLoginChecks');
  }
  return resource.create(resourceAccountId, input);
}

export async function refreshOAuthResourceAuthorization(resourceAccountId: string, input: OAuthResourceRecord = {}) {
  const resource = oauthResourceAccounts().authorizationRefreshes;
  if (!resource) {
    throw createOAuthSdkResourceUnavailableError('resourceAccounts.authorizationRefreshes');
  }
  return resource.create(resourceAccountId, input);
}

export async function listOAuthResourceAuthorizations(params?: OAuthListParams) {
  return oauthResourceAuthorizations().list(params);
}

export async function createOAuthResourceAuthorization(input: OAuthResourceRecord) {
  return oauthResourceAuthorizations().create(input);
}

export async function updateOAuthResourceAuthorization(authorizationId: string, input: OAuthResourceRecord) {
  return oauthResourceAuthorizations().update(authorizationId, input);
}

export async function listOAuthWebhooks(params?: OAuthListParams) {
  return oauthWebhookResource().list(params);
}

export async function createOAuthWebhook(input: OAuthResourceRecord) {
  return oauthWebhookResource().create(input);
}

export async function updateOAuthWebhook(webhookConfigId: string, input: OAuthResourceRecord) {
  return oauthWebhookResource().update(webhookConfigId, input);
}

export async function verifyOAuthWebhook(webhookConfigId: string, input: OAuthResourceRecord = {}) {
  const resource = oauthWebhookResource().verifications;
  if (!resource) {
    throw createOAuthSdkResourceUnavailableError('webhookConfigs.verifications');
  }
  return resource.create(webhookConfigId, input);
}

export async function listOAuthOperationalResources(params?: OAuthListParams) {
  return oauthOperationalResources().list(params);
}

export async function createOAuthOperationalResource(input: OAuthResourceRecord) {
  return oauthOperationalResources().create(input);
}

export async function updateOAuthOperationalResource(resourceId: string, input: OAuthResourceRecord) {
  return oauthOperationalResources().update(resourceId, input);
}

export async function deleteOAuthOperationalResource(resourceId: string) {
  return oauthOperationalResources().delete(resourceId);
}

export async function publishOAuthOperationalResource(resourceId: string, input: OAuthResourceRecord = {}) {
  const resource = oauthOperationalResources().publishes;
  if (!resource) {
    throw createOAuthSdkResourceUnavailableError('operationalResources.publishes');
  }
  return resource.create(resourceId, input);
}

export async function listOAuthAccountLinks(params?: OAuthListParams) {
  return oauthAccountLinks().list(params);
}

export async function updateOAuthAccountLink(accountLinkId: string, input: OAuthResourceRecord) {
  return oauthAccountLinks().update(accountLinkId, input);
}

export async function listOAuthGrants(params?: OAuthListParams) {
  return oauthGrants().list(params);
}

export async function deleteOAuthGrant(grantId: string) {
  return oauthGrants().delete(grantId);
}

export async function listOAuthCallbackEvents(params?: OAuthListParams) {
  return oauthCallbackEvents().list(params);
}

export async function listOAuthDiagnosticRuns(params?: OAuthListParams) {
  return oauthDiagnosticRuns().list(params);
}

export async function createOAuthDiagnosticRun(input: OAuthResourceRecord) {
  return oauthDiagnosticRuns().create(input);
}

function oauthClient(): OAuthResources {
  return resolveOAuthResourceTree();
}

function resolveOAuthResourceTree(): OAuthResources {
  const client = getSdkworkAppbaseBackendSdkClient() as unknown as OAuthClient;
  const oauth = client.iam?.oauth ?? client.iamOauth?.iam?.oauth;
  if (!oauth) {
    throw createOAuthSdkResourceUnavailableError('iam.oauth');
  }
  return oauth;
}

function oauthResource<TKey extends keyof OAuthResources>(resourceName: TKey): NonNullable<OAuthResources[TKey]> {
  return assertOAuthListResource(resourceName, resolveOAuthResource(resourceName));
}

function resolveOAuthResource<TKey extends keyof OAuthResources>(resourceName: TKey): NonNullable<OAuthResources[TKey]> {
  const resource = resolveOAuthResourceTree()[resourceName];
  if (!resource) {
    throw createOAuthSdkResourceUnavailableError(String(resourceName));
  }
  return resource;
}

function assertOAuthListResource<TKey extends keyof OAuthResources>(
  resourceName: TKey,
  resource: NonNullable<OAuthResources[TKey]>,
): NonNullable<OAuthResources[TKey]> {
  if (typeof (resource as OAuthListResource).list !== 'function') {
    throw createOAuthSdkResourceUnavailableError(`${String(resourceName)}.list`);
  }
  return resource;
}

function oauthProviderCatalog() {
  return oauthResource('providerCatalog');
}

function oauthIntegrations() {
  return oauthResource('integrations');
}

function oauthClients() {
  return oauthResource('clients');
}

function oauthSecrets() {
  return oauthResource('secrets');
}

function oauthSurfaces() {
  return oauthResource('surfaces');
}

function oauthFlowConfigs() {
  return oauthResource('flowConfigs');
}

function oauthScopeProfiles() {
  return oauthResource('scopeProfiles');
}

function oauthClaimMappings() {
  return oauthResource('claimMappings');
}

function oauthPolicies() {
  return oauthResource('policies');
}

function oauthTenantBindings() {
  return oauthResource('tenantBindings');
}

function oauthOperatorPlatforms() {
  return oauthResource('operatorPlatforms');
}

function oauthResourceAccounts() {
  return oauthResource('resourceAccounts');
}

function oauthResourceAuthorizations() {
  return oauthResource('resourceAuthorizations');
}

function oauthOperationalResources() {
  return oauthResource('operationalResources');
}

function oauthAccountLinks() {
  return oauthResource('accountLinks');
}

function oauthGrants() {
  return oauthResource('grants');
}

function oauthCallbackEvents() {
  return oauthResource('callbackEvents');
}

function oauthDiagnosticRuns() {
  return oauthResource('diagnosticRuns');
}

function oauthWebhookResource(): OAuthWebhookConfigResource {
  const client = oauthClient();
  const resource = client.webhookConfigs ?? client.webhooks;
  if (!resource) {
    throw createOAuthSdkResourceUnavailableError('webhookConfigs');
  }
  return resource;
}

function createOAuthSdkResourceUnavailableError(resourceName: string): Error {
  return new Error(`${OAUTH_SDK_RESOURCE_UNAVAILABLE_ERROR}:${resourceName}`);
}
