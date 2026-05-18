import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Download, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { BusinessStatePanel, CopyButton } from 'sdkwork-claw-router-commons';
import { buildPortalShareUrl, getLoadErrorMessage } from 'sdkwork-claw-router-commons/runtime';
import { appService } from '../services/appService';
import { PlatformIcon } from '../components/PlatformIcon';
import {
  deriveAppDetailView,
  getReleaseDownloadUrl,
  isReleaseDownloadable,
  type App,
  type AppRelease,
} from '../appRuntime';

export function AppDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);

  const [app, setApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<AppRelease | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const loadAppDetails = useCallback(async (isActive: () => boolean = () => true) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      if (!id) {
        if (isActive()) {
          setApp(null);
          setSelectedRelease(null);
        }
        return;
      }
      const fetchedApp = await appService.getAppById(id);
      if (isActive()) {
        setApp(fetchedApp || null);
        setSelectedRelease(fetchedApp?.releases[0] ?? null);
      }
    } catch (error) {
      if (isActive()) {
        setApp(null);
        setSelectedRelease(null);
        setLoadError(getLoadErrorMessage(error, 'Failed to load app details.'));
      }
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    let active = true;
    void loadAppDetails(() => active);
    return () => {
      active = false;
    };
  }, [loadAppDetails]);

  const detail = deriveAppDetailView(app ? [app] : [], id, selectedRelease?.id);

  const scrollScreenshots = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const selectRelease = (release: AppRelease) => {
    setIsDownloadDropdownOpen(false);
    setSelectedRelease(release);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-slate-200 dark:bg-white/5" />
            <div className="flex-1 space-y-4 py-4">
              <div className="h-8 bg-slate-200 dark:bg-white/5 rounded w-1/2" />
              <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-1/4" />
              <div className="h-10 bg-slate-200 dark:bg-white/5 rounded w-32 mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a] px-4">
        <BusinessStatePanel
          kind="error"
          title="App details could not be loaded"
          description={loadError}
          onRetry={() => void loadAppDetails()}
          className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0a0a0a]"
        />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('app.notFound')}</h2>
          <Link to="/apps" className="text-lobster-500 hover:underline">{t('app.back')}</Link>
        </div>
      </div>
    );
  }

  const { app: detailApp } = detail;
  const activeRelease = detail.selectedRelease;
  const downloadUrl = getReleaseDownloadUrl(activeRelease);
  const canDownload = isReleaseDownloadable(activeRelease);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* Back Button */}
        <Link to="/apps" className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-lobster-500 dark:hover:text-lobster-400 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('app.back')}
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* App Icon / Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10"
          >
            <img src={detailApp.image} alt={detailApp.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>

          {/* App Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{detailApp.name}</h1>
              <h2 className="text-lg text-slate-500 dark:text-slate-400 mb-4">{detailApp.developer}</h2>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{detailApp.rating}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Download className="w-4 h-4" />
                  {detailApp.downloads} {t('app.downloads')}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-500/20">
                  <PlatformIcon type={activeRelease.platformType} os={activeRelease.os} />
                  {activeRelease.os}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 relative">
              {/* Download Dropdown */}
              <div className="relative flex-1 md:flex-none">
                <div className="flex">
                  {canDownload ? (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full md:w-auto px-6 py-3 bg-lobster-500 hover:bg-lobster-600 text-white rounded-l-xl font-bold transition-colors shadow-sm shadow-lobster-500/20 flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                        <PlatformIcon type={activeRelease.platformType} os={activeRelease.os} className="w-4 h-4" />
                        {t('app.get')} {activeRelease.os}
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="w-full md:w-auto px-6 py-3 bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 rounded-l-xl font-bold shadow-sm flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                        <PlatformIcon type={activeRelease.platformType} os={activeRelease.os} className="w-4 h-4" />
                        {t('common.actions.downloadUnavailable')}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsDownloadDropdownOpen(!isDownloadDropdownOpen)}
                    className="px-3 py-3 bg-lobster-600 hover:bg-lobster-700 text-white rounded-r-xl transition-colors border-l border-lobster-400/30 flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <AnimatePresence>
                  {isDownloadDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDownloadDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-50 flex flex-col max-h-80"
                      >
                        <div className="p-2 overflow-y-auto custom-scrollbar">
                          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0 bg-white dark:bg-slate-900 z-10">
                            Select Version
                          </div>
                          {detailApp.releases.map(release => (
                            <button
                              key={release.id}
                              onClick={() => selectRelease(release)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 last:mb-0 ${activeRelease.id === release.id ? 'bg-lobster-50 dark:bg-lobster-500/10 text-lobster-600 dark:text-lobster-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                            >
                              <div className="flex items-center gap-2">
                                <PlatformIcon type={release.platformType} os={release.os} className="w-4 h-4" />
                                <span className="font-medium">{release.os}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs opacity-60">{release.size}</span>
                                {activeRelease.id === release.id && <Check className="w-4 h-4" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <CopyButton
                text={buildPortalShareUrl(`/apps/${detailApp.id}`)}
                label={t('common.actions.share')}
                copiedLabel={t('common.actions.linkCopied')}
                errorLabel={t('common.actions.copyFailed')}
                title={t('common.actions.copyAppLink')}
                className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10"
                iconClassName="w-5 h-5"
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-white/10 mb-12" />

        {/* Screenshots Gallery */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Screenshots</h3>

          <div className="relative group">
            <button
              onClick={() => scrollScreenshots('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 dark:bg-black/90 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x scroll-smooth"
            >
              {detailApp.screenshots.map((screenshot, index) => (
                <div key={index} className="flex-shrink-0 w-[280px] md:w-[400px] h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 snap-center shadow-sm">
                  <img src={screenshot} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollScreenshots('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 dark:bg-black/90 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-white/10 mb-12" />

        {/* Description & Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('app.about')}</h3>
            <div className={`relative ${!isDescriptionExpanded ? 'max-h-48 overflow-hidden' : ''}`}>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {detailApp.description}
              </p>
              {!isDescriptionExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent" />
              )}
            </div>
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-4 text-lobster-500 font-medium hover:text-lobster-600 transition-colors"
            >
              {isDescriptionExpanded ? t('app.showLess', 'Show Less') : t('app.readMore', 'Read More')}
            </button>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-12 mb-6">{t('app.keyFeatures', 'Key Features')}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detailApp.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
                  <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* What's New Section (based on selected release) */}
            {activeRelease.whatsNew && (
              <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">What's New in {activeRelease.os}</h3>
                <p className="text-sm text-slate-500 mb-4">Version {activeRelease.version} • {activeRelease.releaseDate}</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{activeRelease.whatsNew}</p>
              </div>
            )}
          </div>

          {/* Information Sidebar */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">Provider</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{detailApp.developer}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">Category</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{detailApp.category}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">Size</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{activeRelease.size}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">Version</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{activeRelease.version}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">Updated</span>
                <span className="text-slate-900 dark:text-white font-medium text-right">{detail.releaseDateLabel}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-200 dark:border-white/10">
                <span className="text-slate-500">Compatibility</span>
                <span className="text-slate-900 dark:text-white font-medium text-right flex items-center gap-1.5">
                  <PlatformIcon type={activeRelease.platformType} os={activeRelease.os} className="w-3.5 h-3.5" />
                  {activeRelease.os}
                </span>
              </div>
            </div>

            {/* Available Platforms Summary */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Also Available On</h4>
              <div className="flex flex-wrap gap-2">
                {detail.availablePlatformReleases.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRelease(r)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-lobster-500 transition-colors text-xs font-medium text-slate-600 dark:text-slate-300"
                  >
                    <PlatformIcon type={r.platformType} os={r.os} className="w-3 h-3" />
                    {r.os}
                  </button>
                ))}
                {detailApp.releases.length === 1 && (
                  <span className="text-sm text-slate-500">No other platforms available.</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
