import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutGrid, Star, Download, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BusinessStatePanel } from 'sdkwork-clawrouter-pc-commons';
import { getLoadErrorMessage, readMediaResourceUrl } from 'sdkwork-clawrouter-pc-commons/runtime';
import { appService } from '../services/appService';
import { deriveAppCatalogViewModel, type App } from '../appRuntime';

export function AppCenterPreview() {
  const { t } = useTranslation();
  const [apps, setApps] = useState<App[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadPreviewApps = useCallback(async (isActive: () => boolean = () => true) => {
    setLoadError(null);
    try {
      const fetchedApps = await appService.getApps({ sortBy: 'Most Popular' });
      if (isActive()) {
        setApps(fetchedApps.items.slice(0, 3));
      }
    } catch (error) {
      if (isActive()) {
        setApps([]);
        setLoadError(getLoadErrorMessage(error, 'Failed to load featured apps.'));
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadPreviewApps(() => active);
    return () => {
      active = false;
    };
  }, [loadPreviewApps]);

  const preview = deriveAppCatalogViewModel({
    apps,
    categories: [],
    filters: {
      searchQuery: '',
      platformTypes: [],
      categories: [],
      sortBy: 'Most Popular',
    },
  });

  return (
    <section id="apps" className="py-24 bg-slate-100 dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-white/5 relative overflow-hidden">
      <div className="w-full mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lobster-500/10 text-lobster-600 dark:text-lobster-400 text-sm font-medium mb-4">
              <LayoutGrid className="w-4 h-4" />
              {t('preview.badge')}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              {t('preview.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('preview.subtitle')}
            </p>
          </div>
          <Link to="/apps" className="px-6 py-3 rounded-full bg-lobster-600 hover:bg-lobster-700 text-white font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
            {t('preview.browse')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadError ? (
          <BusinessStatePanel
            kind="error"
            title="Featured apps could not be loaded"
            description={loadError}
            onRetry={() => void loadPreviewApps()}
            className="rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#050505]"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {preview.appCards.map((app, index) => (
            <Link to={`/apps/${app.id}`} key={app.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl bg-white dark:bg-[#050505] border border-slate-200 dark:border-white/10 overflow-hidden hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm hover:shadow-md h-full flex flex-col"
              >
                <div className="h-48 overflow-hidden relative flex-shrink-0 border-b border-slate-100 dark:border-white/5">
                  <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/20 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={readMediaResourceUrl(app.image)}
                    alt={app.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-lobster-600 dark:group-hover:text-lobster-400 transition-colors">{app.name}</h3>
                      <p className="text-xs font-mono text-slate-500">{t('preview.by')} {app.developer}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md border border-slate-200 dark:border-white/10">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-mono text-slate-700 dark:text-slate-300">{app.ratingLabel}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
                    {app.descriptionPreview}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                    <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
                      <Download className="w-3.5 h-3.5" />
                      {app.downloadsLabel}
                    </div>
                    <span className="text-xs font-mono text-lobster-600 dark:text-lobster-400 group-hover:text-lobster-700 dark:group-hover:text-lobster-300 transition-colors flex items-center gap-1">
                      {t('preview.viewDetails')} <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
