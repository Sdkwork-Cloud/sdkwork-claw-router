import React, { useState, useEffect, useLayoutEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Footer } from 'sdkwork-claw-router-commons';
import {
  persistThemePreference,
  resolveInitialThemePreference,
  type ThemePreference,
} from './themePreference';
import { RequireAdminSession, RequirePortalSession } from './auth/protectedPortalRoutes';

const Home = lazyRoute(() => import('sdkwork-claw-router-home'), 'Home');
const Models = lazyRoute(() => import('sdkwork-claw-router-models/models'), 'Models');
const ModelDetails = lazyRoute(() => import('sdkwork-claw-router-models/details'), 'ModelDetails');
const Rankings = lazyRoute(() => import('sdkwork-claw-router-rankings'), 'Rankings');
const AppCenter = lazyRoute(() => import('sdkwork-claw-router-app-center'), 'AppCenter');
const AppDetails = lazyRoute(() => import('sdkwork-claw-router-app-center'), 'AppDetails');
const AppAdmin = lazyRoute(() => import('sdkwork-claw-router-app-center'), 'AppAdmin');
const SkillsHub = lazyRoute(() => import('sdkwork-claw-router-skills-hub'), 'SkillsHub');
const SkillDetails = lazyRoute(() => import('sdkwork-claw-router-skills-hub'), 'SkillDetails');
const Docs = lazyRoute(() => import('sdkwork-claw-router-api-reference'), 'Docs');
const ApiReference = lazyRoute(() => import('sdkwork-claw-router-api-reference'), 'ApiReference');
const ProductDocs = lazyRoute(() => import('sdkwork-claw-router-api-reference'), 'ProductDocs');
const SdkReference = lazyRoute(() => import('sdkwork-claw-router-sdk-reference'), 'SdkReference');
const Playground = lazyRoute(() => import('sdkwork-claw-router-playground'), 'Playground');
const ForumView = lazyRoute(() => import('sdkwork-claw-router-forum'), 'ForumView');
const ForumPostView = lazyRoute(() => import('sdkwork-claw-router-forum'), 'ForumPostView');
const CoursesView = lazyRoute(() => import('sdkwork-claw-router-courses'), 'CoursesView');
const CourseDetailView = lazyRoute(() => import('sdkwork-claw-router-courses'), 'CourseDetailView');
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
  serviceProviders: '/admin/service-providers/accounts',
  wallet: '/admin/wallet/wallet-accounts',
  finance: '/admin/finance/order-revenue',
  marketing: '/admin/marketing/referrals',
} as const;

type ShellLayoutProps = {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;
};

type AdminLayoutProps = {
  isDark: boolean;
  toggleTheme: () => void;
};

type AdminSectionRouteProps = {
  sectionId?: string;
  surface?: 'finance' | 'marketing';
};

const ConsoleLayout = lazyRoute<ShellLayoutProps>(() => import('sdkwork-claw-router-console-core'), 'ConsoleLayout');
const DashboardView = lazyRoute(() => import('sdkwork-claw-router-console-dashboard'), 'DashboardView');
const UsageView = lazyRoute(() => import('sdkwork-claw-router-console-usage'), 'UsageView');
const GatewayView = lazyRoute(() => import('sdkwork-claw-router-console-gateway'), 'GatewayView');
const RoutingView = lazyRoute(() => import('sdkwork-claw-router-console-routing'), 'RoutingView');
const ApiKeysView = lazyRoute(() => import('sdkwork-claw-router-console-api-keys'), 'ApiKeysView');
const AgentsView = lazyRoute(() => import('sdkwork-claw-router-console-agents'), 'AgentsView');
const UserView = lazyRoute(() => import('sdkwork-claw-router-console-user'), 'UserView');
const AccountView = lazyRoute(() => import('sdkwork-claw-router-console-account'), 'AccountView');
const WalletView = lazyRoute(() => import('sdkwork-claw-router-console-wallet'), 'WalletView');
const RechargeView = lazyRoute(() => import('sdkwork-claw-router-console-recharge'), 'RechargeView');
const CheckoutView = lazyRoute(() => import('sdkwork-claw-router-console-checkout'), 'CheckoutView');
const MembershipsView = lazyRoute(() => import('sdkwork-claw-router-console-memberships'), 'MembershipsView');
const VipView = lazyRoute(() => import('sdkwork-claw-router-vip'), 'VipView');
const SettlementsView = lazyRoute(() => import('sdkwork-claw-router-console-settlements'), 'SettlementsView');
const SettingsView = lazyRoute(() => import('sdkwork-claw-router-console-settings'), 'SettingsView');
const NotificationsView = lazyRoute(() => import('sdkwork-claw-router-console-messages'), 'NotificationsView');
const ProvidersView = lazyRoute(() => import('sdkwork-claw-router-console-providers'), 'ProvidersView');

const AdminLayout = lazyRoute<AdminLayoutProps>(() => import('./AdminLayout'), 'AdminLayout');
const DashboardAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-dashboard'), 'DashboardAdmin');
const AnalyticsAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-analytics'), 'AnalyticsAdmin');
const CacheAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-cache'), 'CacheAdmin');
const UserAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-user'), 'UserAdmin');
const GroupAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-group'), 'GroupAdmin');
const ModelAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-model'), 'ModelAdmin');
const AgentsAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-agents'), 'AdminAgentsView');
const SkillAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-skill'), 'SkillAdmin');
const ChannelAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-channel'), 'ChannelAdmin');
const WechatOfficialAccountAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-claw-router-admin-wechat-official-account'), 'WechatOfficialAccountAdmin');
const WechatMiniProgramAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-claw-router-admin-wechat-mini-program'), 'WechatMiniProgramAdmin');
const AnnouncementAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-announcement'), 'AnnouncementAdmin');
const CatalogAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-claw-router-admin-catalog'), 'CatalogAdmin');
const InventoryAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-claw-router-admin-inventory'), 'InventoryAdmin');
const OrdersAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-claw-router-admin-orders'), 'OrdersAdmin');
const PaymentsAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-claw-router-admin-payments'), 'PaymentsAdmin');
const MembershipsAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-claw-router-admin-memberships'), 'MembershipsAdmin');
const ServiceProviderAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-service-provider'), 'ServiceProviderAdmin');
const WalletAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-claw-router-admin-wallet'), 'WalletAdmin');
const FinanceAdmin = lazyRoute<AdminSectionRouteProps>(() => import('sdkwork-claw-router-admin-finance'), 'FinanceAdmin');
const MarketingAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-marketing'), 'MarketingAdmin');
const RecordAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-record'), 'RecordAdmin');
const MonitorAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-monitor'), 'MonitorAdmin');
const RateLimitAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-ratelimit'), 'RateLimitAdmin');
const ClawRouterSiteSettingsPage = lazyRoute(() => import('sdkwork-claw-router-admin-site'), 'ClawRouterSiteSettingsPage');

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
  const isPlayground = location.pathname.startsWith('/playground');

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
          <Route path="/playground" element={<Playground />} />
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
  const isDark = theme === 'dark';

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    persistThemePreference(theme);
  }, [theme]);

  const setTheme = (nextTheme: ThemePreference) => {
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setThemeState((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
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
            <Route path="/console" element={<RequirePortalSession><ConsoleLayout isDark={isDark} toggleTheme={toggleTheme} setTheme={setTheme} /></RequirePortalSession>}>
              <Route index element={<Navigate to="/console/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="usage" element={<UsageView />} />
              <Route path="gateway" element={<GatewayView />} />
              <Route path="routing" element={<RoutingView />} />
              <Route path="api-keys" element={<ApiKeysView />} />
              <Route path="agents" element={<AgentsView />} />
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
              <Route path="providers" element={<ProvidersView />} />
              <Route path="*" element={<Navigate to="/console/dashboard" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<RequireAdminSession><AdminLayout isDark={isDark} toggleTheme={toggleTheme} /></RequireAdminSession>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardAdmin />} />
              <Route path="analytics" element={<AnalyticsAdmin />} />
              <Route path="user" element={<UserAdmin />} />
              <Route path="group" element={<GroupAdmin />} />
              <Route path="model" element={<ModelAdmin />} />
              <Route path="agents" element={<AgentsAdmin />} />
              <Route path="app" element={<AppAdmin />} />
              <Route path="skill" element={<SkillAdmin />} />
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
              <Route path="catalog" element={<Navigate to="/admin/catalog/products" replace />} />
              <Route path="catalog/categories" element={<CatalogAdmin sectionId="categories" />} />
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
              <Route path="memberships/plans" element={<MembershipsAdmin sectionId="plans" />} />
              <Route path="memberships/members" element={<MembershipsAdmin sectionId="members" />} />
              <Route path="memberships/entitlements" element={<MembershipsAdmin sectionId="entitlements" />} />
              <Route path="memberships/recharge-packages" element={<MembershipsAdmin sectionId="rechargePackages" />} />
              <Route path="service-providers" element={<Navigate to="/admin/service-providers/accounts" replace />} />
              <Route path="service-providers/accounts" element={<ServiceProviderAdmin />} />
              <Route path="wallet" element={<Navigate to="/admin/wallet/wallet-accounts" replace />} />
              <Route path="wallet/recharge-packages" element={<WalletAdmin sectionId="rechargePackages" />} />
              <Route path="wallet/recharge-orders" element={<WalletAdmin sectionId="rechargeOrders" />} />
              <Route path="wallet/wallet-accounts" element={<WalletAdmin sectionId="walletAccounts" />} />
              <Route path="wallet/wallet-ledger" element={<WalletAdmin sectionId="walletLedger" />} />
              <Route path="wallet/exchange-rules" element={<WalletAdmin sectionId="exchangeRules" />} />
              <Route path="finance" element={<Navigate to="/admin/finance/order-revenue" replace />} />
              <Route path="finance/invoice-titles" element={<FinanceAdmin sectionId="invoiceTitles" />} />
              <Route path="finance/invoices" element={<FinanceAdmin sectionId="invoices" />} />
              <Route path="finance/coupon-templates" element={<Navigate to="/admin/marketing/coupon-templates" replace />} />
              <Route path="finance/coupon-campaigns" element={<Navigate to="/admin/marketing/coupon-campaigns" replace />} />
              <Route path="finance/coupon-codes" element={<Navigate to="/admin/marketing/coupon-codes" replace />} />
              <Route path="finance/coupon-redemptions" element={<Navigate to="/admin/marketing/coupon-redemptions" replace />} />
              <Route path="finance/payment-reconciliation" element={<FinanceAdmin sectionId="paymentReconciliationReport" />} />
              <Route path="finance/order-revenue" element={<FinanceAdmin sectionId="orderRevenueReport" />} />
              <Route path="finance/refunds-report" element={<FinanceAdmin sectionId="refundsReport" />} />
              <Route path="finance/audit-events" element={<FinanceAdmin sectionId="auditEvents" />} />
              <Route path="marketing" element={<MarketingAdmin />} />
              <Route path="marketing/referrals" element={<MarketingAdmin />} />
              <Route path="marketing/coupon-templates" element={<FinanceAdmin sectionId="couponTemplates" surface="marketing" />} />
              <Route path="marketing/coupon-campaigns" element={<FinanceAdmin sectionId="couponCampaigns" surface="marketing" />} />
              <Route path="marketing/coupon-codes" element={<FinanceAdmin sectionId="couponCodes" surface="marketing" />} />
              <Route path="marketing/coupon-redemptions" element={<FinanceAdmin sectionId="couponRedemptions" surface="marketing" />} />
              <Route path="record" element={<RecordAdmin />} />
              <Route path="monitor" element={<MonitorAdmin />} />
              <Route path="cache" element={<CacheAdmin />} />
              <Route path="ratelimit" element={<RateLimitAdmin />} />
              <Route path="settings" element={<ClawRouterAuthSettingsPage />} />
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
