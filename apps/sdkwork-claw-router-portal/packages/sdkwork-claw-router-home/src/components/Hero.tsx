import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Download, Apple, Play, Monitor, Server, Terminal } from 'lucide-react';

export function Hero() {
  const { t } = useTranslation();
  const [os, setOs] = useState('macOS');

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.match(/Android/i)) {
      setOs('Android');
    } else if (userAgent.match(/(iPhone|iPod|iPad)/i)) {
      setOs('iOS');
    } else if (userAgent.indexOf('Win') !== -1) {
      setOs('Windows');
    } else if (userAgent.indexOf('Mac') !== -1) {
      setOs('macOS');
    } else if (userAgent.indexOf('Linux') !== -1) {
      setOs('Linux');
    }
  }, []);

  const platforms = [
    { name: 'macOS', icon: <Download className="w-4 h-4" />, primaryIcon: <Download className="w-5 h-5" /> },
    { name: 'Windows', icon: <Download className="w-4 h-4" />, primaryIcon: <Download className="w-5 h-5" /> },
    { name: 'Linux', icon: <Download className="w-4 h-4" />, primaryIcon: <Download className="w-5 h-5" /> },
    { name: 'iOS', icon: <Apple className="w-4 h-4" />, primaryIcon: <Apple className="w-5 h-5" /> },
    { name: 'Android', icon: <Play className="w-4 h-4" />, primaryIcon: <Play className="w-5 h-5" /> },
  ];

  const primaryPlatform = platforms.find(p => p.name === os) || platforms[0];
  const secondaryPlatforms = platforms.filter(p => p.name !== os);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lobster-500/10 text-lobster-600 dark:text-lobster-400 text-sm font-medium mb-8 border border-lobster-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-lobster-500 animate-pulse" />
            {t('hero.badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-6"
          >
            {t('hero.title1')} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lobster-500 to-orange-500">
              {t('hero.title2')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-12 text-left"
          >
            {/* Desktop Card */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-lobster-500/30 transition-all flex flex-col relative group overflow-hidden">
              <div className="absolute -top-6 -right-6 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-500 transform group-hover:scale-110">
                <Monitor className="w-48 h-48 text-lobster-500" />
              </div>

              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-lobster-50 dark:bg-lobster-500/10 text-lobster-600 dark:text-lobster-400">
                <Monitor className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('home.desktop.title', 'Claw Router Desktop')}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-1 text-sm leading-relaxed">
                {t('home.desktop.desc', 'For developers and local environments. Includes a full graphical interface, visual API building, integrated Playground, and one-click app testing.')}
              </p>

              <a
                href="#"
                className="w-full px-6 py-4 rounded-xl bg-lobster-600 text-white font-medium hover:bg-lobster-700 shadow-md shadow-lobster-500/20 transition-all flex items-center justify-center gap-2 mb-6"
              >
                {primaryPlatform.primaryIcon}
                {t('home.downloadFor', { os: primaryPlatform.name, defaultValue: `Download for ${primaryPlatform.name}` })}
              </a>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 w-full font-medium">
                {secondaryPlatforms.map((platform, index) => (
                  <React.Fragment key={platform.name}>
                    <a href="#" className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors">
                      {platform.icon}
                      {platform.name}
                    </a>
                    {index < secondaryPlatforms.length - 1 && (
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Server Card */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-white/20 transition-all flex flex-col relative group overflow-hidden">
              <div className="absolute -top-6 -right-6 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-500 transform group-hover:scale-110">
                <Server className="w-48 h-48 text-slate-900 dark:text-white" />
              </div>

              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                <Server className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{t('home.server.title', 'Claw Router Server')}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-1 text-sm leading-relaxed">
                {t('home.server.desc', 'For production deployments. Optimized for headless execution, extreme throughput, containerization (Docker), and large-scale enterprise routing.')}
              </p>

              <a
                href="#"
                className="w-full px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/20 text-white border border-transparent dark:border-white/10 font-medium transition-all flex items-center justify-center gap-2 mb-6"
              >
                <Terminal className="w-5 h-5" />
                {t('home.server.get', 'Get Server Edition')}
              </a>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 w-full font-medium">
                <a href="#" className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors">
                  {t('home.server.docker', 'Docker Image')}
                </a>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <a href="#" className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors">
                  {t('home.server.linux', 'Linux Tarball')}
                </a>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <a href="#" className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors">
                  {t('home.server.helm', 'Helm Chart')}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
