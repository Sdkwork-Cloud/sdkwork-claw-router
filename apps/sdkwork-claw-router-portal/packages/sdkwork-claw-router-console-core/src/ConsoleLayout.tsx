import React, { useState, useCallback, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Key, CreditCard,
  FileText, Settings, LogOut, ChevronLeft, ChevronRight, Bell, ShieldCheck, User, Box, Network
} from 'lucide-react';

import { Navbar } from 'sdkwork-claw-router-commons';
import { revokeAppSession } from 'sdkwork-claw-router-commons/runtime';

const mainNavigation = [
  { name: '仪表盘', path: '/console/dashboard', icon: LayoutDashboard },
  { name: '令牌管理', path: '/console/api-keys', icon: Key },
  { name: '调用统计', path: '/console/usage', icon: Activity },
  { name: '钱包与充值', path: '/console/billing', icon: CreditCard },
  { name: '账单与报表', path: '/console/settlements', icon: FileText },
  { name: '消息中心', path: '/console/messages', icon: Bell },
  { name: '工具配置', path: '/console/providers', icon: Box },
  { name: '本地路由', path: '/console/routing', icon: Network },
  { name: '账户详情', path: '/console/account', icon: User },
];

export interface ConsoleContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

interface ConsoleLayoutProps {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export function ConsoleLayout({ isDark, toggleTheme, setTheme }: ConsoleLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 180 && newWidth < 480) {
        setSidebarWidth(newWidth);
        setSidebarOpen(true);
      } else if (newWidth <= 180) {
        setSidebarOpen(false);
      }
    }
  }, [isResizing]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const currentWidth = sidebarOpen ? sidebarWidth : 80;

  const handleLogout = useCallback(() => {
    void revokeAppSession();
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212] flex flex-col selection:bg-lobster-500/30">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <div className="flex-1 flex pt-[72px]">
        {/* Sidebar */}
        <div
          style={{ width: `${currentWidth}px` }}
          className={`shrink-0 bg-white dark:bg-[#1e1e1e] border-r border-slate-200 dark:border-white/5 flex flex-col relative z-20 group ${!isResizing && 'transition-all duration-300'}`}
        >

          {/* Drag & Collapse Handle */}
          <div
            className={`absolute right-0 top-0 w-2 h-full cursor-col-resize z-50 flex items-center justify-center transition-colors ${isResizing ? 'bg-lobster-500' : 'hover:bg-lobster-500/50 opacity-0 group-hover:opacity-100'}`}
            onMouseDown={startResizing}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
                if (!sidebarOpen) {
                  setSidebarWidth(256); // Reset to default when opening
                }
              }}
              className="absolute -right-3.5 p-1 bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-full shadow-md text-slate-500 hover:text-lobster-500 hover:border-lobster-500/50 dark:hover:border-lobster-500/50 opacity-0 group-hover:opacity-100 transition-all z-50 cursor-pointer flex items-center justify-center"
            >
              {sidebarOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Main Nav */}
          <nav className="flex-1 overflow-y-auto pt-6 pb-6 px-3 flex flex-col gap-1 custom-scrollbar">
            {mainNavigation.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                    ? 'bg-blue-50 dark:bg-white/10 text-lobster-600 dark:text-white font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title={!sidebarOpen ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-lobster-600 dark:text-white' : ''}`} />
                  <div className="overflow-hidden whitespace-nowrap">
                    {sidebarOpen && <span>{item.name}</span>}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Settings & Logout Nav */}
          <div className="p-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-1 overflow-hidden">
             <Link
                to="/console/settings"
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                title={!sidebarOpen ? "配置中心" : undefined}
              >
                <Settings className="w-5 h-5 shrink-0" />
                <div className="overflow-hidden whitespace-nowrap">
                  {sidebarOpen && <span>配置中心</span>}
                </div>
             </Link>
             <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                title={!sidebarOpen ? "退出登录" : undefined}
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <div className="overflow-hidden whitespace-nowrap">
                  {sidebarOpen && <span>退出登录</span>}
                </div>
             </button>
          </div>
        </div>

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 max-h-[calc(100vh-72px)] overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-[#121212]">
          <main className="flex-1">
            <Outlet context={{ isDark, toggleTheme, setTheme }} />
          </main>
        </div>

      </div>
    </div>
  );
}
