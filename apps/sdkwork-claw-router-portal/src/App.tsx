import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Footer } from 'sdkwork-claw-router-commons';

const Home = lazyRoute(() => import('sdkwork-claw-router-home'), 'Home');
const Models = lazyRoute(() => import('sdkwork-claw-router-models'), 'Models');
const ModelDetails = lazyRoute(() => import('sdkwork-claw-router-models'), 'ModelDetails');
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
const ClawRouterAuthOAuthCallbackRoute = lazyRoute(() => import('./auth/ClawRouterAuthRoutes'), 'ClawRouterAuthOAuthCallbackRoute');

type ShellLayoutProps = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ConsoleLayout = lazyRoute<ShellLayoutProps>(() => import('sdkwork-claw-router-console-core'), 'ConsoleLayout');
const DashboardView = lazyRoute(() => import('sdkwork-claw-router-console-dashboard'), 'DashboardView');
const UsageView = lazyRoute(() => import('sdkwork-claw-router-console-usage'), 'UsageView');
const GatewayView = lazyRoute(() => import('sdkwork-claw-router-console-gateway'), 'GatewayView');
const RoutingView = lazyRoute(() => import('sdkwork-claw-router-console-routing'), 'RoutingView');
const ApiKeysView = lazyRoute(() => import('sdkwork-claw-router-console-api-keys'), 'ApiKeysView');
const UserView = lazyRoute(() => import('sdkwork-claw-router-console-user'), 'UserView');
const BillingView = lazyRoute(() => import('sdkwork-claw-router-console-billing'), 'BillingView');
const CheckoutView = lazyRoute(() => import('sdkwork-claw-router-console-billing'), 'CheckoutView');
const SettlementsView = lazyRoute(() => import('sdkwork-claw-router-console-settlements'), 'SettlementsView');
const AccountView = lazyRoute(() => import('sdkwork-claw-router-console-account'), 'AccountView');
const SettingsView = lazyRoute(() => import('sdkwork-claw-router-console-settings'), 'SettingsView');
const MessagesView = lazyRoute(() => import('sdkwork-claw-router-console-messages'), 'MessagesView');
const ProvidersView = lazyRoute(() => import('sdkwork-claw-router-console-providers'), 'ProvidersView');
const RechargeView = lazyRoute(() => import('sdkwork-claw-router-console-recharge'), 'RechargeView');

const AdminLayout = lazyRoute<ShellLayoutProps>(() => import('./AdminLayout'), 'AdminLayout');
const DashboardAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-dashboard'), 'DashboardAdmin');
const UserAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-user'), 'UserAdmin');
const GroupAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-group'), 'GroupAdmin');
const ModelAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-model'), 'ModelAdmin');
const SkillAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-skill'), 'SkillAdmin');
const ChannelAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-channel'), 'ChannelAdmin');
const AnnouncementAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-announcement'), 'AnnouncementAdmin');
const MarketingAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-marketing'), 'MarketingAdmin');
const RecordAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-record'), 'RecordAdmin');
const MonitorAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-monitor'), 'MonitorAdmin');
const RateLimitAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-ratelimit'), 'RateLimitAdmin');
const FinanceAdmin = lazyRoute(() => import('sdkwork-claw-router-admin-finance'), 'FinanceAdmin');

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
        </Routes>
      </div>
      {!isPlayground && <Footer />}
    </>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col selection:bg-lobster-500/30">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/auth/login" element={<ClawRouterAuthRoutes />} />
            <Route path="/auth/register" element={<ClawRouterAuthRoutes />} />
            <Route path="/auth/forgot-password" element={<ClawRouterAuthRoutes />} />
            <Route path="/auth/oauth/callback/:provider" element={<ClawRouterAuthOAuthCallbackRoute />} />

            <Route path="/apps/:id" element={<AppDetails />} />
            <Route path="/skills-hub/:id" element={<SkillDetails />} />

            {/* Console Routes - standalone structure with global Navbar */}
            <Route path="/console" element={<ConsoleLayout isDark={isDark} toggleTheme={toggleTheme} />}>
              <Route index element={<Navigate to="/console/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="usage" element={<UsageView />} />
              <Route path="gateway" element={<GatewayView />} />
              <Route path="routing" element={<RoutingView />} />
              <Route path="api-keys" element={<ApiKeysView />} />
              <Route path="user" element={<UserView />} />
              <Route path="billing" element={<BillingView />} />
              <Route path="checkout" element={<CheckoutView />} />
              <Route path="settlements" element={<SettlementsView />} />
              <Route path="account" element={<AccountView />} />
              <Route path="recharge" element={<RechargeView />} />
              <Route path="settings" element={<SettingsView />} />
              <Route path="messages" element={<MessagesView />} />
              <Route path="providers" element={<ProvidersView />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout isDark={isDark} toggleTheme={toggleTheme} />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardAdmin />} />
              <Route path="user" element={<UserAdmin />} />
              <Route path="group" element={<GroupAdmin />} />
              <Route path="model" element={<ModelAdmin />} />
              <Route path="app" element={<AppAdmin />} />
              <Route path="skill" element={<SkillAdmin />} />
              <Route path="channel" element={<ChannelAdmin />} />
              <Route path="announcement" element={<AnnouncementAdmin />} />
              <Route path="marketing" element={<MarketingAdmin />} />
              <Route path="record" element={<RecordAdmin />} />
              <Route path="monitor" element={<MonitorAdmin />} />
              <Route path="ratelimit" element={<RateLimitAdmin />} />
              <Route path="finance" element={<FinanceAdmin />} />
            </Route>

            <Route path="*" element={<MainLayout isDark={isDark} toggleTheme={toggleTheme} />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
