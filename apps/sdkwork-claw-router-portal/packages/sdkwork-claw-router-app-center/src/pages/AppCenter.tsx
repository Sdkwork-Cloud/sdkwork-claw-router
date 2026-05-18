import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Search, LayoutGrid, Star, Download, Smartphone } from 'lucide-react';
import { appService } from '../services/appService';
import { PlatformIcon } from '../components/PlatformIcon';
import {
  BusinessStatePanel,
  FilterSidebar,
  CollapsibleSection,
  FilterCheckbox,
} from 'sdkwork-claw-router-commons';
import { getLoadErrorMessage } from 'sdkwork-claw-router-commons/runtime';
import {
  deriveAppCatalogViewModel,
  type App,
  type AppSortKey,
  type PlatformType,
} from '../appRuntime';

export function AppCenter() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<AppSortKey>('Most Popular');

  const [apps, setApps] = useState<App[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categoryLoadError, setCategoryLoadError] = useState<string | null>(null);

  const loadCategories = useCallback(async (isActive: () => boolean = () => true) => {
    setCategoryLoadError(null);
    try {
      const cats = await appService.getCategories();
      if (isActive()) {
        setCategories(cats);
      }
    } catch (error) {
      if (isActive()) {
        setCategories([]);
        setCategoryLoadError(getLoadErrorMessage(error, t('apps.errors.categoriesLoadFallback')));
      }
    }
  }, [t]);

  const loadApps = useCallback(async (isActive: () => boolean = () => true) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const fetchedApps = await appService.getApps({
        searchQuery,
        platformTypes: selectedPlatforms,
        categories: selectedCategory !== 'All' ? [selectedCategory] : undefined,
        sortBy: sortBy,
      });
      if (isActive()) {
        setApps(fetchedApps);
      }
    } catch (error) {
      if (isActive()) {
        setApps([]);
        setLoadError(getLoadErrorMessage(error, t('apps.errors.loadFallback')));
      }
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  }, [searchQuery, selectedPlatforms, selectedCategory, sortBy, t]);

  useEffect(() => {
    let active = true;
    void loadCategories(() => active);
    return () => {
      active = false;
    };
  }, [loadCategories]);

  useEffect(() => {
    let active = true;
    void loadApps(() => active);
    return () => {
      active = false;
    };
  }, [loadApps]);

  const togglePlatform = (platform: PlatformType) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const view = deriveAppCatalogViewModel({
    apps,
    categories,
    filters: {
      searchQuery,
      platformTypes: selectedPlatforms,
      categories: selectedCategory !== 'All' ? [selectedCategory] : [],
      sortBy,
    },
  });

  const sortLabel = (option: AppSortKey) => {
    if (option === 'Highest Rated') {
      return t('apps.sort.rated');
    }
    if (option === 'Newest') {
      return t('apps.sort.newest');
    }
    return t('apps.sort.popular');
  };

  return (
    <div
      data-business-state={loadError ? 'error' : undefined}
      className="pt-24 pb-24 w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 min-h-screen bg-slate-50 dark:bg-[#0a0a0a]"
    >
      {/* Sidebar Filters */}
      <FilterSidebar>
        <CollapsibleSection title={t('apps.category')} icon={LayoutGrid}>
          <div className="space-y-2">
            {view.categoryOptions.map(category => (
              <FilterCheckbox
                key={category.id}
                checked={selectedCategory === category.id}
                label={category.id === 'All' ? t('apps.category.all') : category.label}
                onClick={() => setSelectedCategory(category.id)}
                activeColorClass="bg-lobster-500 border-lobster-500"
              />
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={t('apps.platform')} icon={Smartphone}>
          <div className="space-y-2">
            {view.platformOptions.map(platform => (
              <FilterCheckbox
                key={platform.id}
                checked={selectedPlatforms.includes(platform.id)}
                label={platform.label}
                onClick={() => togglePlatform(platform.id)}
                activeColorClass="bg-lobster-500 border-lobster-500"
              />
            ))}
          </div>
        </CollapsibleSection>

        {categoryLoadError ? (
          <BusinessStatePanel
            kind="error"
            title={t('apps.state.categoriesLoadError')}
            description={categoryLoadError}
            onRetry={() => void loadCategories()}
            className="min-h-0 rounded-xl border border-red-200 bg-white/70 px-3 py-4 dark:border-red-500/20 dark:bg-white/[0.03]"
          />
        ) : null}
      </FilterSidebar>

      {/* App Grid */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div className="relative w-full sm:w-72 lg:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-lobster-500 transition-colors" />
                <input
                  type="text"
                  placeholder={t('apps.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-lobster-500 focus:ring-1 focus:ring-lobster-500 transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as AppSortKey)}
                  className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-lobster-500 focus:ring-1 focus:ring-lobster-500 shadow-sm cursor-pointer transition-all hover:border-slate-300 dark:hover:border-white/20"
                >
                  {view.sortOptions.map(option => (
                    <option key={option} value={option}>{sortLabel(option)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
                // Skeleton Loader
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 overflow-hidden h-[360px] animate-pulse">
                    <div className="h-40 bg-slate-200 dark:bg-white/5" />
                    <div className="p-5 flex flex-col gap-4">
                      <div className="h-6 bg-slate-200 dark:bg-white/5 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-1/2" />
                      <div className="h-10 bg-slate-200 dark:bg-white/5 rounded w-full mt-auto" />
                    </div>
                  </div>
                ))
              ) : !view.emptyStateVisible ? (
                view.appCards.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={`/apps/${app.id}`}
                        className="group block bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:shadow-xl hover:border-lobster-500/50 transition-all duration-300 h-full flex flex-col"
                      >
                        <div className="h-40 overflow-hidden relative">
                          <img
                            src={app.image}
                            alt={app.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white shadow-sm">
                            {app.ratingLabel} <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-lobster-500 transition-colors line-clamp-1">{app.name}</h3>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{app.developer}</p>

                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-6 flex-1">
                            {app.descriptionPreview}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {app.displayOSes.map(os => {
                                const release = app.releases.find(r => r.os === os);
                                return (
                                  <span key={os} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-xs font-medium text-slate-600 dark:text-slate-400">
                                    <PlatformIcon type={release?.platformType || 'Desktop'} os={os} className="w-3 h-3" />
                                    {os}
                                  </span>
                                );
                              })}
                              {app.extraOSCount > 0 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-xs font-medium text-slate-500">
                                  +{app.extraOSCount}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Download className="w-3 h-3" />
                              {app.downloadsLabel}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                ))
              ) : loadError ? (
                <div className="col-span-full">
                  <BusinessStatePanel
                    kind="error"
                    title={t('apps.state.loadError')}
                    description={loadError}
                    onRetry={() => void loadApps()}
                    className="min-h-[360px] rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0a0a0a]"
                  />
                </div>
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('apps.noResults')}</h3>
                  <p className="text-slate-500">{t('apps.noResultsDesc')}</p>
                </div>
              )}
            </div>
      </main>
    </div>
  );
}
