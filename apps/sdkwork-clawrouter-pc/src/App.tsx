import React, { useState, useLayoutEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShellLayout, RouteFallback, ScrollToTop } from '@sdkwork/clawrouter-pc-shell';
import { ConsoleLayout } from '@sdkwork/clawrouter-pc-console-shell';
import { AdminLayout } from '@sdkwork/clawrouter-pc-admin-shell';
import {
  applyThemeColorPreference,
  applyThemePreference,
  persistThemePreference,
  persistThemeColorPreference,
  resolveEffectiveThemePreference,
  resolveInitialThemeColorPreference,
  resolveInitialThemePreference,
  type ResolvedThemePreference,
  type ThemeColorPreference,
  type ThemePreference,
} from './themePreference';
import { RequireAdminSession, RequirePortalSession, PortalAuthenticatedAuthRouteGuard } from './auth/protectedPortalRoutes';
import {
  SdkworkCommerceHostNavbarActions,
} from '@sdkwork/commerce-pc-host';
import { ClawRouterConsoleCommerceHostRoutes } from './commerce/commerceHostMount';

const Home = lazyRoute(() => import('@sdkwork/clawrouter-pc-home'), 'Home');
const Models = lazyRoute(() => import('@sdkwork/clawrouter-pc-models/models'), 'Models');
const ModelDetails = lazyRoute(() => import('@sdkwork/clawrouter-pc-models/details'), 'ModelDetails');
const Rankings = lazyRoute(() => import('@sdkwork/clawrouter-pc-rankings'), 'Rankings');
const Docs = lazyRoute(() => import('@sdkwork/documents-pc-api-reference'), 'Docs');
const ApiReference = lazyRoute(() => import('@sdkwork/documents-pc-api-reference'), 'ApiReference');
const ProductDocs = lazyRoute(() => import('@sdkwork/documents-pc-api-reference'), 'ProductDocs');
const SdkReference = lazyRoute(() => import('@sdkwork/documents-pc-sdk-reference'), 'SdkReference');
const Playground = lazyRoute(() => import('@sdkwork/clawrouter-pc-playground'), 'Playground');
const ClawRouterAuthRoutes = lazyRoute(() => import('./auth/ClawRouterAuthRoutes'), 'ClawRouterAuthRoutes');
const ClawRouterAuthSettingsPage = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-site'), 'ClawRouterAuthSettingsPage');

type AdminSectionRouteProps = {
  sectionId?: string;
  surface?: 'finance' | 'marketing';
};

const DashboardView = lazyRoute(() => import('@sdkwork/clawrouter-pc-console-dashboard'), 'DashboardView');
const UsageView = lazyRoute(() => import('@sdkwork/clawrouter-pc-console-usage'), 'UsageView');
const GatewayView = lazyRoute(() => import('@sdkwork/clawrouter-pc-console-gateway'), 'GatewayView');
const ApiKeysView = lazyRoute(() => import('@sdkwork/clawrouter-pc-console-api-keys'), 'ApiKeysView');
const UserView = lazyRoute(() => import('@sdkwork/clawrouter-pc-console-user'), 'UserView');
const SettingsView = lazyRoute(() => import('@sdkwork/clawrouter-pc-console-settings'), 'SettingsView');
const AccountView = lazyRoute(() => import('@sdkwork/commerce-pc-billing'), 'SdkworkBillingPage');
const SettlementsView = lazyRoute(() => import('@sdkwork/commerce-pc-billing'), 'SdkworkBillingPage');
const MessagesView = lazyRoute(() => import('@sdkwork/clawrouter-pc-console-messages'), 'MessagesView');

const DashboardAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-dashboard'), 'DashboardAdmin');
const AnalyticsAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-analytics'), 'AnalyticsAdmin');
const CacheAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-cache'), 'CacheAdmin');
const UserAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-user'), 'UserAdmin');
const OrganizationAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-organization'), 'OrganizationAdmin');
const GroupAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-group'), 'GroupAdmin');
const ModelAdmin = lazyRoute(() => import('@sdkwork/models-pc-admin-catalog'), 'ModelAdmin');
const ModelMappingAdmin = lazyRoute(() => import('@sdkwork/models-pc-admin-catalog'), 'ModelMappingAdmin');
const ResourceAdmin = lazyRoute(() => import('@sdkwork/models-pc-admin-resource'), 'ResourceAdmin');
const SiteAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-relay-site'), 'SiteAdmin');
const PromptsAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-prompts'), 'PromptsAdmin');
const McpAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-mcp'), 'McpAdmin');
const ChannelAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-channel'), 'ChannelAdmin');
const ServiceProviderAdmin = lazyRoute<AdminSectionRouteProps>(() => import('@sdkwork/clawrouter-pc-admin-service-provider'), 'ServiceProviderAdmin');
const RecordAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-record'), 'RecordAdmin');
const MonitorAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-monitor'), 'MonitorAdmin');
const RateLimitAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-ratelimit'), 'RateLimitAdmin');
const ServiceNodesAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-service-nodes'), 'ServiceNodesAdmin');
const RuntimeRegionAdmin = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-runtime-region'), 'RuntimeRegionAdmin');
const ClawRouterSiteSettingsPage = lazyRoute(() => import('@sdkwork/clawrouter-pc-admin-site'), 'ClawRouterSiteSettingsPage');

function lazyRoute<TProps extends object = Record<string, unknown>>(
  loader: () => Promise<Record<string, unknown>>,
  exportName: string,
): React.LazyExoticComponent<React.ComponentType<TProps>> {
  return lazy(async () => {
    const module = await loader();
    return { default: module[exportName] as React.ComponentType<TProps> };
  });
}

function MainLayout({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) {
  return (
    <AppShellLayout
      isDark={isDark}
      toggleTheme={toggleTheme}
      navbarAuthenticatedActionsStart={<SdkworkCommerceHostNavbarActions routePrefix="/console" />}
      Home={Home}
      Models={Models}
      ModelDetails={ModelDetails}
      Rankings={Rankings}
      Docs={Docs}
      ApiReference={ApiReference}
      ProductDocs={ProductDocs}
      SdkReference={SdkReference}
      Playground={Playground}
    />
  );
}

export default function App() {
  const [theme, setThemeState] = useState<ThemePreference>(() => resolveInitialThemePreference());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedThemePreference>(() => resolveEffectiveThemePreference(resolveInitialThemePreference()));
  const [themeColor, setThemeColorState] = useState<ThemeColorPreference>(() => resolveInitialThemeColorPreference());
  const isDark = resolvedTheme === 'dark';

  useLayoutEffect(() => {
    const syncTheme = () => {
      const nextResolvedTheme = applyThemePreference(theme);
      setResolvedTheme((currentTheme) => (currentTheme === nextResolvedTheme ? currentTheme : nextResolvedTheme));
    };

    syncTheme();
    persistThemePreference(theme);

    if (theme !== 'system' || typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) {
      return undefined;
    }

    mediaQuery.addEventListener('change', syncTheme);
    return () => {
      mediaQuery.removeEventListener('change', syncTheme);
    };
  }, [theme]);

  useLayoutEffect(() => {
    applyThemeColorPreference(themeColor);
    persistThemeColorPreference(themeColor);
  }, [themeColor]);

  const setTheme = (nextTheme: ThemePreference) => {
    setThemeState(nextTheme);
  };

  const setThemeColor = (nextThemeColor: ThemeColorPreference) => {
    setThemeColorState(nextThemeColor);
  };

  const toggleTheme = () => {
    setThemeState((currentTheme) => {
      const currentResolvedTheme = resolveEffectiveThemePreference(currentTheme);
      return currentResolvedTheme === 'dark' ? 'light' : 'dark';
    });
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col selection:bg-lobster-500/30">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/auth/*" element={<PortalAuthenticatedAuthRouteGuard><ClawRouterAuthRoutes /></PortalAuthenticatedAuthRouteGuard>} />

            {/* Console Routes - standalone structure with global Navbar */}
            <Route path="/console" element={<RequirePortalSession><ConsoleLayout isDark={isDark} toggleTheme={toggleTheme} theme={theme} setTheme={setTheme} themeColor={themeColor} setThemeColor={setThemeColor} navbarAuthenticatedActionsStart={<SdkworkCommerceHostNavbarActions routePrefix="/console" />} /></RequirePortalSession>}>
              <Route index element={<Navigate to="/console/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="usage" element={<UsageView />} />
              <Route path="gateway" element={<GatewayView />} />
              <Route path="api-keys" element={<ApiKeysView />} />
              <Route path="account" element={<AccountView />} />
              <ClawRouterConsoleCommerceHostRoutes />
              <Route path="settlements" element={<SettlementsView />} />
              <Route path="notifications" element={<MessagesView />} />
              <Route path="user" element={<UserView />} />
              <Route path="settings" element={<SettingsView />} />
              <Route path="*" element={<Navigate to="/console/dashboard" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<RequireAdminSession><AdminLayout isDark={isDark} toggleTheme={toggleTheme} /></RequireAdminSession>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardAdmin />} />
              <Route path="analytics" element={<AnalyticsAdmin />} />
              <Route path="user" element={<UserAdmin />} />
              <Route path="organization" element={<OrganizationAdmin />} />
              <Route path="group" element={<GroupAdmin />} />
              <Route path="model" element={<ModelAdmin />} />
              <Route path="model/resources" element={<ResourceAdmin />} />
              <Route path="model/sites" element={<SiteAdmin />} />
              <Route path="model/mappings" element={<ModelMappingAdmin />} />
              <Route path="prompts" element={<PromptsAdmin />} />
              <Route path="mcp" element={<McpAdmin />} />
              <Route path="channel" element={<ChannelAdmin />} />
              <Route path="service-providers" element={<Navigate to="/admin/service-providers/dashboard" replace />} />
              <Route path="service-providers/dashboard" element={<ServiceProviderAdmin sectionId="dashboard" />} />
              <Route path="service-providers/providers" element={<ServiceProviderAdmin sectionId="providers" />} />
              <Route path="service-providers/relations" element={<ServiceProviderAdmin sectionId="relations" />} />
              <Route path="service-providers/downstreams" element={<ServiceProviderAdmin sectionId="downstreams" />} />
              <Route path="service-providers/members" element={<ServiceProviderAdmin sectionId="members" />} />
              <Route path="service-providers/bindings" element={<ServiceProviderAdmin sectionId="bindings" />} />
              <Route path="service-providers/contracts" element={<ServiceProviderAdmin sectionId="contracts" />} />
              <Route path="service-providers/pricing" element={<ServiceProviderAdmin sectionId="pricing" />} />
              <Route path="service-providers/usage" element={<ServiceProviderAdmin sectionId="usage" />} />
              <Route path="service-providers/wallet" element={<ServiceProviderAdmin sectionId="wallet" />} />
              <Route path="service-providers/statements" element={<ServiceProviderAdmin sectionId="statements" />} />
              <Route path="service-providers/reconciliation" element={<ServiceProviderAdmin sectionId="reconciliation" />} />
              <Route path="service-providers/adjustments" element={<ServiceProviderAdmin sectionId="adjustments" />} />
              <Route path="service-providers/risk" element={<ServiceProviderAdmin sectionId="risk" />} />
              <Route path="service-providers/audit" element={<ServiceProviderAdmin sectionId="audit" />} />
              <Route path="record" element={<RecordAdmin />} />
              <Route path="monitor" element={<MonitorAdmin />} />
              <Route path="cache" element={<CacheAdmin />} />
              <Route path="ratelimit" element={<RateLimitAdmin />} />
              <Route path="service-nodes" element={<ServiceNodesAdmin />} />
              <Route path="settings" element={<ClawRouterAuthSettingsPage />} />
              <Route path="runtime-region" element={<RuntimeRegionAdmin />} />
              <Route path="site" element={<ClawRouterSiteSettingsPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            <Route path="*" element={<MainLayout isDark={isDark} toggleTheme={toggleTheme} />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
