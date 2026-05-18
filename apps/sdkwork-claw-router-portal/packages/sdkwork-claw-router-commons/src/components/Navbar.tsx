import { useCallback, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, ChevronDown, Terminal, Sun, Moon, Globe, Check, Github, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  buildPortalAuthLoginRedirect,
  hasStoredPortalSession,
  subscribePortalSessionChange,
} from '../portal-auth.ts';
import {
  NotificationService,
  type NotificationItem,
} from '../notificationService.ts';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMessageMenuOpen, setIsMessageMenuOpen] = useState(false);
  const [isPortalSessionStored, setIsPortalSessionStored] = useState(() => hasStoredPortalSession());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsLoadError, setNotificationsLoadError] = useState<string | null>(null);
  const [hasLoadedNotifications, setHasLoadedNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [popupNotificationQueue, setPopupNotificationQueue] = useState<NotificationItem[]>([]);
  const [activePopupNotification, setActivePopupNotification] = useState<NotificationItem | null>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const messageMenuRef = useRef<HTMLDivElement>(null);
  const dismissedPopupNotificationIdsRef = useRef<Set<string>>(new Set());
  const location = useLocation();
  const navigate = useNavigate();
  const isConsolePath = location.pathname.startsWith('/console');
  const shouldShowAuthenticatedActions = isPortalSessionStored || isConsolePath;

  const loadNotifications = useCallback(async (isActive: () => boolean = () => true) => {
    if (!shouldShowAuthenticatedActions) {
      return;
    }

    setNotificationsLoading(true);
    setNotificationsLoadError(null);
    try {
      const data = await NotificationService.fetchNotifications();
      if (isActive()) {
        setNotifications(data);
        setHasLoadedNotifications(true);
        const popupCandidates = data.filter(
          (item) => item.showAsPopup && !item.read && !dismissedPopupNotificationIdsRef.current.has(item.id),
        );
        setPopupNotificationQueue(popupCandidates);
      }
    } catch (error) {
      if (isActive()) {
        setNotificationsLoadError(getNotificationLoadErrorMessage(error));
        setHasLoadedNotifications(true);
      }
    } finally {
      if (isActive()) {
        setNotificationsLoading(false);
      }
    }
  }, [shouldShowAuthenticatedActions]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncPortalSessionState = () => {
      setIsPortalSessionStored(hasStoredPortalSession());
    };

    syncPortalSessionState();
    return subscribePortalSessionChange(syncPortalSessionState);
  }, []);

  useEffect(() => {
    if (!shouldShowAuthenticatedActions) {
      setNotifications([]);
      setNotificationsLoadError(null);
      setHasLoadedNotifications(false);
      setSelectedNotification(null);
      setPopupNotificationQueue([]);
      setActivePopupNotification(null);
      return;
    }

    let active = true;
    void loadNotifications(() => active);
    return () => {
      active = false;
    };
  }, [loadNotifications, shouldShowAuthenticatedActions]);

  useEffect(() => {
    if (activePopupNotification || popupNotificationQueue.length === 0) {
      return;
    }
    const [nextPopup, ...remainingPopups] = popupNotificationQueue;
    setActivePopupNotification(nextPopup);
    setPopupNotificationQueue(remainingPopups);
  }, [activePopupNotification, popupNotificationQueue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (messageMenuRef.current && !messageMenuRef.current.contains(event.target as Node)) {
        setIsMessageMenuOpen(false);
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

  const handleSignIn = () => {
    navigate(buildPortalAuthLoginRedirect(location));
  };

  const closeNotificationDetail = () => {
    setSelectedNotification(null);
  };

  const closeActivePopupNotification = () => {
    if (activePopupNotification) {
      dismissedPopupNotificationIdsRef.current.add(activePopupNotification.id);
    }
    setActivePopupNotification(null);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: t('commons.navbar.language.zh', '中文') }
  ];

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.models'), href: '/models' },
    { name: t('nav.rankings'), href: '/rankings' },
    { name: t('nav.apps'), href: '/apps' },
    { name: t('nav.skills'), href: '/skills-hub' },
    { name: t('nav.productDocs'), href: '/product-docs' },
    { name: t('nav.docs'), href: '/docs' },
    { name: t('nav.api'), href: '/api-reference' },
    { name: t('nav.sdk'), href: '/sdk-reference' },
    { name: t('nav.forum'), href: '/forum' },
    { name: t('nav.courses'), href: '/courses' },
    { name: 'Playground', href: '/playground' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
            <Terminal className="w-5 h-5 text-white dark:text-slate-900" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Claw Router
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'text-lobster-500 dark:text-white'
                    : 'text-slate-600 hover:text-lobster-500 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-lobster-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com/Sdkwork-Cloud/sdkwork-claw-router.git"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-lobster-500 dark:text-slate-300 dark:hover:text-white transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="text-slate-600 hover:text-lobster-500 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium uppercase">{i18n.resolvedLanguage || 'EN'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg py-1 z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <span className={i18n.resolvedLanguage === lang.code ? 'text-lobster-500 font-medium' : 'text-slate-700 dark:text-slate-300'}>
                        {lang.name}
                      </span>
                      {i18n.resolvedLanguage === lang.code && <Check className="w-4 h-4 text-lobster-500" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={toggleTheme} className="text-slate-600 hover:text-lobster-500 dark:text-slate-300 dark:hover:text-white transition-colors">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {!shouldShowAuthenticatedActions ? (
            <>
              <button
                onClick={handleSignIn}
                className="text-sm font-medium text-slate-600 hover:text-lobster-500 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                {t('nav.signin')}
              </button>
              <Link to="/console" className="text-sm font-medium bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-1">
                {t('nav.console')} <ChevronRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative" ref={messageMenuRef}>
                <button
                  onClick={() => {
                    const nextOpen = !isMessageMenuOpen;
                    setIsMessageMenuOpen(nextOpen);
                    if (nextOpen && !notificationsLoading) {
                      void loadNotifications();
                    }
                  }}
                  className="relative text-slate-600 hover:text-lobster-500 dark:text-slate-300 dark:hover:text-white transition-colors p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#050505]"></span>
                  )}
                </button>
                <AnimatePresence>
                  {isMessageMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/[0.02]">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t('commons.navbar.notificationCenter', '通知中心')}</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar flex flex-col">
                        {notificationsLoading && !hasLoadedNotifications ? (
                          <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            {t('commons.navbar.loadingNotifications', '正在加载通知...')}
                          </div>
                        ) : notificationsLoadError ? (
                          <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                            <p className="mb-3">{notificationsLoadError}</p>
                            <button
                              onClick={() => void loadNotifications()}
                              className="text-xs font-semibold text-lobster-500 hover:text-lobster-600"
                            >
                              {t('commons.navbar.retryNotifications', '重试')}
                            </button>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            {t('commons.navbar.emptyNotifications', '暂无通知')}
                          </div>
                        ) : notifications.map((note) => (
                          <div
                            key={note.id}
                            onClick={() => { setSelectedNotification(note); setIsMessageMenuOpen(false); }}
                            className="p-4 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3 relative"
                          >
                             {!note.read && <div className="absolute left-2 top-4.5 w-1.5 h-1.5 rounded-full bg-lobster-500"></div>}
                             <div className="flex-1 pl-2">
                               <div className="flex justify-between items-start mb-1">
                                 <h4 className={`text-sm ${note.read ? 'text-slate-600 dark:text-slate-400 font-medium' : 'text-slate-800 dark:text-slate-200 font-bold'}`}>{note.title}</h4>
                               </div>
                               <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{note.desc}</p>
                               <span className="text-[10px] text-slate-400">{note.time}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 border-t border-slate-100 dark:border-white/5 text-center bg-slate-50 dark:bg-[#1a1a1a]">
                        <Link
                          to="/console/notifications"
                          onClick={() => setIsMessageMenuOpen(false)}
                          className="text-xs font-semibold text-lobster-500 hover:text-lobster-600 p-2 block w-full hover:bg-blue-50 dark:hover:bg-lobster-500/10 rounded-lg transition-colors"
                        >
                          {t('commons.navbar.viewAllNotifications', '前往通知中心查看全部')}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Avatar Menu Dropdown Removed */}
              {!isConsolePath && (
                <Link to="/console" className="text-sm font-medium bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-1">
                  {t('nav.console')} <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-300">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            className="text-slate-600 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white dark:bg-[#0a0a0a] border-b border-slate-200 dark:border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-base font-medium text-slate-600 dark:text-slate-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Language</span>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { changeLanguage(lang.code); setMobileMenuOpen(false); }}
                className="text-base font-medium text-left flex items-center justify-between"
              >
                <span className={i18n.resolvedLanguage === lang.code ? 'text-lobster-500' : 'text-slate-600 dark:text-slate-300'}>
                  {lang.name}
                </span>
                {i18n.resolvedLanguage === lang.code && <Check className="w-4 h-4 text-lobster-500" />}
              </button>
            ))}
          </div>
          <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />
          <a
            href="https://github.com/Sdkwork-Cloud/sdkwork-claw-router.git"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Github className="w-5 h-5" /> GitHub Repository
          </a>
          {!shouldShowAuthenticatedActions ? (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignIn();
                }}
                className="text-base font-medium text-slate-600 dark:text-slate-300 text-left"
              >
                {t('nav.signin')}
              </button>
              <Link to="/console" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2 rounded-lg text-center">
                {t('nav.console')}
              </Link>
            </>
          ) : (
            <Link to="/console" onClick={() => setMobileMenuOpen(false)} className="block text-base font-medium bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-2 rounded-lg text-center">
              {t('nav.console')}
            </Link>
          )}
        </motion.div>
      )}

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {(activePopupNotification || selectedNotification) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            {(() => {
              const detailNotification = activePopupNotification || selectedNotification;
              const closeDetail = activePopupNotification ? closeActivePopupNotification : closeNotificationDetail;
              if (!detailNotification) {
                return null;
              }
              return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{t('commons.navbar.notificationDetails', '通知详情')}</span>
                </div>
                <button
                  onClick={closeDetail}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{detailNotification.title}</h3>
                <div className="text-xs text-slate-500 mb-6 flex items-center gap-2">
                  <span>{t('commons.navbar.notificationSourceGateway', '来自: 系统网关')}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span>{detailNotification.time}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                  {detailNotification.content || detailNotification.desc}
                </p>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#151515] flex justify-end">
                <button
                  onClick={closeDetail}
                  className="px-6 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  {t('commons.navbar.acknowledge', '我知道了')}
                </button>
              </div>
            </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

function getNotificationLoadErrorMessage(error: unknown): string {
  return error instanceof Error && error.message ? error.message : 'Failed to load notifications.';
}
