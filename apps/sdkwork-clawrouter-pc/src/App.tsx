import React, { useState, useEffect, useLayoutEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Footer } from 'sdkwork-clawrouter-pc-commons';
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
import { RequireAdminSession, RequirePortalSession } from './auth/protectedPortalRoutes';

const Home = lazyRoute(() => import('sdkwork-clawrouter-pc-home'), 'Home');
const Models = lazyRoute(() => import('sdkwork-clawrouter-pc-models/models'), 'Models');
const ModelDetails = lazyRoute(() => import('sdkwork-clawrouter-pc-models/details'), 'ModelDetails');
const Rankings = lazyRoute(() => import('sdkwork-clawrouter-pc-rankings'), 'Rankings');
const AppCenter = lazyRoute(() => import('sdkwork-clawrouter-pc-app-center'), 'AppCenter');
const AppDetails = lazyRoute(() => import('sdkwork-clawrouter-pc-app-center'), 'AppDetails');
const AppAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-app-center'), 'AppAdmin');
const SkillsHub = lazyRoute(() => import('sdkwork-clawrouter-pc-skills-hub'), 'SkillsHub');
const SkillDetails = lazyRoute(() => import('sdkwork-clawrouter-pc-skills-hub'), 'SkillDetails');
const Docs = lazyRoute(() => import('sdkwork-clawrouter-pc-api-reference'), 'Docs');
const ApiReference = lazyRoute(() => import('sdkwork-clawrouter-pc-api-reference'), 'ApiReference');
const ProductDocs = lazyRoute(() => import('sdkwork-clawrouter-pc-api-reference'), 'ProductDocs');
const SdkReference = lazyRoute(() => import('sdkwork-clawrouter-pc-sdk-reference'), 'SdkReference');
const Playground = lazyRoute(() => import('sdkwork-clawrouter-pc-playground'), 'Playground');
const ForumView = lazyRoute(() => import('sdkwork-clawrouter-pc-forum'), 'ForumView');
const ForumPostView = lazyRoute(() => import('sdkwork-clawrouter-pc-forum'), 'ForumPostView');
const CoursesView = lazyRoute(() => import('sdkwork-clawrouter-pc-courses'), 'CoursesView');
const CourseDetailView = lazyRoute(() => import('sdkwork-clawrouter-pc-courses'), 'CourseDetailView');
const ClawRouterAuthRoutes = lazyRoute(() => import('./auth/ClawRouterAuthRoutes'), 'ClawRouterAuthRoutes');
const ClawRouterAuthSettingsPage = lazyRoute(() => import('./auth/ClawRouterAuthSettingsPage'), 'ClawRouterAuthSettingsPage');

const CONSOLE_BUSINESS_ROUTE_PATHS = {
  account: '/console/account',
  wallet: '/console/wallet',
  recharge: '/console/recharge',
  checkout: '/console/checkout',
  memberships: '/console/memberships',
  settlements: '/console/settlements',
} as const;

const ADMIN_BUSINESS_ROUTE_PATHS = {
  catalog: '/admin/catalog/products',
  inventory: '/admin/inventory/stocks',
  orders: '/admin/orders/orders',
  payments: '/admin/payments/provider-accounts',
  memberships: '/admin/memberships/packages',
  serviceProviders: '/admin/service-providers/dashboard',
  wallet: '/admin/wallet/wallet-accounts',
  finance: '/admin/finance/order-revenue',
  marketing: '/admin/marketing/offers',
} as const;

type ShellLayoutProps = {
  isDark: boolean;
  toggleTheme: () => void;
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  themeColor: ThemeColorPreference;
  setThemeColor: (themeColor: ThemeColorPreference) => void;
};

type AdminLayoutProps = {
  isDark: boolean;
  toggleTheme: () => void;
};

type AdminSectionRouteProps = {
  sectionId?: string;
  surface?: 'finance' | 'marketing';
};

const ConsoleLayout = lazyRoute<ShellLayoutProps>(() => import('sdkwork-clawrouter-pc-console-core'), 'ConsoleLayout');
const DashboardView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-dashboard'), 'DashboardView');
const UsageView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-usage'), 'UsageView');
const GatewayView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-gateway'), 'GatewayView');
const ApiKeysView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-api-keys'), 'ApiKeysView');
const UserView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-user'), 'UserView');
const AccountView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-account'), 'AccountView');
const WalletView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-wallet'), 'WalletView');
const RechargeView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-recharge'), 'RechargeView');
const CheckoutView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-checkout'), 'CheckoutView');
const MembershipsView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-memberships'), 'MembershipsView');
const VipView = lazyRoute(() => import('sdkwork-clawrouter-pc-vip'), 'VipView');
const SettlementsView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-settlements'), 'SettlementsView');
const SettingsView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-settings'), 'SettingsView');
const NotificationsView = lazyRoute(() => import('sdkwork-clawrouter-pc-console-messages'), 'NotificationsView');

const AdminLayout = lazyRoute<AdminLayoutProps>(() => import('./AdminLayout'), 'AdminLayout');
const DashboardAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-dashboard'), 'DashboardAdmin');
const AnalyticsAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-analytics'), 'AnalyticsAdmin');
const CacheAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-cache'), 'CacheAdmin');
const UserAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-user'), 'UserAdmin');
const OrganizationAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-organization'), 'OrganizationAdmin');
const GroupAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-group'), 'GroupAdmin');
const ModelAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-model'), 'ModelAdmin');
const SiteAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-model'), 'SiteAdmin');
const ModelMappingAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-model'), 'ModelMappingAdmin');
const ResourceAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-model'), 'ResourceAdmin');
const AgentsAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-agents'), 'AdminAgentsView');
const SkillAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-skill'), 'SkillAdmin');
const PromptsAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-prompts'), 'PromptsAdmin');
const McpAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-mcp'), 'McpAdmin');
const ChannelAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-channel'), 'ChannelAdmin');
const WechatOfficialAccountAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-wechat-official-account'), 'WechatOfficialAccountAdmin');
const WechatMiniProgramAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-wechat-mini-program'), 'WechatMiniProgramAdmin');
const AnnouncementAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-announcement'), 'AnnouncementAdmin');
const CatalogAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-catalog'), 'CatalogAdmin');
const CourseAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-courses'), 'CourseAdmin');
const InventoryAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-inventory'), 'InventoryAdmin');
const OrdersAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-orders'), 'OrdersAdmin');
const PaymentsAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-payments'), 'PaymentsAdmin');
const MembershipsAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-memberships'), 'MembershipsAdmin');
const ServiceProviderAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-service-provider'), 'ServiceProviderAdmin');
const MessagingAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-messaging'), 'MessagingAdmin');
const StorageAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-file-platform'), 'StorageAdmin');
const DriveAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-file-platform'), 'DriveAdmin');
const WalletAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-wallet'), 'WalletAdmin');
const FinanceAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-finance'), 'FinanceAdmin');
const MarketingAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-clawrouter-pc-admin-marketing'), 'MarketingAdmin');
const RecordAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-record'), 'RecordAdmin');
const MonitorAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-monitor'), 'MonitorAdmin');
const RateLimitAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-ratelimit'), 'RateLimitAdmin');
const ServiceNodesAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-service-nodes'), 'ServiceNodesAdmin');
const RuntimeRegionAdmin = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-runtime-region'), 'RuntimeRegionAdmin');
const ClawRouterSiteSettingsPage = lazyRoute(() => import('sdkwork-clawrouter-pc-admin-site'), 'ClawRouterSiteSettingsPage');

function lazyRoute<TProps extends object>(
  loader: () => Promise<Record<string, unknown>>,
  exportName: string,
): React.LazyExoticComponent<React.ComponentType<TProps>> {
  return lazy(async () => {
    const module = await loader();
    return { default: module[exportName] as React.ComponentType<TProps> };
  });
}

function RouteFallback() {
  const { pathname } = useLocation();

  if (pathname.startsWith('/auth')) {
    return (
      <div className="sdkwork-auth-route-fallback fixed inset-0 z-[60] h-[100dvh] min-h-[100dvh] w-full bg-slate-950" />
    );
  }

  return <div className="min-h-[40vh] bg-white dark:bg-slate-950" />;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) {
  const location = useLocation();
  const isPlayground = location.pathname.startsWith('/playground') || location.pathname.startsWith('/c/');

  return (
    <>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/models" element={<Models />} />
          <Route path="/models/:id" element={<ModelDetails />} />
          <Route path="/models/:provider/:model" element={<ModelDetails />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/apps" element={<AppCenter />} />
          <Route path="/skills-hub" element={<SkillsHub />} />
          <Route path="/product-docs" element={<ProductDocs />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/api-reference" element={<ApiReference />} />
          <Route path="/sdk-reference" element={<SdkReference />} />
          <Route path="/playground/*" element={<Playground />} />
          <Route path="/c/:conversationId" element={<Playground />} />
          <Route path="/forum" element={<ForumView />} />
          <Route path="/forum/:id" element={<ForumPostView />} />
          <Route path="/courses" element={<CoursesView />} />
          <Route path="/courses/:id" element={<CourseDetailView />} />
          <Route path="/vip" element={<VipView />} />
        </Routes>
      </div>
      {!isPlayground && <Footer />}
    </>
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
            <Route path="/auth/*" element={<ClawRouterAuthRoutes />} />

            <Route path="/apps/:id" element={<AppDetails />} />
            <Route path="/skills-hub/:id" element={<SkillDetails />} />

            {/* Console Routes - standalone structure with global Navbar */}
            <Route path="/console" element={<RequirePortalSession><ConsoleLayout isDark={isDark} toggleTheme={toggleTheme} theme={theme} setTheme={setTheme} themeColor={themeColor} setThemeColor={setThemeColor} /></RequirePortalSession>}>
              <Route index element={<Navigate to="/console/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="usage" element={<UsageView />} />
              <Route path="gateway" element={<GatewayView />} />
              <Route path="api-keys" element={<ApiKeysView />} />
              <Route path="user" element={<UserView />} />
              <Route path="account" element={<AccountView />} />
              <Route path="wallet" element={<WalletView />} />
              <Route path="recharge" element={<RechargeView />} />
              <Route path="checkout" element={<CheckoutView />} />
              <Route path="memberships" element={<MembershipsView />} />
              <Route path="settlements" element={<SettlementsView />} />
              <Route path="settings" element={<SettingsView />} />
              <Route path="notifications" element={<NotificationsView />} />
              <Route path="messages" element={<Navigate to="/console/notifications" replace />} />
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
              <Route path="agents" element={<AgentsAdmin />} />
              <Route path="app" element={<AppAdmin />} />
              <Route path="skill" element={<SkillAdmin />} />
              <Route path="prompts" element={<PromptsAdmin />} />
              <Route path="mcp" element={<McpAdmin />} />
              <Route path="channel" element={<ChannelAdmin />} />
              <Route path="open-platform" element={<Navigate to="/admin/open-platform/official-accounts/accounts" replace />} />
              <Route path="open-platform/official-accounts" element={<Navigate to="/admin/open-platform/official-accounts/accounts" replace />} />
              <Route path="open-platform/official-accounts/accounts" element={<WechatOfficialAccountAdmin sectionId="accounts" />} />
              <Route path="open-platform/official-accounts/menus" element={<WechatOfficialAccountAdmin sectionId="menus" />} />
              <Route path="open-platform/official-accounts/messages" element={<WechatOfficialAccountAdmin sectionId="messages" />} />
              <Route path="open-platform/mini-programs" element={<Navigate to="/admin/open-platform/mini-programs/accounts" replace />} />
              <Route path="open-platform/mini-programs/accounts" element={<WechatMiniProgramAdmin sectionId="accounts" />} />
              <Route path="open-platform/mini-programs/urls" element={<WechatMiniProgramAdmin sectionId="urls" />} />
              <Route path="announcement" element={<AnnouncementAdmin />} />
              <Route path="courses" element={<Navigate to="/admin/courses/dashboard" replace />} />
              <Route path="courses/dashboard" element={<CourseAdmin sectionId="dashboard" />} />
              <Route path="courses/catalog" element={<CourseAdmin sectionId="catalog" />} />
              <Route path="courses/sections" element={<CourseAdmin sectionId="sections" />} />
              <Route path="courses/lessons" element={<CourseAdmin sectionId="lessons" />} />
              <Route path="courses/relations" element={<CourseAdmin sectionId="relations" />} />
              <Route path="courses/applications" element={<CourseAdmin sectionId="applications" />} />
              <Route path="courses/comments" element={<CourseAdmin sectionId="comments" />} />
              <Route path="courses/engagement" element={<CourseAdmin sectionId="engagement" />} />
              <Route path="catalog" element={<Navigate to="/admin/catalog/products" replace />} />
              <Route path="catalog/categories" element={<CatalogAdmin sectionId="categories" />} />
              <Route path="catalog/products/new" element={<CatalogAdmin sectionId="productCreate" />} />
              <Route path="catalog/products/:productId/edit" element={<CatalogAdmin sectionId="productEdit" />} />
              <Route path="catalog/products" element={<CatalogAdmin sectionId="products" />} />
              <Route path="catalog/skus" element={<CatalogAdmin sectionId="skus" />} />
              <Route path="catalog/attributes" element={<CatalogAdmin sectionId="attributes" />} />
              <Route path="catalog/prices" element={<CatalogAdmin sectionId="prices" />} />
              <Route path="inventory" element={<Navigate to="/admin/inventory/stocks" replace />} />
              <Route path="inventory/stocks" element={<InventoryAdmin sectionId="stocks" />} />
              <Route path="inventory/reservations" element={<InventoryAdmin sectionId="reservations" />} />
              <Route path="inventory/ledger" element={<InventoryAdmin sectionId="ledger" />} />
              <Route path="orders" element={<Navigate to="/admin/orders/orders" replace />} />
              <Route path="orders/orders" element={<OrdersAdmin sectionId="orders" />} />
              <Route path="orders/refunds" element={<OrdersAdmin sectionId="refunds" />} />
              <Route path="orders/fulfillments" element={<OrdersAdmin sectionId="fulfillments" />} />
              <Route path="orders/shipments" element={<OrdersAdmin sectionId="shipments" />} />
              <Route path="payments" element={<Navigate to="/admin/payments/provider-accounts" replace />} />
              <Route path="payments/providers" element={<PaymentsAdmin sectionId="providers" />} />
              <Route path="payments/provider-accounts" element={<PaymentsAdmin sectionId="providerAccounts" />} />
              <Route path="payments/methods" element={<PaymentsAdmin sectionId="methods" />} />
              <Route path="payments/channels" element={<PaymentsAdmin sectionId="channels" />} />
              <Route path="payments/route-rules" element={<PaymentsAdmin sectionId="routeRules" />} />
              <Route path="payments/intents" element={<PaymentsAdmin sectionId="intents" />} />
              <Route path="payments/attempts" element={<PaymentsAdmin sectionId="attempts" />} />
              <Route path="payments/webhook-events" element={<PaymentsAdmin sectionId="webhookEvents" />} />
              <Route path="payments/reconciliation-runs" element={<PaymentsAdmin sectionId="reconciliationRuns" />} />
              <Route path="memberships" element={<Navigate to="/admin/memberships/packages" replace />} />
              <Route path="memberships/packages" element={<MembershipsAdmin sectionId="packages" />} />
              <Route path="memberships/vip-packages" element={<MembershipsAdmin sectionId="vipPackages" />} />
              <Route path="memberships/plans" element={<MembershipsAdmin sectionId="plans" />} />
              <Route path="memberships/members" element={<MembershipsAdmin sectionId="members" />} />
              <Route path="memberships/entitlements" element={<MembershipsAdmin sectionId="entitlements" />} />
              <Route path="memberships/recharge-packages" element={<MembershipsAdmin sectionId="rechargePackages" />} />
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
              <Route path="messaging" element={<Navigate to="/admin/messaging/providers" replace />} />
              <Route path="messaging/providers" element={<MessagingAdmin sectionId="providers" />} />
              <Route path="messaging/sender-identities" element={<MessagingAdmin sectionId="senderIdentities" />} />
              <Route path="messaging/templates" element={<MessagingAdmin sectionId="templates" />} />
              <Route path="messaging/route-rules" element={<MessagingAdmin sectionId="routeRules" />} />
              <Route path="messaging/send-requests" element={<MessagingAdmin sectionId="sendRequests" />} />
              <Route path="messaging/diagnostics" element={<MessagingAdmin sectionId="diagnostics" />} />
              <Route path="messaging/suppressions" element={<MessagingAdmin sectionId="suppressions" />} />
              <Route path="messaging/rate-limits" element={<MessagingAdmin sectionId="rateLimits" />} />
              <Route path="messaging/verification-policies" element={<MessagingAdmin sectionId="verificationPolicies" />} />
              <Route path="storage" element={<Navigate to="/admin/storage/providers" replace />} />
              <Route path="storage/providers" element={<StorageAdmin sectionId="providers" />} />
              <Route path="storage/buckets" element={<StorageAdmin sectionId="buckets" />} />
              <Route path="storage/default-buckets" element={<StorageAdmin sectionId="defaultBuckets" />} />
              <Route path="storage/quotas" element={<StorageAdmin sectionId="quotas" />} />
              <Route path="storage/usage" element={<StorageAdmin sectionId="usage" />} />
              <Route path="storage/reconciliation" element={<StorageAdmin sectionId="reconciliation" />} />
              <Route path="storage/garbage-collection" element={<StorageAdmin sectionId="garbageCollection" />} />
              <Route path="drive" element={<Navigate to="/admin/drive/spaces" replace />} />
              <Route path="drive/spaces" element={<DriveAdmin sectionId="spaces" />} />
              <Route path="drive/nodes" element={<DriveAdmin sectionId="nodes" />} />
              <Route path="drive/permissions" element={<DriveAdmin sectionId="permissions" />} />
              <Route path="drive/share-links" element={<DriveAdmin sectionId="shareLinks" />} />
              <Route path="drive/audit" element={<DriveAdmin sectionId="audit" />} />
              <Route path="wallet" element={<Navigate to="/admin/wallet/wallet-accounts" replace />} />
              <Route path="wallet/recharge-orders" element={<WalletAdmin sectionId="rechargeOrders" />} />
              <Route path="wallet/wallet-accounts" element={<WalletAdmin sectionId="walletAccounts" />} />
              <Route path="wallet/wallet-ledger" element={<WalletAdmin sectionId="walletLedger" />} />
              <Route path="wallet/exchange-rules" element={<WalletAdmin sectionId="exchangeRules" />} />
              <Route path="finance" element={<Navigate to="/admin/finance/order-revenue" replace />} />
              <Route path="finance/invoice-titles" element={<FinanceAdmin sectionId="invoiceTitles" />} />
              <Route path="finance/invoices" element={<FinanceAdmin sectionId="invoices" />} />
              <Route path="finance/payment-reconciliation" element={<FinanceAdmin sectionId="paymentReconciliationReport" />} />
              <Route path="finance/order-revenue" element={<FinanceAdmin sectionId="orderRevenueReport" />} />
              <Route path="finance/refunds-report" element={<FinanceAdmin sectionId="refundsReport" />} />
              <Route path="finance/audit-events" element={<FinanceAdmin sectionId="auditEvents" />} />
              <Route path="marketing" element={<MarketingAdmin />} />
              <Route path="marketing/offers" element={<MarketingAdmin sectionId="promotionOffers" />} />
              <Route path="marketing/promotion-coupon-stocks" element={<MarketingAdmin sectionId="promotionCouponStocks" />} />
              <Route path="marketing/promotion-codes" element={<MarketingAdmin sectionId="promotionCodes" />} />
              <Route path="marketing/promotion-code-redemptions" element={<MarketingAdmin sectionId="promotionCodeRedemptions" />} />
              <Route path="marketing/user-coupons" element={<MarketingAdmin sectionId="userCoupons" />} />
              <Route path="marketing/discount-applications" element={<MarketingAdmin sectionId="discountApplications" />} />
              <Route path="marketing/discount-allocations" element={<MarketingAdmin sectionId="discountAllocations" />} />
              <Route path="marketing/promotion-coupon-ledger" element={<MarketingAdmin sectionId="promotionCouponLedger" />} />
              <Route path="marketing/budget-ledger" element={<MarketingAdmin sectionId="budgetLedger" />} />
              <Route path="marketing/external-bindings" element={<MarketingAdmin sectionId="externalBindings" />} />
              <Route path="marketing/events" element={<MarketingAdmin sectionId="promotionEvents" />} />
              <Route path="marketing/referrals" element={<MarketingAdmin sectionId="referrals" />} />
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
