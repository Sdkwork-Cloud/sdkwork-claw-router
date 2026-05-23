import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  ChevronDown,
  CircleDollarSign,
  Crown,
  Globe,
  Handshake,
  Home,
  Megaphone,
  Menu,
  Moon,
  Package,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sun,
  Terminal,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  buildPortalAuthLoginRedirect,
  hasStoredPortalSession,
  subscribePortalSessionChange,
} from 'sdkwork-claw-router-commons/runtime';
import { useSiteBranding } from 'sdkwork-claw-router-commons/runtime';

export type AdminModuleId = 'home' | 'appCenter' | 'productCenter' | 'transactionCenter' | 'memberCenter' | 'marketingCenter' | 'financeCenter' | 'operations' | 'serviceProviderCenter';

interface AdminHeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  activeModule: AdminModuleId;
  onModuleChange: (moduleId: AdminModuleId) => void;
}

interface AdminModuleDef {
  id: AdminModuleId;
  nameKey: string;
  icon: LucideIcon;
  defaultPath: string;
  pathPrefixes: string[];
}

export const ADMIN_MODULES: AdminModuleDef[] = [
  {
    id: 'home',
    nameKey: 'admin.header.home',
    icon: Home,
    defaultPath: '/admin/dashboard',
    pathPrefixes: ['/admin/dashboard', '/admin/user', '/admin/group', '/admin/model', '/admin/agents', '/admin/skill', '/admin/channel', '/admin/record', '/admin/analytics', '/admin/announcement'],
  },
  {
    id: 'appCenter',
    nameKey: 'admin.header.appCenter',
    icon: Package,
    defaultPath: '/admin/app',
    pathPrefixes: ['/admin/app', '/admin/open-platform'],
  },
  {
    id: 'productCenter',
    nameKey: 'admin.header.productCenter',
    icon: ShoppingBag,
    defaultPath: '/admin/catalog/products',
    pathPrefixes: ['/admin/catalog', '/admin/inventory'],
  },
  {
    id: 'transactionCenter',
    nameKey: 'admin.header.transactionCenter',
    icon: ShoppingCart,
    defaultPath: '/admin/orders/orders',
    pathPrefixes: ['/admin/orders', '/admin/payments'],
  },
  {
    id: 'memberCenter',
    nameKey: 'admin.header.memberCenter',
    icon: Crown,
    defaultPath: '/admin/memberships/packages',
    pathPrefixes: ['/admin/memberships'],
  },
  {
    id: 'marketingCenter',
    nameKey: 'admin.header.marketingCenter',
    icon: Megaphone,
    defaultPath: '/admin/marketing/referrals',
    pathPrefixes: ['/admin/marketing'],
  },
  {
    id: 'financeCenter',
    nameKey: 'admin.header.financeCenter',
    icon: CircleDollarSign,
    defaultPath: '/admin/finance/order-revenue',
    pathPrefixes: ['/admin/finance', '/admin/wallet'],
  },
  {
    id: 'operations',
    nameKey: 'admin.header.operations',
    icon: Wrench,
    defaultPath: '/admin/monitor',
    pathPrefixes: ['/admin/ratelimit', '/admin/monitor', '/admin/cache', '/admin/settings', '/admin/site'],
  },
  {
    id: 'serviceProviderCenter',
    nameKey: 'admin.header.serviceProviderCenter',
    icon: Handshake,
    defaultPath: '/admin/service-providers/accounts',
    pathPrefixes: ['/admin/service-providers'],
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

export function AdminHeader({ isDark, toggleTheme, activeModule, onModuleChange }: AdminHeaderProps) {
  const { t, i18n } = useTranslation();
  const siteBranding = useSiteBranding();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isPortalSessionStored, setIsPortalSessionStored] = useState(() => hasStoredPortalSession());
  const langMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const displaySiteName = siteBranding.shortName || siteBranding.siteName;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncPortalSessionState = () => setIsPortalSessionStored(hasStoredPortalSession());
    syncPortalSessionState();
    return subscribePortalSessionChange(syncPortalSessionState);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lang: string) => {
    localStorage.setItem('user_explicit_lang', lang);
    localStorage.removeItem('i18nextLng');
    i18n.changeLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const handleModuleClick = (mod: AdminModuleDef) => {
    onModuleChange(mod.id);
    navigate(mod.defaultPath);
  };

  const handleSignIn = () => {
    navigate(buildPortalAuthLoginRedirect(location));
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: t('admin.header.lang.zh', '中文') },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 py-3 backdrop-blur-md dark:bg-slate-950/95'
          : 'bg-slate-900 py-4 dark:bg-slate-950'
      }`}
    >
      <div className="mx-auto flex w-full items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              {siteBranding.logoUrl ? (
                <img src={siteBranding.logoUrl} alt={siteBranding.siteName} className="h-5 w-5 object-contain" />
              ) : (
                <Terminal className="h-5 w-5 text-white" />
              )}
            </div>
            <span className="text-xl font-bold tracking-tight text-white">{displaySiteName}</span>
          </Link>
          <div className="hidden items-center gap-1.5 md:flex">
            <span className="flex items-center gap-1.5 rounded-md bg-lobster-500/20 px-2.5 py-1 text-xs font-bold text-lobster-400">
              <Shield className="h-3.5 w-3.5" />
              {t('admin.header.badge', 'Admin')}
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {ADMIN_MODULES.map((mod) => {
            const isActive = activeModule === mod.id;
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => handleModuleClick(mod)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                type="button"
              >
                <Icon className="h-4 w-4" />
                {t(mod.nameKey)}
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              type="button"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium uppercase">{i18n.resolvedLanguage || 'EN'}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isLangMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-50 mt-2 w-32 overflow-hidden bg-slate-800 py-1 shadow-lg ring-1 ring-white/10"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-white/10"
                      type="button"
                    >
                      <span className={i18n.resolvedLanguage === lang.code ? 'font-medium text-lobster-400' : 'text-slate-300'}>
                        {lang.name}
                      </span>
                      {i18n.resolvedLanguage === lang.code ? <Check className="h-4 w-4 text-lobster-400" /> : null}
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleTheme}
            className="text-slate-300 transition-colors hover:text-white"
            type="button"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {!isPortalSessionStored ? (
            <button
              onClick={handleSignIn}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              type="button"
            >
              {t('admin.header.signIn', 'Sign In')}
            </button>
          ) : (
            <Link
              to="/console"
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              {t('admin.header.console', 'Console')}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button onClick={toggleTheme} className="text-slate-300" type="button">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            className="text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 top-full flex flex-col gap-3 bg-slate-900 p-6 shadow-2xl md:hidden"
        >
          {ADMIN_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                onClick={() => { handleModuleClick(mod); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 text-base font-medium ${
                  activeModule === mod.id ? 'text-lobster-400' : 'text-slate-300 hover:text-white'
                }`}
                type="button"
              >
                <Icon className="h-5 w-5" />
                {t(mod.nameKey)}
              </button>
            );
          })}
          <div className="my-2 h-px bg-white/10" />
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Language</span>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { changeLanguage(lang.code); setMobileMenuOpen(false); }}
                className="flex items-center justify-between text-left text-base font-medium"
                type="button"
              >
                <span className={i18n.resolvedLanguage === lang.code ? 'text-lobster-400' : 'text-slate-300'}>
                  {lang.name}
                </span>
                {i18n.resolvedLanguage === lang.code ? <Check className="h-4 w-4 text-lobster-400" /> : null}
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}
