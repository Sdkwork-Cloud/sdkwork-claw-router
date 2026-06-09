import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  BadgeCheck,
  Blocks,
  Cable,
  CheckCircle2,
  ClipboardList,
  Cpu,
  FileKey2,
  Fingerprint,
  Globe2,
  KeyRound,
  Layers,
  Link2,
  ListChecks,
  LockKeyhole,
  type LucideIcon,
  MessageCircle,
  MonitorSmartphone,
  Network,
  Phone,
  Plug,
  Radio,
  RefreshCw,
  Route,
  Rows3,
  ScanLine,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Store,
  UserRoundCog,
  Users,
  Webhook,
} from 'lucide-react';
import { AdminResourceCenter, type AdminResourceSection } from 'sdkwork-clawrouter-pc-commons';
import {
  DEFAULT_OAUTH_PAGE_PARAMS,
  OAUTH_SDK_RESOURCE_UNAVAILABLE_ERROR,
  listOAuthAccountLinks,
  listOAuthCallbackEvents,
  listOAuthClaimMappings,
  listOAuthClients,
  listOAuthDiagnosticRuns,
  listOAuthFlowConfigs,
  listOAuthGrants,
  listOAuthIntegrations,
  listOAuthOperationalResources,
  listOAuthOperatorPlatforms,
  listOAuthPolicies,
  listOAuthProviderCatalog,
  listOAuthResourceAccounts,
  listOAuthResourceAuthorizations,
  listOAuthScopeProfiles,
  listOAuthSecrets,
  listOAuthSurfaces,
  listOAuthTenantBindings,
  listOAuthWebhooks,
  type OAuthListParams,
} from './oauthAdminService';

export type OAuthAdminSectionId =
  | 'accountLinks'
  | 'callbackDiagnostics'
  | 'claimMappings'
  | 'clients'
  | 'diagnosticRuns'
  | 'flowConfigs'
  | 'grants'
  | 'integrations'
  | 'login'
  | 'miniProgramLogin'
  | 'miniPrograms'
  | 'officialAccounts'
  | 'operationalResources'
  | 'operatorPlatforms'
  | 'overview'
  | 'policies'
  | 'providerCatalog'
  | 'resourceAccounts'
  | 'resourceAuthorizations'
  | 'scopeProfiles'
  | 'secrets'
  | 'surfaces'
  | 'tenantBindings'
  | 'webhooks';

type OAuthAdminResourceSectionId = Exclude<OAuthAdminSectionId, 'login' | 'miniProgramLogin' | 'overview'>;

type OAuthAdminRouteProps = {
  sectionId?: string;
};

type OAuthAdminNavItem = {
  id: OAuthAdminSectionId;
  label: string;
  route: string;
  icon: LucideIcon;
};

type OAuthAdminNavGroup = {
  label: string;
  items: OAuthAdminNavItem[];
};

type OAuthPlatformBlueprint = {
  provider: string;
  region: string;
  family: string;
  authorization: string;
  surfaces: string;
  credentialModel: string;
  resourceAccess: string;
};

type OAuthSurfaceBlueprint = {
  surface: string;
  entry: string;
  callback: string;
  clientIdentity: string;
  riskControls: string;
};

type OAuthSchemaArea = {
  area: string;
  tables: string;
  ownership: string;
};

const OAUTH_ADMIN_ROUTES = {
  overview: '/admin/oauth/overview',
  login: '/admin/oauth/login',
  miniProgramLogin: '/admin/oauth/login/mini-programs',
  providerCatalog: '/admin/oauth/provider-catalog',
  integrations: '/admin/oauth/integrations',
  clients: '/admin/oauth/clients',
  secrets: '/admin/oauth/secrets',
  surfaces: '/admin/oauth/surfaces',
  flowConfigs: '/admin/oauth/flow-configs',
  scopeProfiles: '/admin/oauth/scope-profiles',
  claimMappings: '/admin/oauth/claim-mappings',
  policies: '/admin/oauth/policies',
  tenantBindings: '/admin/oauth/tenant-bindings',
  operatorPlatforms: '/admin/oauth/operator-platforms',
  resourceAccounts: '/admin/oauth/resource-accounts',
  officialAccounts: '/admin/oauth/resource-accounts/official-accounts',
  miniPrograms: '/admin/oauth/resource-accounts/mini-programs',
  resourceAuthorizations: '/admin/oauth/resource-authorizations',
  webhooks: '/admin/oauth/webhooks',
  operationalResources: '/admin/oauth/operational-resources',
  accountLinks: '/admin/oauth/account-links',
  grants: '/admin/oauth/grants',
  callbackDiagnostics: '/admin/oauth/callback-diagnostics',
  diagnosticRuns: '/admin/oauth/diagnostic-runs',
} as const satisfies Record<OAuthAdminSectionId, string>;

const DEFAULT_SECTION_ID: OAuthAdminSectionId = 'overview';

const RESOURCE_SECTION_IDS = [
  'accountLinks',
  'callbackDiagnostics',
  'claimMappings',
  'clients',
  'diagnosticRuns',
  'flowConfigs',
  'grants',
  'integrations',
  'miniPrograms',
  'officialAccounts',
  'operationalResources',
  'operatorPlatforms',
  'policies',
  'providerCatalog',
  'resourceAccounts',
  'resourceAuthorizations',
  'scopeProfiles',
  'secrets',
  'surfaces',
  'tenantBindings',
  'webhooks',
] as const satisfies readonly OAuthAdminResourceSectionId[];

const OAUTH_PLATFORM_BLUEPRINTS: OAuthPlatformBlueprint[] = [
  {
    provider: 'admin.oauth.blueprints.platform.wechatOfficialAccount.provider',
    region: 'admin.oauth.blueprints.platform.wechatOfficialAccount.region',
    family: 'admin.oauth.blueprints.platform.wechatOfficialAccount.family',
    authorization: 'admin.oauth.blueprints.platform.wechatOfficialAccount.authorization',
    surfaces: 'admin.oauth.blueprints.platform.wechatOfficialAccount.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.wechatOfficialAccount.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.wechatOfficialAccount.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.wechatMiniProgram.provider',
    region: 'admin.oauth.blueprints.platform.wechatMiniProgram.region',
    family: 'admin.oauth.blueprints.platform.wechatMiniProgram.family',
    authorization: 'admin.oauth.blueprints.platform.wechatMiniProgram.authorization',
    surfaces: 'admin.oauth.blueprints.platform.wechatMiniProgram.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.wechatMiniProgram.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.wechatMiniProgram.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.alipayMiniProgram.provider',
    region: 'admin.oauth.blueprints.platform.alipayMiniProgram.region',
    family: 'admin.oauth.blueprints.platform.alipayMiniProgram.family',
    authorization: 'admin.oauth.blueprints.platform.alipayMiniProgram.authorization',
    surfaces: 'admin.oauth.blueprints.platform.alipayMiniProgram.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.alipayMiniProgram.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.alipayMiniProgram.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.dingtalk.provider',
    region: 'admin.oauth.blueprints.platform.dingtalk.region',
    family: 'admin.oauth.blueprints.platform.dingtalk.family',
    authorization: 'admin.oauth.blueprints.platform.dingtalk.authorization',
    surfaces: 'admin.oauth.blueprints.platform.dingtalk.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.dingtalk.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.dingtalk.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.larkFeishu.provider',
    region: 'admin.oauth.blueprints.platform.larkFeishu.region',
    family: 'admin.oauth.blueprints.platform.larkFeishu.family',
    authorization: 'admin.oauth.blueprints.platform.larkFeishu.authorization',
    surfaces: 'admin.oauth.blueprints.platform.larkFeishu.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.larkFeishu.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.larkFeishu.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.github.provider',
    region: 'admin.oauth.blueprints.platform.github.region',
    family: 'admin.oauth.blueprints.platform.github.family',
    authorization: 'admin.oauth.blueprints.platform.github.authorization',
    surfaces: 'admin.oauth.blueprints.platform.github.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.github.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.github.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.google.provider',
    region: 'admin.oauth.blueprints.platform.google.region',
    family: 'admin.oauth.blueprints.platform.google.family',
    authorization: 'admin.oauth.blueprints.platform.google.authorization',
    surfaces: 'admin.oauth.blueprints.platform.google.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.google.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.google.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.apple.provider',
    region: 'admin.oauth.blueprints.platform.apple.region',
    family: 'admin.oauth.blueprints.platform.apple.family',
    authorization: 'admin.oauth.blueprints.platform.apple.authorization',
    surfaces: 'admin.oauth.blueprints.platform.apple.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.apple.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.apple.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.microsoftEntraId.provider',
    region: 'admin.oauth.blueprints.platform.microsoftEntraId.region',
    family: 'admin.oauth.blueprints.platform.microsoftEntraId.family',
    authorization: 'admin.oauth.blueprints.platform.microsoftEntraId.authorization',
    surfaces: 'admin.oauth.blueprints.platform.microsoftEntraId.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.microsoftEntraId.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.microsoftEntraId.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.facebook.provider',
    region: 'admin.oauth.blueprints.platform.facebook.region',
    family: 'admin.oauth.blueprints.platform.facebook.family',
    authorization: 'admin.oauth.blueprints.platform.facebook.authorization',
    surfaces: 'admin.oauth.blueprints.platform.facebook.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.facebook.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.facebook.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.line.provider',
    region: 'admin.oauth.blueprints.platform.line.region',
    family: 'admin.oauth.blueprints.platform.line.family',
    authorization: 'admin.oauth.blueprints.platform.line.authorization',
    surfaces: 'admin.oauth.blueprints.platform.line.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.line.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.line.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.kakao.provider',
    region: 'admin.oauth.blueprints.platform.kakao.region',
    family: 'admin.oauth.blueprints.platform.kakao.family',
    authorization: 'admin.oauth.blueprints.platform.kakao.authorization',
    surfaces: 'admin.oauth.blueprints.platform.kakao.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.kakao.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.kakao.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.slack.provider',
    region: 'admin.oauth.blueprints.platform.slack.region',
    family: 'admin.oauth.blueprints.platform.slack.family',
    authorization: 'admin.oauth.blueprints.platform.slack.authorization',
    surfaces: 'admin.oauth.blueprints.platform.slack.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.slack.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.slack.resourceAccess',
  },
  {
    provider: 'admin.oauth.blueprints.platform.enterpriseOidc.provider',
    region: 'admin.oauth.blueprints.platform.enterpriseOidc.region',
    family: 'admin.oauth.blueprints.platform.enterpriseOidc.family',
    authorization: 'admin.oauth.blueprints.platform.enterpriseOidc.authorization',
    surfaces: 'admin.oauth.blueprints.platform.enterpriseOidc.surfaces',
    credentialModel: 'admin.oauth.blueprints.platform.enterpriseOidc.credentialModel',
    resourceAccess: 'admin.oauth.blueprints.platform.enterpriseOidc.resourceAccess',
  },
];

const OAUTH_SURFACE_BLUEPRINTS: OAuthSurfaceBlueprint[] = [
  {
    surface: 'admin.oauth.blueprints.surface.pcWeb.surface',
    entry: 'admin.oauth.blueprints.surface.pcWeb.entry',
    callback: 'admin.oauth.blueprints.surface.pcWeb.callback',
    clientIdentity: 'admin.oauth.blueprints.surface.pcWeb.clientIdentity',
    riskControls: 'admin.oauth.blueprints.surface.pcWeb.riskControls',
  },
  {
    surface: 'admin.oauth.blueprints.surface.mobileWeb.surface',
    entry: 'admin.oauth.blueprints.surface.mobileWeb.entry',
    callback: 'admin.oauth.blueprints.surface.mobileWeb.callback',
    clientIdentity: 'admin.oauth.blueprints.surface.mobileWeb.clientIdentity',
    riskControls: 'admin.oauth.blueprints.surface.mobileWeb.riskControls',
  },
  {
    surface: 'admin.oauth.blueprints.surface.nativeApp.surface',
    entry: 'admin.oauth.blueprints.surface.nativeApp.entry',
    callback: 'admin.oauth.blueprints.surface.nativeApp.callback',
    clientIdentity: 'admin.oauth.blueprints.surface.nativeApp.clientIdentity',
    riskControls: 'admin.oauth.blueprints.surface.nativeApp.riskControls',
  },
  {
    surface: 'admin.oauth.blueprints.surface.miniProgram.surface',
    entry: 'admin.oauth.blueprints.surface.miniProgram.entry',
    callback: 'admin.oauth.blueprints.surface.miniProgram.callback',
    clientIdentity: 'admin.oauth.blueprints.surface.miniProgram.clientIdentity',
    riskControls: 'admin.oauth.blueprints.surface.miniProgram.riskControls',
  },
  {
    surface: 'admin.oauth.blueprints.surface.officialAccount.surface',
    entry: 'admin.oauth.blueprints.surface.officialAccount.entry',
    callback: 'admin.oauth.blueprints.surface.officialAccount.callback',
    clientIdentity: 'admin.oauth.blueprints.surface.officialAccount.clientIdentity',
    riskControls: 'admin.oauth.blueprints.surface.officialAccount.riskControls',
  },
];

const OAUTH_SCHEMA_AREAS: OAuthSchemaArea[] = [
  {
    area: 'admin.oauth.schema.providerCatalog.area',
    tables: 'admin.oauth.schema.providerCatalog.tables',
    ownership: 'admin.oauth.schema.providerCatalog.ownership',
  },
  {
    area: 'admin.oauth.schema.identityBinding.area',
    tables: 'admin.oauth.schema.identityBinding.tables',
    ownership: 'admin.oauth.schema.identityBinding.ownership',
  },
  {
    area: 'admin.oauth.schema.operatedResources.area',
    tables: 'admin.oauth.schema.operatedResources.tables',
    ownership: 'admin.oauth.schema.operatedResources.ownership',
  },
  {
    area: 'admin.oauth.schema.callbacksDiagnostics.area',
    tables: 'admin.oauth.schema.callbacksDiagnostics.tables',
    ownership: 'admin.oauth.schema.callbacksDiagnostics.ownership',
  },
];

export function OAuthAdmin({ sectionId }: OAuthAdminRouteProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const activeSectionId = resolveOAuthSectionId(sectionId);
  const navGroups = useMemo(() => createOAuthNavGroups(t), [t]);
  const resourceSections = useMemo(() => createOAuthResourceSections(t), [t]);

  return (
    <section
      className="flex h-full min-h-0 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#161616]"
      data-admin-oauth
      data-admin-oauth-route={location.pathname}
      data-admin-oauth-section={activeSectionId}
    >
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-[#0a0a0a]">
        <OAuthAdminHeader activeSectionId={activeSectionId} navGroups={navGroups} />
        <div className="min-h-0 flex-1 overflow-auto p-4 custom-scrollbar">
          {activeSectionId === 'overview' ? (
            <OAuthOverview />
          ) : activeSectionId === 'login' ? (
            <OAuthLoginWorkspace resourceSections={resourceSections} />
          ) : activeSectionId === 'miniProgramLogin' ? (
            <OAuthMiniProgramWorkspace resourceSections={resourceSections} />
          ) : (
            <OAuthResourceWorkspace activeSectionId={activeSectionId} resourceSections={resourceSections} />
          )}
        </div>
      </main>
    </section>
  );
}

export default OAuthAdmin;

function OAuthAdminHeader({
  activeSectionId,
  navGroups,
}: {
  activeSectionId: OAuthAdminSectionId;
  navGroups: OAuthAdminNavGroup[];
}) {
  const { t } = useTranslation();
  const item = navGroups.flatMap((group) => group.items).find((candidate) => candidate.id === activeSectionId);
  const Icon = item?.icon ?? KeyRound;
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#161616]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-950 dark:text-white">{item?.label ?? t('admin.oauth.header.fallbackTitle', 'OAuth')}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{item?.route ?? OAUTH_ADMIN_ROUTES.overview}</div>
        </div>
      </div>
      <div className="hidden items-center gap-2 text-xs text-slate-500 dark:text-slate-400 md:flex">
        <span className="rounded-md border border-slate-200 px-2 py-1 dark:border-white/10">{t('admin.oauth.header.badges.appbaseIam', 'appbase IAM')}</span>
        <span className="rounded-md border border-slate-200 px-2 py-1 dark:border-white/10">{t('admin.oauth.header.badges.backendAdmin', 'backend-admin')}</span>
      </div>
    </header>
  );
}

function OAuthOverview() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-4">
        <OAuthMetricCard icon={Globe2} label={t('admin.oauth.overview.metrics.providerFamilies', 'Provider families')} value="14+" />
        <OAuthMetricCard icon={MonitorSmartphone} label={t('admin.oauth.overview.metrics.runtimeSurfaces', 'Runtime surfaces')} value="5" />
        <OAuthMetricCard icon={Store} label={t('admin.oauth.overview.metrics.accountOwnerModes', 'Account owner modes')} value="2" />
        <OAuthMetricCard icon={ShieldCheck} label={t('admin.oauth.overview.metrics.iamTables', 'IAM tables')} value="20" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <OAuthPanel title={t('admin.oauth.overview.panels.providerCoverage', 'Provider Coverage')} icon={Plug}>
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
            <table className="w-full min-w-[1120px] text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">{t('admin.oauth.overview.providerColumns.provider', 'Provider')}</th>
                  <th className="px-4 py-3">{t('admin.oauth.overview.providerColumns.region', 'Region')}</th>
                  <th className="px-4 py-3">{t('admin.oauth.overview.providerColumns.family', 'Family')}</th>
                  <th className="px-4 py-3">{t('admin.oauth.overview.providerColumns.authorization', 'Authorization')}</th>
                  <th className="px-4 py-3">{t('admin.oauth.overview.providerColumns.surfaces', 'Surfaces')}</th>
                  <th className="px-4 py-3">{t('admin.oauth.overview.providerColumns.credentialModel', 'Credential Model')}</th>
                  <th className="px-4 py-3">{t('admin.oauth.overview.providerColumns.resourceAccess', 'Resource Access')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {OAUTH_PLATFORM_BLUEPRINTS.map((platform) => (
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/5" key={platform.provider}>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900 dark:text-white">{t(platform.provider)}</td>
                    <td className="whitespace-nowrap px-4 py-3">{t(platform.region)}</td>
                    <td className="whitespace-nowrap px-4 py-3">{t(platform.family)}</td>
                    <td className="px-4 py-3">{t(platform.authorization)}</td>
                    <td className="px-4 py-3">{t(platform.surfaces)}</td>
                    <td className="px-4 py-3">{t(platform.credentialModel)}</td>
                    <td className="px-4 py-3">{t(platform.resourceAccess)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </OAuthPanel>

        <OAuthPanel title={t('admin.oauth.overview.panels.schemaAreas', 'Schema Areas')} icon={Rows3}>
          <div className="grid gap-3">
            {OAUTH_SCHEMA_AREAS.map((area) => (
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#121212]" key={area.area}>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{t(area.area)}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t(area.tables)}</div>
                <div className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{t(area.ownership)}</div>
              </div>
            ))}
          </div>
        </OAuthPanel>
      </div>

      <OAuthPanel title={t('admin.oauth.overview.panels.surfaceDifferences', 'Surface Differences')} icon={MonitorSmartphone}>
        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
          <table className="w-full min-w-[1080px] text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">{t('admin.oauth.overview.surfaceColumns.surface', 'Surface')}</th>
                <th className="px-4 py-3">{t('admin.oauth.overview.surfaceColumns.entry', 'Entry')}</th>
                <th className="px-4 py-3">{t('admin.oauth.overview.surfaceColumns.callback', 'Callback')}</th>
                <th className="px-4 py-3">{t('admin.oauth.overview.surfaceColumns.clientIdentity', 'Client Identity')}</th>
                <th className="px-4 py-3">{t('admin.oauth.overview.surfaceColumns.riskControls', 'Risk Controls')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {OAUTH_SURFACE_BLUEPRINTS.map((surface) => (
                <tr className="hover:bg-slate-50 dark:hover:bg-white/5" key={surface.surface}>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900 dark:text-white">{t(surface.surface)}</td>
                  <td className="px-4 py-3">{t(surface.entry)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{t(surface.callback)}</td>
                  <td className="px-4 py-3">{t(surface.clientIdentity)}</td>
                  <td className="px-4 py-3">{t(surface.riskControls)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OAuthPanel>
    </div>
  );
}

function OAuthLoginWorkspace({ resourceSections }: { resourceSections: OAuthResourceSection[] }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="grid gap-3 lg:grid-cols-3">
        <OAuthFlowCard icon={Route} title={t('admin.oauth.login.cards.authorizationUrl', 'Authorization URL')} fields={['providerCode', 'surface', 'redirectUri', 'state', 'nonce', 'pkceChallenge']} />
        <OAuthFlowCard icon={Fingerprint} title={t('admin.oauth.login.cards.sessionExchange', 'Session Exchange')} fields={['authorizationCode', 'stateVerifier', 'tenantBinding', 'claimMapping', 'accountLinkPolicy']} />
        <OAuthFlowCard icon={ShieldCheck} title={t('admin.oauth.login.cards.grantGovernance', 'Grant Governance')} fields={['scopeProfile', 'grantStatus', 'expiresAt', 'revocationPolicy', 'auditEvent']} />
      </div>
      <OAuthResourceWorkspace activeSectionId="flowConfigs" resourceSections={resourceSections} />
    </div>
  );
}

function OAuthMiniProgramWorkspace({ resourceSections }: { resourceSections: OAuthResourceSection[] }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="grid gap-3 lg:grid-cols-3">
        <OAuthFlowCard icon={Smartphone} title={t('admin.oauth.miniProgram.cards.session', 'Mini Program Session')} fields={['providerCode', 'appId', 'loginCode', 'anonymousCode', 'sessionPolicy']} />
        <OAuthFlowCard icon={Phone} title={t('admin.oauth.miniProgram.cards.phoneConsent', 'Phone Consent')} fields={['encryptedDataRef', 'ivRef', 'consentScope', 'claimMapping', 'retentionPolicy']} />
        <OAuthFlowCard icon={ScanLine} title={t('admin.oauth.miniProgram.cards.resourceCheck', 'Resource Check')} fields={['resourceAccountId', 'operatorPlatformId', 'ownerMode', 'codeExchangeStatus', 'diagnosticRun']} />
      </div>
      <OAuthResourceWorkspace activeSectionId="miniPrograms" resourceSections={resourceSections} />
    </div>
  );
}

type OAuthResourceSection = AdminResourceSection<OAuthAdminResourceSectionId, string>;

function OAuthResourceWorkspace({
  activeSectionId,
  resourceSections,
}: {
  activeSectionId: OAuthAdminResourceSectionId;
  resourceSections: OAuthResourceSection[];
}) {
  const { t } = useTranslation();
  return (
    <div className="min-h-[520px]">
      <AdminResourceCenter
        activeSectionId={activeSectionId}
        emptyDescription={t('admin.oauth.resourceCenter.emptyDescription', 'No records returned by the appbase IAM OAuth backend resource.')}
        emptyTitle={t('admin.oauth.resourceCenter.emptyTitle', 'No OAuth records')}
        errorTitle={t('admin.oauth.resourceCenter.errorTitle', 'OAuth resource could not be loaded')}
        loadingTitle={t('admin.oauth.resourceCenter.loadingTitle', 'Loading OAuth resource...')}
        paginationNextLabel={t('common.actions.nextPage', 'Next page')}
        paginationPageLabel={t('admin.oauth.resourceCenter.paginationPage', 'Page')}
        paginationPageSizeLabel={t('admin.oauth.resourceCenter.paginationRows', 'Rows')}
        paginationPreviousLabel={t('common.actions.previousPage', 'Previous page')}
        paginationShowingLabel={t('admin.oauth.resourceCenter.paginationShowing', 'Showing')}
        reloadLabel={t('common.actions.reload', 'Reload')}
        searchPlaceholder={t('admin.oauth.resourceCenter.searchPlaceholder', 'Search OAuth records')}
        sections={resourceSections}
        showSectionNavigation={false}
        tableViewportDataAttribute="admin-oauth-resource-viewport"
      />
    </div>
  );
}

function OAuthMetricCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#161616]">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">{label}</div>
        <Icon className="h-4 w-4 text-blue-500" />
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{value}</div>
    </div>
  );
}

function OAuthPanel({ children, icon: Icon, title }: { children: React.ReactNode; icon: LucideIcon; title: string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#161616]">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
        <Icon className="h-4 w-4 text-blue-500" />
        {title}
      </div>
      {children}
    </section>
  );
}

function OAuthFlowCard({ fields, icon: Icon, title }: { fields: string[]; icon: LucideIcon; title: string }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#161616]">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
        <Icon className="h-4 w-4 text-blue-500" />
        {title}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {fields.map((field) => (
          <span
            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            key={field}
          >
            {t(`admin.oauth.fields.${field}`, humanizeFieldName(field))}
          </span>
        ))}
      </div>
    </div>
  );
}

function createOAuthNavGroups(t: ReturnType<typeof useTranslation>['t']): OAuthAdminNavGroup[] {
  return [
    {
      label: t('admin.oauth.nav.workspace', 'Workspace'),
      items: [
        navItem('overview', t('admin.oauth.nav.overview', 'Overview'), OAUTH_ADMIN_ROUTES.overview, Layers),
        navItem('login', t('admin.oauth.nav.login', 'Login'), OAUTH_ADMIN_ROUTES.login, Fingerprint),
        navItem('miniProgramLogin', t('admin.oauth.nav.miniProgramLogin', 'Mini Program Login'), OAUTH_ADMIN_ROUTES.miniProgramLogin, Smartphone),
      ],
    },
    {
      label: t('admin.oauth.nav.configuration', 'Configuration'),
      items: [
        navItem('providerCatalog', t('admin.oauth.nav.providerCatalog', 'Provider Catalog'), OAUTH_ADMIN_ROUTES.providerCatalog, Globe2),
        navItem('integrations', t('admin.oauth.nav.integrations', 'Integrations'), OAUTH_ADMIN_ROUTES.integrations, Plug),
        navItem('clients', t('admin.oauth.nav.clients', 'Clients'), OAUTH_ADMIN_ROUTES.clients, KeyRound),
        navItem('secrets', t('admin.oauth.nav.secrets', 'Secrets'), OAUTH_ADMIN_ROUTES.secrets, LockKeyhole),
        navItem('surfaces', t('admin.oauth.nav.surfaces', 'Surfaces'), OAUTH_ADMIN_ROUTES.surfaces, MonitorSmartphone),
        navItem('flowConfigs', t('admin.oauth.nav.flowConfigs', 'Flow Configs'), OAUTH_ADMIN_ROUTES.flowConfigs, SlidersHorizontal),
        navItem('scopeProfiles', t('admin.oauth.nav.scopeProfiles', 'Scope Profiles'), OAUTH_ADMIN_ROUTES.scopeProfiles, ListChecks),
        navItem('claimMappings', t('admin.oauth.nav.claimMappings', 'Claim Mappings'), OAUTH_ADMIN_ROUTES.claimMappings, Fingerprint),
        navItem('policies', t('admin.oauth.nav.policies', 'Policies'), OAUTH_ADMIN_ROUTES.policies, ShieldCheck),
        navItem('tenantBindings', t('admin.oauth.nav.tenantBindings', 'Tenant Bindings'), OAUTH_ADMIN_ROUTES.tenantBindings, Blocks),
      ],
    },
    {
      label: t('admin.oauth.nav.resourceAccess', 'Resource Access'),
      items: [
        navItem('operatorPlatforms', t('admin.oauth.nav.operatorPlatforms', 'Operator Platforms'), OAUTH_ADMIN_ROUTES.operatorPlatforms, Store),
        navItem('resourceAccounts', t('admin.oauth.nav.resourceAccounts', 'Resource Accounts'), OAUTH_ADMIN_ROUTES.resourceAccounts, UserRoundCog),
        navItem('officialAccounts', t('admin.oauth.nav.officialAccounts', 'Official Accounts'), OAUTH_ADMIN_ROUTES.officialAccounts, MessageCircle),
        navItem('miniPrograms', t('admin.oauth.nav.miniPrograms', 'Mini Programs'), OAUTH_ADMIN_ROUTES.miniPrograms, Smartphone),
        navItem('resourceAuthorizations', t('admin.oauth.nav.resourceAuthorizations', 'Resource Authorizations'), OAUTH_ADMIN_ROUTES.resourceAuthorizations, BadgeCheck),
        navItem('webhooks', t('admin.oauth.nav.webhooks', 'Webhooks'), OAUTH_ADMIN_ROUTES.webhooks, Webhook),
        navItem('operationalResources', t('admin.oauth.nav.operationalResources', 'Operational Resources'), OAUTH_ADMIN_ROUTES.operationalResources, Cpu),
      ],
    },
    {
      label: t('admin.oauth.nav.identityRuntime', 'Identity Runtime'),
      items: [
        navItem('accountLinks', t('admin.oauth.nav.accountLinks', 'Account Links'), OAUTH_ADMIN_ROUTES.accountLinks, Link2),
        navItem('grants', t('admin.oauth.nav.grants', 'Grants'), OAUTH_ADMIN_ROUTES.grants, FileKey2),
        navItem('callbackDiagnostics', t('admin.oauth.nav.callbackDiagnostics', 'Callback Diagnostics'), OAUTH_ADMIN_ROUTES.callbackDiagnostics, Activity),
        navItem('diagnosticRuns', t('admin.oauth.nav.diagnosticRuns', 'Diagnostic Runs'), OAUTH_ADMIN_ROUTES.diagnosticRuns, RefreshCw),
      ],
    },
  ];
}

function createOAuthResourceSections(t: ReturnType<typeof useTranslation>['t']): OAuthResourceSection[] {
  return [
    resourceSection({
      columns: providerCatalogColumns(t),
      description: t('admin.oauth.resources.providerCatalog.description', 'Provider catalog and platform capabilities.'),
      group: t('admin.oauth.groups.configuration', 'Configuration'),
      icon: <Globe2 className="h-4 w-4" />,
      id: 'providerCatalog',
      load: (params) => loadOAuthResource(t, listOAuthProviderCatalog, toOAuthListParams(params)),
      searchFields: ['providerCode', 'providerName', 'region', 'providerKind', 'status'],
      title: t('admin.oauth.resources.providerCatalog', 'Provider Catalog'),
    }),
    resourceSection({
      columns: standardColumns(t),
      description: t('admin.oauth.resources.integrations.description', 'Enabled provider integrations.'),
      group: t('admin.oauth.groups.configuration', 'Configuration'),
      icon: <Plug className="h-4 w-4" />,
      id: 'integrations',
      load: (params) => loadOAuthResource(t, listOAuthIntegrations, toOAuthListParams(params)),
      searchFields: ['id', 'integrationId', 'providerCode', 'displayName', 'status'],
      title: t('admin.oauth.resources.integrations', 'Integrations'),
    }),
    resourceSection({
      columns: clientColumns(t),
      description: t('admin.oauth.resources.clients.description', 'Provider client metadata for web, mobile, native, and mini-program surfaces.'),
      group: t('admin.oauth.groups.configuration', 'Configuration'),
      icon: <KeyRound className="h-4 w-4" />,
      id: 'clients',
      load: (params) => loadOAuthResource(t, listOAuthClients, toOAuthListParams(params)),
      searchFields: ['id', 'clientId', 'providerCode', 'surface', 'status'],
      title: t('admin.oauth.resources.clients', 'Clients'),
    }),
    resourceSection({
      columns: secretColumns(t),
      description: t('admin.oauth.resources.secrets.description', 'Secret references and rotation state.'),
      group: t('admin.oauth.groups.configuration', 'Configuration'),
      icon: <LockKeyhole className="h-4 w-4" />,
      id: 'secrets',
      load: (params) => loadOAuthResource(t, listOAuthSecrets, toOAuthListParams(params)),
      searchFields: ['id', 'secretId', 'ownerId', 'ownerKind', 'status'],
      title: t('admin.oauth.resources.secrets', 'Secrets'),
    }),
    resourceSection({
      columns: surfaceColumns(t),
      description: t('admin.oauth.resources.surfaces.description', 'Runtime surfaces and callback rules.'),
      group: t('admin.oauth.groups.configuration', 'Configuration'),
      icon: <MonitorSmartphone className="h-4 w-4" />,
      id: 'surfaces',
      load: (params) => loadOAuthResource(t, listOAuthSurfaces, toOAuthListParams(params)),
      searchFields: ['id', 'surface', 'providerCode', 'platform', 'status'],
      title: t('admin.oauth.resources.surfaces', 'Surfaces'),
    }),
    resourceSection({
      columns: flowColumns(t),
      description: t('admin.oauth.resources.flowConfigs.description', 'Authorization, callback, linking, and grant flow settings.'),
      group: t('admin.oauth.groups.configuration', 'Configuration'),
      icon: <SlidersHorizontal className="h-4 w-4" />,
      id: 'flowConfigs',
      load: (params) => loadOAuthResource(t, listOAuthFlowConfigs, toOAuthListParams(params)),
      searchFields: ['id', 'flowConfigId', 'providerCode', 'surface', 'flowType', 'status'],
      title: t('admin.oauth.resources.flowConfigs', 'Flow Configs'),
    }),
    resourceSection({
      columns: scopeColumns(t),
      description: t('admin.oauth.resources.scopeProfiles.description', 'Provider scope bundles and consent profiles.'),
      group: t('admin.oauth.groups.configuration', 'Configuration'),
      icon: <ListChecks className="h-4 w-4" />,
      id: 'scopeProfiles',
      load: (params) => loadOAuthResource(t, listOAuthScopeProfiles, toOAuthListParams(params)),
      searchFields: ['id', 'scopeProfileId', 'providerCode', 'profileCode', 'status'],
      title: t('admin.oauth.resources.scopeProfiles', 'Scope Profiles'),
    }),
    resourceSection({
      columns: mappingColumns(t),
      description: t('admin.oauth.resources.claimMappings.description', 'Provider claim normalization.'),
      group: t('admin.oauth.groups.configuration', 'Configuration'),
      icon: <Fingerprint className="h-4 w-4" />,
      id: 'claimMappings',
      load: (params) => loadOAuthResource(t, listOAuthClaimMappings, toOAuthListParams(params)),
      searchFields: ['id', 'mappingId', 'providerCode', 'claimName', 'targetField', 'status'],
      title: t('admin.oauth.resources.claimMappings', 'Claim Mappings'),
    }),
    resourceSection({
      columns: policyColumns(t),
      description: t('admin.oauth.resources.policies.description', 'Login, linking, grant, and account governance policy.'),
      group: t('admin.oauth.groups.configuration', 'Configuration'),
      icon: <ShieldCheck className="h-4 w-4" />,
      id: 'policies',
      load: (params) => loadOAuthResource(t, listOAuthPolicies, toOAuthListParams(params)),
      searchFields: ['id', 'policyId', 'policyCode', 'providerCode', 'status'],
      title: t('admin.oauth.resources.policies', 'Policies'),
    }),
    resourceSection({
      columns: bindingColumns(t),
      description: t('admin.oauth.resources.tenantBindings.description', 'Tenant and app binding for provider integrations.'),
      group: t('admin.oauth.groups.configuration', 'Configuration'),
      icon: <Blocks className="h-4 w-4" />,
      id: 'tenantBindings',
      load: (params) => loadOAuthResource(t, listOAuthTenantBindings, toOAuthListParams(params)),
      searchFields: ['id', 'bindingId', 'tenantId', 'integrationId', 'status'],
      title: t('admin.oauth.resources.tenantBindings', 'Tenant Bindings'),
    }),
    resourceSection({
      columns: operatorPlatformColumns(t),
      description: t('admin.oauth.resources.operatorPlatforms.description', 'Operator platform connection and provider pre-authorization.'),
      group: t('admin.oauth.groups.resourceAccess', 'Resource Access'),
      icon: <Store className="h-4 w-4" />,
      id: 'operatorPlatforms',
      load: (params) => loadOAuthResource(t, listOAuthOperatorPlatforms, toOAuthListParams(params)),
      searchFields: ['id', 'operatorPlatformId', 'providerCode', 'platformName', 'status'],
      title: t('admin.oauth.resources.operatorPlatforms', 'Operator Platforms'),
    }),
    resourceSection({
      columns: resourceAccountColumns(t),
      description: t('admin.oauth.resources.resourceAccounts.description', 'Provider resource accounts across self-managed and operator-authorized modes.'),
      group: t('admin.oauth.groups.resourceAccess', 'Resource Access'),
      icon: <UserRoundCog className="h-4 w-4" />,
      id: 'resourceAccounts',
      load: (params) => loadOAuthResource(t, listOAuthResourceAccounts, toOAuthListParams(params)),
      searchFields: ['id', 'resourceAccountId', 'providerCode', 'accountName', 'resourceAccountKind', 'ownerMode', 'status'],
      title: t('admin.oauth.resources.resourceAccounts', 'Resource Accounts'),
    }),
    resourceSection({
      columns: resourceAccountColumns(t),
      description: t('admin.oauth.resources.officialAccounts.description', 'Official Account resource credentials and callback binding.'),
      group: t('admin.oauth.groups.resourceAccess', 'Resource Access'),
      icon: <MessageCircle className="h-4 w-4" />,
      id: 'officialAccounts',
      load: (params) => loadOAuthResource(t, listOAuthResourceAccounts, {
        ...toOAuthListParams(params),
        resourceAccountKind: 'official_account',
      }),
      searchFields: ['id', 'resourceAccountId', 'providerCode', 'accountName', 'appId', 'status'],
      title: t('admin.oauth.resources.officialAccounts', 'Official Accounts'),
    }),
    resourceSection({
      columns: resourceAccountColumns(t),
      description: t('admin.oauth.resources.miniPrograms.description', 'Mini Program resource credentials and login checks.'),
      group: t('admin.oauth.groups.resourceAccess', 'Resource Access'),
      icon: <Smartphone className="h-4 w-4" />,
      id: 'miniPrograms',
      load: (params) => loadOAuthResource(t, listOAuthResourceAccounts, {
        ...toOAuthListParams(params),
        resourceAccountKind: 'mini_program',
      }),
      searchFields: ['id', 'resourceAccountId', 'providerCode', 'accountName', 'appId', 'status'],
      title: t('admin.oauth.resources.miniPrograms', 'Mini Programs'),
    }),
    resourceSection({
      columns: authorizationColumns(t),
      description: t('admin.oauth.resources.resourceAuthorizations.description', 'Operator or account resource authorization grants.'),
      group: t('admin.oauth.groups.resourceAccess', 'Resource Access'),
      icon: <BadgeCheck className="h-4 w-4" />,
      id: 'resourceAuthorizations',
      load: (params) => loadOAuthResource(t, listOAuthResourceAuthorizations, toOAuthListParams(params)),
      searchFields: ['id', 'authorizationId', 'resourceAccountId', 'providerCode', 'status'],
      title: t('admin.oauth.resources.resourceAuthorizations', 'Resource Authorizations'),
    }),
    resourceSection({
      columns: webhookColumns(t),
      description: t('admin.oauth.resources.webhooks.description', 'Provider callback and webhook verification configuration.'),
      group: t('admin.oauth.groups.resourceAccess', 'Resource Access'),
      icon: <Webhook className="h-4 w-4" />,
      id: 'webhooks',
      load: (params) => loadOAuthResource(t, listOAuthWebhooks, toOAuthListParams(params)),
      searchFields: ['id', 'webhookConfigId', 'providerCode', 'callbackPublicId', 'status'],
      title: t('admin.oauth.resources.webhooks', 'Webhooks'),
    }),
    resourceSection({
      columns: operationalResourceColumns(t),
      description: t('admin.oauth.resources.operationalResources.description', 'Provider-side operational resources such as menus, app entries, and event subscriptions.'),
      group: t('admin.oauth.groups.resourceAccess', 'Resource Access'),
      icon: <Cpu className="h-4 w-4" />,
      id: 'operationalResources',
      load: (params) => loadOAuthResource(t, listOAuthOperationalResources, toOAuthListParams(params)),
      searchFields: ['id', 'resourceId', 'resourceType', 'providerCode', 'status'],
      title: t('admin.oauth.resources.operationalResources', 'Operational Resources'),
    }),
    resourceSection({
      columns: accountLinkColumns(t),
      description: t('admin.oauth.resources.accountLinks.description', 'User identity links from provider accounts to IAM subjects.'),
      group: t('admin.oauth.groups.identityRuntime', 'Identity Runtime'),
      icon: <Link2 className="h-4 w-4" />,
      id: 'accountLinks',
      load: (params) => loadOAuthResource(t, listOAuthAccountLinks, toOAuthListParams(params)),
      searchFields: ['id', 'accountLinkId', 'subjectId', 'providerCode', 'externalSubjectId', 'status'],
      title: t('admin.oauth.resources.accountLinks', 'Account Links'),
    }),
    resourceSection({
      columns: grantColumns(t),
      description: t('admin.oauth.resources.grants.description', 'Provider grants and revocation state.'),
      group: t('admin.oauth.groups.identityRuntime', 'Identity Runtime'),
      icon: <FileKey2 className="h-4 w-4" />,
      id: 'grants',
      load: (params) => loadOAuthResource(t, listOAuthGrants, toOAuthListParams(params)),
      searchFields: ['id', 'grantId', 'subjectId', 'providerCode', 'scopeProfileId', 'status'],
      title: t('admin.oauth.resources.grants', 'Grants'),
    }),
    resourceSection({
      columns: callbackColumns(t),
      description: t('admin.oauth.resources.callbackDiagnostics.description', 'Provider callback events, verification outcomes, and diagnostics.'),
      group: t('admin.oauth.groups.identityRuntime', 'Identity Runtime'),
      icon: <Activity className="h-4 w-4" />,
      id: 'callbackDiagnostics',
      load: (params) => loadOAuthResource(t, listOAuthCallbackEvents, toOAuthListParams(params)),
      searchFields: ['id', 'callbackEventId', 'providerCode', 'callbackPublicId', 'eventType', 'status'],
      title: t('admin.oauth.resources.callbackDiagnostics', 'Callback Diagnostics'),
    }),
    resourceSection({
      columns: diagnosticColumns(t),
      description: t('admin.oauth.resources.diagnosticRuns.description', 'Operator-triggered OAuth diagnostics.'),
      group: t('admin.oauth.groups.identityRuntime', 'Identity Runtime'),
      icon: <RefreshCw className="h-4 w-4" />,
      id: 'diagnosticRuns',
      load: (params) => loadOAuthResource(t, listOAuthDiagnosticRuns, toOAuthListParams(params)),
      searchFields: ['id', 'diagnosticRunId', 'providerCode', 'targetType', 'status'],
      title: t('admin.oauth.resources.diagnosticRuns', 'Diagnostic Runs'),
    }),
  ];
}

function navItem(id: OAuthAdminSectionId, label: string, route: string, icon: LucideIcon): OAuthAdminNavItem {
  return { id, label, route, icon };
}

function resourceSection(section: OAuthResourceSection): OAuthResourceSection {
  return {
    pagination: {
      initialPageSize: 100,
      pageSizeOptions: [50, 100, 200],
    },
    ...section,
  };
}

function resolveOAuthSectionId(sectionId: string | undefined): OAuthAdminSectionId {
  if (sectionId && allOAuthSectionIds().includes(sectionId as OAuthAdminSectionId)) {
    return sectionId as OAuthAdminSectionId;
  }
  return DEFAULT_SECTION_ID;
}

function allOAuthSectionIds(): readonly OAuthAdminSectionId[] {
  return [
    'overview',
    'login',
    'miniProgramLogin',
    ...RESOURCE_SECTION_IDS,
  ];
}

function toOAuthListParams(params: { page: number; pageSize: number } | undefined): OAuthListParams {
  return {
    ...DEFAULT_OAUTH_PAGE_PARAMS,
    ...(params ? { page: String(params.page), pageSize: String(params.pageSize) } : {}),
  };
}

async function loadOAuthResource(
  t: ReturnType<typeof useTranslation>['t'],
  load: (params?: OAuthListParams) => Promise<unknown>,
  params?: OAuthListParams,
): Promise<unknown> {
  try {
    return await load(params);
  } catch (error) {
    throw new Error(translateOAuthLoadError(t, error));
  }
}

function translateOAuthLoadError(t: ReturnType<typeof useTranslation>['t'], error: unknown): string {
  if (isOAuthSdkResourceUnavailableError(error)) {
    return t('admin.oauth.errors.sdkResourceUnavailable', 'OAuth SDK resource is not available.');
  }
  return t('admin.oauth.errors.resourceLoad', 'OAuth resource could not be loaded.');
}

function isOAuthSdkResourceUnavailableError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith(OAUTH_SDK_RESOURCE_UNAVAILABLE_ERROR);
}

function providerCatalogColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('providerName', t('admin.oauth.columns.providerName', 'Name')),
    column('region', t('admin.oauth.columns.region', 'Region'), enumFormatter('region', t)),
    column('providerKind', t('admin.oauth.columns.providerKind', 'Kind'), enumFormatter('providerKind', t)),
    column('supportedSurfaces', t('admin.oauth.columns.supportedSurfaces', 'Surfaces'), listFormatter('surface', t)),
    column('supportedOwnerModes', t('admin.oauth.columns.supportedOwnerModes', 'Owner Modes'), listFormatter('ownerMode', t)),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function standardColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('id', t('admin.oauth.columns.id', 'ID')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('displayName', t('admin.oauth.columns.displayName', 'Display Name')),
    column('region', t('admin.oauth.columns.region', 'Region'), enumFormatter('region', t)),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
    column('updatedAt', t('admin.oauth.columns.updatedAt', 'Updated')),
  ];
}

function clientColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('clientId', t('admin.oauth.columns.clientId', 'Client ID')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('surface', t('admin.oauth.columns.surface', 'Surface'), enumFormatter('surface', t)),
    column('clientType', t('admin.oauth.columns.clientType', 'Client Type'), enumFormatter('clientType', t)),
    column('redirectUriCount', t('admin.oauth.columns.redirectUriCount', 'Redirect URIs'), formatNumber(t)),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function secretColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('secretId', t('admin.oauth.columns.secretId', 'Secret ID')),
    column('ownerKind', t('admin.oauth.columns.ownerKind', 'Owner Kind'), enumFormatter('ownerKind', t)),
    column('ownerId', t('admin.oauth.columns.ownerId', 'Owner ID')),
    column('secretKind', t('admin.oauth.columns.secretKind', 'Secret Kind'), enumFormatter('secretKind', t)),
    column('secretRef', t('admin.oauth.columns.secretRef', 'Secret Ref')),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function surfaceColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('surface', t('admin.oauth.columns.surface', 'Surface'), enumFormatter('surface', t)),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('platform', t('admin.oauth.columns.platform', 'Platform'), enumFormatter('platform', t)),
    column('callbackUrl', t('admin.oauth.columns.callbackUrl', 'Callback')),
    column('clientId', t('admin.oauth.columns.clientId', 'Client ID')),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function flowColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('flowConfigId', t('admin.oauth.columns.flowConfigId', 'Flow Config')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('surface', t('admin.oauth.columns.surface', 'Surface'), enumFormatter('surface', t)),
    column('flowType', t('admin.oauth.columns.flowType', 'Flow Type'), enumFormatter('flowType', t)),
    column('pkceRequired', t('admin.oauth.columns.pkceRequired', 'PKCE'), booleanFormatter(t)),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function scopeColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('scopeProfileId', t('admin.oauth.columns.scopeProfileId', 'Scope Profile')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('profileCode', t('admin.oauth.columns.profileCode', 'Code')),
    column('scopes', t('admin.oauth.columns.scopes', 'Scopes'), formatList(t)),
    column('consentMode', t('admin.oauth.columns.consentMode', 'Consent Mode'), enumFormatter('consentMode', t)),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function mappingColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('mappingId', t('admin.oauth.columns.mappingId', 'Mapping')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('claimName', t('admin.oauth.columns.claimName', 'Claim')),
    column('targetField', t('admin.oauth.columns.targetField', 'Target Field')),
    column('required', t('admin.oauth.columns.required', 'Required'), booleanFormatter(t)),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function policyColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('policyId', t('admin.oauth.columns.policyId', 'Policy')),
    column('policyCode', t('admin.oauth.columns.policyCode', 'Code')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('policyKind', t('admin.oauth.columns.policyKind', 'Kind'), enumFormatter('policyKind', t)),
    column('priority', t('admin.oauth.columns.priority', 'Priority'), formatNumber(t)),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function bindingColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('bindingId', t('admin.oauth.columns.bindingId', 'Binding')),
    column('tenantId', t('admin.oauth.columns.tenantId', 'Tenant')),
    column('integrationId', t('admin.oauth.columns.integrationId', 'Integration')),
    column('defaultPolicyId', t('admin.oauth.columns.defaultPolicyId', 'Default Policy')),
    column('enabled', t('admin.oauth.columns.enabled', 'Enabled'), booleanFormatter(t)),
    column('updatedAt', t('admin.oauth.columns.updatedAt', 'Updated')),
  ];
}

function operatorPlatformColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('operatorPlatformId', t('admin.oauth.columns.operatorPlatformId', 'Operator Platform')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('platformName', t('admin.oauth.columns.platformName', 'Name')),
    column('authorizationMode', t('admin.oauth.columns.authorizationMode', 'Authorization'), enumFormatter('authorizationMode', t)),
    column('callbackPublicId', t('admin.oauth.columns.callbackPublicId', 'Callback Public ID')),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function resourceAccountColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('resourceAccountId', t('admin.oauth.columns.resourceAccountId', 'Resource Account')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('resourceAccountKind', t('admin.oauth.columns.resourceAccountKind', 'Kind'), enumFormatter('resourceAccountKind', t)),
    column('ownerMode', t('admin.oauth.columns.ownerMode', 'Owner Mode'), enumFormatter('ownerMode', t)),
    column('accountName', t('admin.oauth.columns.accountName', 'Account Name')),
    column('appId', t('admin.oauth.columns.appId', 'App ID')),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function authorizationColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('authorizationId', t('admin.oauth.columns.authorizationId', 'Authorization')),
    column('resourceAccountId', t('admin.oauth.columns.resourceAccountId', 'Resource Account')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('scopeProfileId', t('admin.oauth.columns.scopeProfileId', 'Scope Profile')),
    column('expiresAt', t('admin.oauth.columns.expiresAt', 'Expires')),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function webhookColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('webhookConfigId', t('admin.oauth.columns.webhookConfigId', 'Webhook')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('resourceAccountId', t('admin.oauth.columns.resourceAccountId', 'Resource Account')),
    column('callbackPublicId', t('admin.oauth.columns.callbackPublicId', 'Callback Public ID')),
    column('signatureMode', t('admin.oauth.columns.signatureMode', 'Signature'), enumFormatter('signatureMode', t)),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function operationalResourceColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('resourceId', t('admin.oauth.columns.resourceId', 'Resource')),
    column('resourceType', t('admin.oauth.columns.resourceType', 'Type'), enumFormatter('resourceType', t)),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('resourceAccountId', t('admin.oauth.columns.resourceAccountId', 'Resource Account')),
    column('publishStatus', t('admin.oauth.columns.publishStatus', 'Publish'), enumFormatter('publishStatus', t)),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function accountLinkColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('accountLinkId', t('admin.oauth.columns.accountLinkId', 'Account Link')),
    column('subjectId', t('admin.oauth.columns.subjectId', 'Subject')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('externalSubjectId', t('admin.oauth.columns.externalSubjectId', 'External Subject')),
    column('linkedAt', t('admin.oauth.columns.linkedAt', 'Linked At')),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function grantColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('grantId', t('admin.oauth.columns.grantId', 'Grant')),
    column('subjectId', t('admin.oauth.columns.subjectId', 'Subject')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('scopeProfileId', t('admin.oauth.columns.scopeProfileId', 'Scope Profile')),
    column('expiresAt', t('admin.oauth.columns.expiresAt', 'Expires')),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function callbackColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('callbackEventId', t('admin.oauth.columns.callbackEventId', 'Callback Event')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('callbackPublicId', t('admin.oauth.columns.callbackPublicId', 'Callback Public ID')),
    column('eventType', t('admin.oauth.columns.eventType', 'Event Type'), enumFormatter('eventType', t)),
    column('receivedAt', t('admin.oauth.columns.receivedAt', 'Received')),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function diagnosticColumns(t: ReturnType<typeof useTranslation>['t']) {
  return [
    column('diagnosticRunId', t('admin.oauth.columns.diagnosticRunId', 'Diagnostic Run')),
    column('providerCode', t('admin.oauth.columns.providerCode', 'Provider')),
    column('targetType', t('admin.oauth.columns.targetType', 'Target Type'), enumFormatter('targetType', t)),
    column('targetId', t('admin.oauth.columns.targetId', 'Target ID')),
    column('startedAt', t('admin.oauth.columns.startedAt', 'Started')),
    column('status', t('admin.oauth.columns.status', 'Status'), enumFormatter('status', t)),
  ];
}

function column(
  key: string,
  label: string,
  format?: (value: unknown, record: Record<string, unknown>) => string,
) {
  return { key, label, format };
}

function formatList(t: ReturnType<typeof useTranslation>['t']) {
  return (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item)).join(', ') || t('admin.oauth.values.empty', '-');
    }
    if (typeof value === 'string') {
      return value || t('admin.oauth.values.empty', '-');
    }
    return formatUnknown(value, t);
  };
}

function booleanFormatter(t: ReturnType<typeof useTranslation>['t']) {
  return (value: unknown): string => {
    if (typeof value === 'boolean') {
      return value ? t('admin.oauth.boolean.yes', 'Yes') : t('admin.oauth.boolean.no', 'No');
    }
    return formatUnknown(value, t);
  };
}

function listFormatter(namespace: string, t: ReturnType<typeof useTranslation>['t']) {
  return (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.map((item) => formatEnumValue(namespace, item, t)).join(', ') || t('admin.oauth.values.empty', '-');
    }
    if (typeof value === 'string') {
      return value
        ? value.split(',').map((item) => formatEnumValue(namespace, item.trim(), t)).join(', ')
        : t('admin.oauth.values.empty', '-');
    }
    return formatUnknown(value, t);
  };
}

function enumFormatter(namespace: string, t: ReturnType<typeof useTranslation>['t']) {
  return (value: unknown): string => formatEnumValue(namespace, value, t);
}

function formatEnumValue(namespace: string, value: unknown, t: ReturnType<typeof useTranslation>['t']): string {
  if (typeof value !== 'string') {
    return formatUnknown(value, t);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return t('admin.oauth.values.empty', '-');
  }
  const normalized = normalizeEnumValueKey(trimmed);
  const key = ['admin', 'oauth', 'values', namespace, normalized].join('.');
  return t(key, humanizeEnumValue(trimmed));
}

function normalizeEnumValueKey(value: string): string {
  const words = value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words.map((word, index) => (index === 0 ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`)).join('');
}

function humanizeEnumValue(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function humanizeFieldName(value: string): string {
  return humanizeEnumValue(value).replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatNumber(t: ReturnType<typeof useTranslation>['t']) {
  return (value: unknown): string => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
    return formatUnknown(value, t);
  };
}

function formatUnknown(value: unknown, t: ReturnType<typeof useTranslation>['t']): string {
  if (value === null || value === undefined || value === '') {
    return t('admin.oauth.values.empty', '-');
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
}
