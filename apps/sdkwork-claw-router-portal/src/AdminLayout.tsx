import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCog, Network, Megaphone,
  TrendingUp, Activity, Database, LogOut, Search, Settings, Link, ShieldAlert, Store, Package, ShieldCheck
} from 'lucide-react';
import { Navbar } from 'sdkwork-claw-router-commons';
import { revokeAppSession } from 'sdkwork-claw-router-commons/runtime';

const ADMIN_LINKS = [
  { path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: '仪表盘' },
  { path: '/admin/user', icon: <Users className="w-4 h-4" />, label: '用户管理' },
  { path: '/admin/group', icon: <UserCog className="w-4 h-4" />, label: '分组管理' },
  { path: '/admin/model', icon: <Database className="w-4 h-4" />, label: '模型平台管理' },
  { path: '/admin/channel', icon: <Network className="w-4 h-4" />, label: '渠道供应商账号' },
  { path: '/admin/announcement', icon: <Megaphone className="w-4 h-4" />, label: '公告管理' },
  { path: '/admin/marketing', icon: <TrendingUp className="w-4 h-4" />, label: '营销管理' },
  { path: '/admin/finance', icon: <TrendingUp className="w-4 h-4 text-emerald-500" />, label: '财务管理' },
  { path: '/admin/record', icon: <Activity className="w-4 h-4" />, label: '使用记录' },
  { path: '/admin/ratelimit', icon: <ShieldAlert className="w-4 h-4 text-red-500" />, label: '限流与风控' },
  { path: '/admin/settings', icon: <ShieldCheck className="w-4 h-4 text-blue-500" />, label: 'Auth Settings' },
  { path: '/admin/monitor', icon: <Settings className="w-4 h-4" />, label: '运维监控' },
];

ADMIN_LINKS.splice(4, 0, { path: '/admin/skill', icon: <Store className="w-4 h-4" />, label: 'Agent Skills' });
ADMIN_LINKS.splice(4, 0, { path: '/admin/app', icon: <Package className="w-4 h-4" />, label: 'App Store' });

export function AdminLayout({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) {
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
              Admin Backend
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
                {link.label}
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
              退出登录
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
