import React, { useMemo, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Bot,
  Boxes,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Crown,
  Database,
  FileText,
  HardDrive,
  Handshake,
  LayoutDashboard,
  Link2,
  LogOut,
  Megaphone,
  MessageCircle,
  Network,
  Package,
  PackageCheck,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Store,
  TrendingUp,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AdminHeader, getActiveModuleFromPath, type AdminModuleId } from './AdminHeader';
import { revokeAppSession } from 'sdkwork-claw-router-commons/runtime';

type AdminMenuItem = {
  path: string;
  labelKey: string;
  icon: LucideIcon;
  iconColor?: string;
};

type AdminMenuGroup = {
  groupKey: string;
  items: AdminMenuItem[];
};

type AdminModuleMenu = {
  moduleId: AdminModuleId;
  items?: AdminMenuItem[];
  groups: AdminMenuGroup[];
};

const MODULE_MENUS: AdminModuleMenu[] = [
  {
    moduleId: 'home',
    items: [
      { path: '/admin/dashboard', labelKey: 'admin.menu.dashboard', icon: LayoutDashboard },
    ],
    groups: [
      {
        groupKey: 'admin.menu.home.userManagement',
        items: [
          { path: '/admin/user', labelKey: 'admin.menu.users', icon: Users },
        ],
      },
      {
        groupKey: 'admin.menu.home.modelManagement',
        items: [
          { path: '/admin/model', labelKey: 'admin.menu.models', icon: Database },
        ],
      },
      {
        groupKey: 'admin.menu.home.accountPoolManagement',
        items: [
          { path: '/admin/group', labelKey: 'admin.menu.groups', icon: UserCog },
          { path: '/admin/channel', labelKey: 'admin.menu.channels', icon: Network },
        ],
      },
      {
        groupKey: 'admin.menu.home.agentSkills',
        items: [
          { path: '/admin/agents', labelKey: 'admin.menu.agents', icon: Bot },
          { path: '/admin/skill', labelKey: 'admin.menu.agentSkills', icon: Store },
        ],
      },
      {
        groupKey: 'admin.menu.home.dataManagement',
        items: [
          { path: '/admin/record', labelKey: 'admin.menu.records', icon: Activity },
          { path: '/admin/analytics', labelKey: 'admin.menu.analytics', icon: BarChart3 },
        ],
      },
      {
        groupKey: 'admin.menu.home.system',
        items: [
          { path: '/admin/announcement', labelKey: 'admin.menu.announcements', icon: Megaphone },
        ],
      },
    ],
  },
  {
    moduleId: 'appCenter',
    items: [
      { path: '/admin/app', labelKey: 'admin.menu.appStore', icon: Package },
    ],
    groups: [
      {
        groupKey: 'admin.menu.openPlatformOfficialAccounts',
        items: [
          { path: '/admin/open-platform/official-accounts/accounts', labelKey: 'admin.menu.openPlatformOfficialAccountAccounts', icon: MessageCircle, iconColor: 'text-emerald-500' },
          { path: '/admin/open-platform/official-accounts/menus', labelKey: 'admin.menu.openPlatformOfficialAccountMenus', icon: ClipboardList, iconColor: 'text-teal-500' },
          { path: '/admin/open-platform/official-accounts/messages', labelKey: 'admin.menu.openPlatformOfficialAccountMessages', icon: Megaphone, iconColor: 'text-amber-500' },
        ],
      },
      {
        groupKey: 'admin.menu.openPlatformMiniPrograms',
        items: [
          { path: '/admin/open-platform/mini-programs/accounts', labelKey: 'admin.menu.openPlatformMiniProgramAccounts', icon: Smartphone, iconColor: 'text-cyan-500' },
          { path: '/admin/open-platform/mini-programs/urls', labelKey: 'admin.menu.openPlatformMiniProgramUrls', icon: Link2, iconColor: 'text-sky-500' },
        ],
      },
    ],
  },
  {
    moduleId: 'productCenter',
    groups: [
      {
        groupKey: 'admin.menu.productCenter.catalog',
        items: [
          { path: '/admin/catalog/products', labelKey: 'admin.menu.catalogProducts', icon: PackageCheck, iconColor: 'text-blue-500' },
          { path: '/admin/catalog/categories', labelKey: 'admin.menu.catalogCategories', icon: Package, iconColor: 'text-sky-500' },
          { path: '/admin/catalog/skus', labelKey: 'admin.menu.catalogSkus', icon: PackageCheck, iconColor: 'text-indigo-500' },
          { path: '/admin/catalog/attributes', labelKey: 'admin.menu.catalogAttributes', icon: Settings, iconColor: 'text-violet-500' },
          { path: '/admin/catalog/prices', labelKey: 'admin.menu.catalogPrices', icon: CreditCard, iconColor: 'text-amber-500' },
        ],
      },
      {
        groupKey: 'admin.menu.productCenter.inventory',
        items: [
          { path: '/admin/inventory/stocks', labelKey: 'admin.menu.inventoryStocks', icon: Boxes, iconColor: 'text-emerald-500' },
          { path: '/admin/inventory/reservations', labelKey: 'admin.menu.inventoryReservations', icon: ShieldCheck, iconColor: 'text-cyan-500' },
          { path: '/admin/inventory/ledger', labelKey: 'admin.menu.inventoryLedger', icon: FileText, iconColor: 'text-slate-500' },
        ],
      },
    ],
  },
  {
    moduleId: 'transactionCenter',
    groups: [
      {
        groupKey: 'admin.menu.transactionCenter.orders',
        items: [
          { path: '/admin/orders/orders', labelKey: 'admin.menu.orderList', icon: ClipboardList, iconColor: 'text-indigo-500' },
          { path: '/admin/orders/refunds', labelKey: 'admin.menu.orderRefunds', icon: FileText, iconColor: 'text-red-500' },
          { path: '/admin/orders/fulfillments', labelKey: 'admin.menu.orderFulfillments', icon: PackageCheck, iconColor: 'text-emerald-500' },
          { path: '/admin/orders/shipments', labelKey: 'admin.menu.orderShipments', icon: Package, iconColor: 'text-sky-500' },
        ],
      },
      {
        groupKey: 'admin.menu.transactionCenter.payments',
        items: [
          { path: '/admin/payments/provider-accounts', labelKey: 'admin.menu.paymentProviderAccounts', icon: CreditCard, iconColor: 'text-sky-500' },
          { path: '/admin/payments/providers', labelKey: 'admin.menu.paymentProviders', icon: CreditCard, iconColor: 'text-blue-500' },
          { path: '/admin/payments/methods', labelKey: 'admin.menu.paymentMethods', icon: CreditCard, iconColor: 'text-cyan-500' },
          { path: '/admin/payments/channels', labelKey: 'admin.menu.paymentChannels', icon: Network, iconColor: 'text-indigo-500' },
          { path: '/admin/payments/route-rules', labelKey: 'admin.menu.paymentRouteRules', icon: ShieldCheck, iconColor: 'text-amber-500' },
          { path: '/admin/payments/intents', labelKey: 'admin.menu.paymentIntents', icon: ClipboardList, iconColor: 'text-violet-500' },
          { path: '/admin/payments/attempts', labelKey: 'admin.menu.paymentAttempts', icon: Activity, iconColor: 'text-orange-500' },
          { path: '/admin/payments/webhook-events', labelKey: 'admin.menu.paymentWebhookEvents', icon: Megaphone, iconColor: 'text-pink-500' },
          { path: '/admin/payments/reconciliation-runs', labelKey: 'admin.menu.paymentReconciliationRuns', icon: BarChart3, iconColor: 'text-emerald-500' },
        ],
      },
    ],
  },
  {
    moduleId: 'memberCenter',
    groups: [
      {
        groupKey: 'admin.menu.memberCenter.memberships',
        items: [
          { path: '/admin/memberships/packages', labelKey: 'admin.menu.membershipPackages', icon: Package, iconColor: 'text-amber-500' },
          { path: '/admin/memberships/plans', labelKey: 'admin.menu.membershipPlans', icon: Crown, iconColor: 'text-violet-500' },
          { path: '/admin/memberships/members', labelKey: 'admin.menu.membershipMembers', icon: Users, iconColor: 'text-blue-500' },
          { path: '/admin/memberships/entitlements', labelKey: 'admin.menu.membershipEntitlements', icon: ShieldCheck, iconColor: 'text-emerald-500' },
          { path: '/admin/memberships/recharge-packages', labelKey: 'admin.menu.membershipRechargePackages', icon: Package, iconColor: 'text-sky-500' },
        ],
      },
    ],
  },
  {
    moduleId: 'marketingCenter',
    groups: [
      {
        groupKey: 'admin.menu.marketingCenter.growth',
        items: [
          { path: '/admin/marketing/referrals', labelKey: 'admin.menu.marketingReferrals', icon: TrendingUp, iconColor: 'text-pink-500' },
        ],
      },
      {
        groupKey: 'admin.menu.marketingCenter.coupons',
        items: [
          { path: '/admin/marketing/coupon-templates', labelKey: 'admin.menu.financeCouponTemplates', icon: TrendingUp, iconColor: 'text-pink-500' },
          { path: '/admin/marketing/coupon-campaigns', labelKey: 'admin.menu.financeCouponCampaigns', icon: Megaphone, iconColor: 'text-orange-500' },
          { path: '/admin/marketing/coupon-codes', labelKey: 'admin.menu.financeCouponCodes', icon: CreditCard, iconColor: 'text-lobster-500' },
          { path: '/admin/marketing/coupon-redemptions', labelKey: 'admin.menu.financeCouponRedemptions', icon: ClipboardList, iconColor: 'text-emerald-500' },
        ],
      },
    ],
  },
  {
    moduleId: 'financeCenter',
    groups: [
      {
        groupKey: 'admin.menu.financeCenter.wallet',
        items: [
          { path: '/admin/wallet/wallet-accounts', labelKey: 'admin.menu.walletAccounts', icon: CreditCard, iconColor: 'text-emerald-500' },
          { path: '/admin/wallet/wallet-ledger', labelKey: 'admin.menu.walletLedger', icon: FileText, iconColor: 'text-teal-500' },
          { path: '/admin/wallet/recharge-packages', labelKey: 'admin.menu.walletRechargePackages', icon: Package, iconColor: 'text-blue-500' },
          { path: '/admin/wallet/recharge-orders', labelKey: 'admin.menu.walletRechargeOrders', icon: ClipboardList, iconColor: 'text-indigo-500' },
          { path: '/admin/wallet/exchange-rules', labelKey: 'admin.menu.walletExchangeRules', icon: Settings, iconColor: 'text-amber-500' },
        ],
      },
      {
        groupKey: 'admin.menu.financeCenter.invoices',
        items: [
          { path: '/admin/finance/invoice-titles', labelKey: 'admin.menu.financeInvoiceTitles', icon: FileText, iconColor: 'text-slate-500' },
          { path: '/admin/finance/invoices', labelKey: 'admin.menu.financeInvoices', icon: FileText, iconColor: 'text-violet-500' },
        ],
      },
      {
        groupKey: 'admin.menu.financeCenter.reports',
        items: [
          { path: '/admin/finance/order-revenue', labelKey: 'admin.menu.financeOrderRevenue', icon: BarChart3, iconColor: 'text-blue-500' },
          { path: '/admin/finance/payment-reconciliation', labelKey: 'admin.menu.financePaymentReconciliation', icon: CreditCard, iconColor: 'text-cyan-500' },
          { path: '/admin/finance/refunds-report', labelKey: 'admin.menu.financeRefundsReport', icon: FileText, iconColor: 'text-red-500' },
          { path: '/admin/finance/audit-events', labelKey: 'admin.menu.financeAuditEvents', icon: ShieldCheck, iconColor: 'text-slate-500' },
        ],
      },
    ],
  },
  {
    moduleId: 'operations',
    groups: [
      {
        groupKey: 'admin.menu.ops.monitoring',
        items: [
          { path: '/admin/monitor', labelKey: 'admin.menu.monitor', icon: Activity },
        ],
      },
      {
        groupKey: 'admin.menu.ops.security',
        items: [
          { path: '/admin/ratelimit', labelKey: 'admin.menu.rateLimit', icon: ShieldAlert, iconColor: 'text-red-500' },
        ],
      },
      {
        groupKey: 'admin.menu.ops.infrastructure',
        items: [
          { path: '/admin/cache', labelKey: 'admin.menu.cache', icon: HardDrive, iconColor: 'text-emerald-500' },
        ],
      },
      {
        groupKey: 'admin.menu.ops.system',
        items: [
          { path: '/admin/settings', labelKey: 'admin.menu.authSettings', icon: ShieldCheck, iconColor: 'text-blue-500' },
          { path: '/admin/site', labelKey: 'admin.menu.siteSettings', icon: Settings, iconColor: 'text-indigo-500' },
        ],
      },
    ],
  },
  {
    moduleId: 'serviceProviderCenter',
    groups: [
      {
        groupKey: 'admin.menu.serviceProviderCenter.accounts',
        items: [
          { path: '/admin/service-providers/accounts', labelKey: 'admin.menu.serviceProviderAccounts', icon: Handshake, iconColor: 'text-cyan-500' },
        ],
      },
    ],
  },
];

const ADMIN_SIDEBAR_GROUPS_DEFAULT_OPEN = true;

function isSidebarItemActive(pathname: string, item: AdminMenuItem): boolean {
  return pathname === item.path || pathname.startsWith(`${item.path}/`);
}

function SidebarGroup({
  group,
  defaultOpen,
}: {
  group: AdminMenuGroup;
  defaultOpen: boolean;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const hasActiveChild = group.items.some(
    (item) => isSidebarItemActive(location.pathname, item),
  );

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
          hasActiveChild
            ? 'text-lobster-500 dark:text-lobster-400'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
        }`}
        type="button"
      >
        <span>{t(group.groupKey)}</span>
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </button>
      {isOpen && (
        <div className="flex flex-col gap-0.5">
          {group.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-lobster-50 text-lobster-600 dark:bg-lobster-500/10 dark:text-lobster-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className={`w-4 h-4 ${item.iconColor ?? ''}`} />
              {t(item.labelKey)}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarItem({ item }: { item: AdminMenuItem }) {
  const { t } = useTranslation();

  return (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-lobster-50 text-lobster-600 dark:bg-lobster-500/10 dark:text-lobster-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
        }`
      }
    >
      <item.icon className={`w-4 h-4 ${item.iconColor ?? ''}`} />
      {t(item.labelKey)}
    </NavLink>
  );
}

export function AdminLayout({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const activeModule = useMemo<AdminModuleId>(
    () => getActiveModuleFromPath(location.pathname),
    [location.pathname],
  );

  const currentModuleMenu = useMemo(
    () => MODULE_MENUS.find((m) => m.moduleId === activeModule) ?? MODULE_MENUS[0],
    [activeModule],
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-white">
      <AdminHeader
        isDark={isDark}
        toggleTheme={toggleTheme}
        activeModule={activeModule}
        onModuleChange={() => {}}
      />

      <div className="flex flex-1 pt-16">
        <div className="w-64 min-h-0 bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-white/10 flex flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
            {currentModuleMenu.items?.map((item) => (
              <SidebarItem key={item.path} item={item} />
            ))}
            {currentModuleMenu.groups.map((group) => (
              <SidebarGroup
                key={group.groupKey}
                group={group}
                defaultOpen={ADMIN_SIDEBAR_GROUPS_DEFAULT_OPEN}
              />
            ))}
          </div>
          <div className="p-3 border-t border-slate-200 dark:border-white/10 shrink-0">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              onClick={() => {
                void revokeAppSession();
                navigate('/', { replace: true });
              }}
            >
              <LogOut className="w-4 h-4" />
              {t('admin.menu.logout')}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0a0a] min-w-0 relative">
          <div className="flex flex-1 flex-col p-6 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
