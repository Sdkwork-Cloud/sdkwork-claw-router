import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCog, Network, Megaphone,
  TrendingUp, Activity, Database, LogOut, Settings, ShieldAlert, Store, Package, ShieldCheck, Bot
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navbar } from 'sdkwork-claw-router-commons';
import { revokeAppSession } from 'sdkwork-claw-router-commons/runtime';

const ADMIN_LINKS = [
  { path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, labelKey: 'admin.layout.links.dashboard' },
  { path: '/admin/user', icon: <Users className="w-4 h-4" />, labelKey: 'admin.layout.links.users' },
  { path: '/admin/group', icon: <UserCog className="w-4 h-4" />, labelKey: 'admin.layout.links.groups' },
  { path: '/admin/model', icon: <Database className="w-4 h-4" />, labelKey: 'admin.layout.links.models' },
  { path: '/admin/agents', icon: <Bot className="w-4 h-4" />, labelKey: 'admin.layout.links.agents' },
  { path: '/admin/app', icon: <Package className="w-4 h-4" />, labelKey: 'admin.layout.links.appStore' },
  { path: '/admin/skill', icon: <Store className="w-4 h-4" />, labelKey: 'admin.layout.links.agentSkills' },
  { path: '/admin/channel', icon: <Network className="w-4 h-4" />, labelKey: 'admin.layout.links.channels' },
  { path: '/admin/announcement', icon: <Megaphone className="w-4 h-4" />, labelKey: 'admin.layout.links.announcements' },
  { path: '/admin/marketing', icon: <TrendingUp className="w-4 h-4" />, labelKey: 'admin.layout.links.marketing' },
  { path: '/admin/finance', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, labelKey: 'admin.layout.links.finance' },
  { path: '/admin/record', icon: <Activity className="w-4 h-4" />, labelKey: 'admin.layout.links.records' },
  { path: '/admin/ratelimit', icon: <ShieldAlert className="w-4 h-4 text-red-500" />, labelKey: 'admin.layout.links.rateLimit' },
  { path: '/admin/settings', icon: <ShieldCheck className="w-4 h-4 text-blue-500" />, labelKey: 'admin.layout.links.authSettings' },
  { path: '/admin/monitor', icon: <Settings className="w-4 h-4" />, labelKey: 'admin.layout.links.monitor' },
];

export function AdminLayout({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black font-sans text-slate-900 dark:text-white">
      {/* Re-use main navbar but maybe with an Admin Badge? */}
      <div className="sticky top-0 z-50">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Admin Sidebar */}
        <div className="w-64 bg-white dark:bg-[#121212] border-r border-slate-200 dark:border-white/10 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest shrink-0 gap-2 flex items-center">
              <span className="bg-red-500 w-2 h-2 rounded-full inline-block"></span>
              {t('admin.layout.title')}
            </h2>
          </div>
          <div className="flex-1 py-4 flex flex-col gap-1 px-3">
            {ADMIN_LINKS.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {link.icon}
                {t(link.labelKey)}
              </NavLink>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-white/10 shrink-0">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              onClick={() => {
                void revokeAppSession();
                navigate('/', { replace: true });
              }}
            >
              <LogOut className="w-4 h-4" />
              {t('admin.layout.logout')}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0a0a] min-w-0 overflow-y-auto relative">
          <div className="flex-1 p-6 md:p-8 flex flex-col min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
