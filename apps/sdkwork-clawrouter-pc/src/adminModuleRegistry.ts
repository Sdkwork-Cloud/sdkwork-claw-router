import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Boxes,
  Building2,
  ClipboardList,
  CreditCard,
  Database,
  FileText,
  Globe2,
  HardDrive,
  Handshake,
  Home,
  KeyRound,
  LayoutDashboard,
  Network,
  Server,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type AdminModuleId =
  | 'home'
  | 'operations'
  | 'serviceProviderCenter';

export interface AdminModuleDef {
  id: AdminModuleId;
  nameKey: string;
  icon: LucideIcon;
  defaultPath: string;
  pathPrefixes: string[];
}

export type AdminMenuItem = {
  path: string;
  labelKey: string;
  icon: LucideIcon;
  iconColor?: string;
};

export type AdminMenuGroup = {
  groupKey: string;
  items: AdminMenuItem[];
};

export type AdminModuleMenu = {
  moduleId: AdminModuleId;
  items?: AdminMenuItem[];
  groups: AdminMenuGroup[];
};

function moduleBlock(definition: AdminModuleDef): AdminModuleDef {
  return definition;
}

function groupBlock(groupKey: string, items: AdminMenuItem[]): AdminMenuGroup {
  return { groupKey, items };
}

function itemBlock(item: AdminMenuItem): AdminMenuItem {
  return item;
}

export const ADMIN_MODULES: AdminModuleDef[] = [
  moduleBlock({
    id: 'home',
    nameKey: 'admin.header.home',
    icon: Home,
    defaultPath: '/admin/dashboard',
    pathPrefixes: ['/admin/dashboard', '/admin/user', '/admin/organization', '/admin/group', '/admin/model', '/admin/prompts', '/admin/mcp', '/admin/channel', '/admin/record', '/admin/analytics'],
  }),
  moduleBlock({
    id: 'operations',
    nameKey: 'admin.header.operations',
    icon: Wrench,
    defaultPath: '/admin/monitor',
    pathPrefixes: ['/admin/ratelimit', '/admin/monitor', '/admin/cache', '/admin/service-nodes', '/admin/settings', '/admin/runtime-region', '/admin/site'],
  }),
  moduleBlock({
    id: 'serviceProviderCenter',
    nameKey: 'admin.header.serviceProviderCenter',
    icon: Handshake,
    defaultPath: '/admin/service-providers/dashboard',
    pathPrefixes: ['/admin/service-providers'],
  }),
];

export const ADMIN_MODULE_MENUS: AdminModuleMenu[] = [
  {
    moduleId: 'home',
    items: [
      itemBlock({ path: '/admin/dashboard', labelKey: 'admin.menu.dashboard', icon: LayoutDashboard }),
    ],
    groups: [
      groupBlock('admin.menu.home.userManagement', [
        itemBlock({ path: '/admin/user', labelKey: 'admin.menu.users', icon: Users }),
        itemBlock({ path: '/admin/organization', labelKey: 'admin.menu.organization', icon: Building2, iconColor: 'text-blue-500' }),
      ]),
      groupBlock('admin.menu.home.modelManagement', [
        itemBlock({ path: '/admin/model', labelKey: 'admin.menu.models', icon: Database }),
        itemBlock({ path: '/admin/model/resources', labelKey: 'admin.menu.modelResources', icon: Boxes, iconColor: 'text-emerald-500' }),
        itemBlock({ path: '/admin/model/sites', labelKey: 'admin.menu.modelSites', icon: Globe2, iconColor: 'text-sky-500' }),
        itemBlock({ path: '/admin/model/mappings', labelKey: 'admin.menu.modelMappings', icon: ArrowRightLeft, iconColor: 'text-indigo-500' }),
      ]),
      groupBlock('admin.menu.home.accountPoolManagement', [
        itemBlock({ path: '/admin/group', labelKey: 'admin.menu.groups', icon: UserCog }),
        itemBlock({ path: '/admin/channel', labelKey: 'admin.menu.channels', icon: Network }),
      ]),
      groupBlock('admin.menu.home.agentSkills', [
        itemBlock({ path: '/admin/prompts', labelKey: 'admin.menu.prompts', icon: FileText, iconColor: 'text-violet-500' }),
        itemBlock({ path: '/admin/mcp', labelKey: 'admin.menu.mcp', icon: Server, iconColor: 'text-cyan-500' }),
      ]),
      groupBlock('admin.menu.home.dataManagement', [
        itemBlock({ path: '/admin/record', labelKey: 'admin.menu.records', icon: Activity }),
        itemBlock({ path: '/admin/analytics', labelKey: 'admin.menu.analytics', icon: BarChart3 }),
      ]),
    ],
  },
  {
    moduleId: 'operations',
    groups: [
      groupBlock('admin.menu.ops.monitoring', [
        itemBlock({ path: '/admin/monitor', labelKey: 'admin.menu.monitor', icon: Activity }),
      ]),
      groupBlock('admin.menu.ops.security', [
        itemBlock({ path: '/admin/ratelimit', labelKey: 'admin.menu.rateLimit', icon: ShieldAlert, iconColor: 'text-red-500' }),
      ]),
      groupBlock('admin.menu.ops.infrastructure', [
        itemBlock({ path: '/admin/service-nodes', labelKey: 'admin.menu.serviceNodes', icon: Server, iconColor: 'text-cyan-500' }),
        itemBlock({ path: '/admin/cache', labelKey: 'admin.menu.cache', icon: HardDrive, iconColor: 'text-emerald-500' }),
      ]),
      groupBlock('admin.menu.ops.system', [
        itemBlock({ path: '/admin/settings', labelKey: 'admin.menu.authSettings', icon: ShieldCheck, iconColor: 'text-blue-500' }),
        itemBlock({ path: '/admin/runtime-region', labelKey: 'admin.menu.runtimeRegion', icon: Globe2, iconColor: 'text-cyan-500' }),
        itemBlock({ path: '/admin/site', labelKey: 'admin.menu.siteSettings', icon: Settings, iconColor: 'text-indigo-500' }),
      ]),
    ],
  },
  {
    moduleId: 'serviceProviderCenter',
    groups: [
      groupBlock('admin.menu.serviceProviderCenter.operations', [
        itemBlock({ path: '/admin/service-providers/dashboard', labelKey: 'admin.menu.serviceProvider.dashboard', icon: LayoutDashboard, iconColor: 'text-blue-500' }),
        itemBlock({ path: '/admin/service-providers/providers', labelKey: 'admin.menu.serviceProvider.providers', icon: Handshake, iconColor: 'text-cyan-500' }),
        itemBlock({ path: '/admin/service-providers/relations', labelKey: 'admin.menu.serviceProvider.relations', icon: Network, iconColor: 'text-violet-500' }),
        itemBlock({ path: '/admin/service-providers/downstreams', labelKey: 'admin.menu.serviceProvider.downstreams', icon: Users, iconColor: 'text-emerald-500' }),
      ]),
      groupBlock('admin.menu.serviceProviderCenter.governance', [
        itemBlock({ path: '/admin/service-providers/members', labelKey: 'admin.menu.serviceProvider.members', icon: UserCog, iconColor: 'text-sky-500' }),
        itemBlock({ path: '/admin/service-providers/bindings', labelKey: 'admin.menu.serviceProvider.bindings', icon: KeyRound, iconColor: 'text-amber-500' }),
        itemBlock({ path: '/admin/service-providers/contracts', labelKey: 'admin.menu.serviceProvider.contracts', icon: FileText, iconColor: 'text-slate-500' }),
        itemBlock({ path: '/admin/service-providers/pricing', labelKey: 'admin.menu.serviceProvider.pricing', icon: CreditCard, iconColor: 'text-lobster-500' }),
      ]),
      groupBlock('admin.menu.serviceProviderCenter.finance', [
        itemBlock({ path: '/admin/service-providers/usage', labelKey: 'admin.menu.serviceProvider.usage', icon: Activity, iconColor: 'text-indigo-500' }),
        itemBlock({ path: '/admin/service-providers/wallet', labelKey: 'admin.menu.serviceProvider.wallet', icon: CreditCard, iconColor: 'text-emerald-500' }),
        itemBlock({ path: '/admin/service-providers/statements', labelKey: 'admin.menu.serviceProvider.statements', icon: ClipboardList, iconColor: 'text-blue-500' }),
        itemBlock({ path: '/admin/service-providers/reconciliation', labelKey: 'admin.menu.serviceProvider.reconciliation', icon: BarChart3, iconColor: 'text-teal-500' }),
        itemBlock({ path: '/admin/service-providers/adjustments', labelKey: 'admin.menu.serviceProvider.adjustments', icon: FileText, iconColor: 'text-orange-500' }),
      ]),
      groupBlock('admin.menu.serviceProviderCenter.control', [
        itemBlock({ path: '/admin/service-providers/risk', labelKey: 'admin.menu.serviceProvider.risk', icon: ShieldAlert, iconColor: 'text-red-500' }),
        itemBlock({ path: '/admin/service-providers/audit', labelKey: 'admin.menu.serviceProvider.audit', icon: ShieldCheck, iconColor: 'text-slate-500' }),
      ]),
    ],
  },
];

export function getActiveModuleFromPath(pathname: string): AdminModuleId {
  for (const mod of ADMIN_MODULES) {
    if (mod.pathPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      return mod.id;
    }
  }
  return 'home';
}

export function getAdminModuleMenu(moduleId: AdminModuleId): AdminModuleMenu {
  return ADMIN_MODULE_MENUS.find((menu) => menu.moduleId === moduleId) ?? ADMIN_MODULE_MENUS[0];
}
