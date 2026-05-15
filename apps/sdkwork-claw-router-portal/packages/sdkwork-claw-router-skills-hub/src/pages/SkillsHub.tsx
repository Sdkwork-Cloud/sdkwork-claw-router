import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Search, LayoutGrid, Star, Download } from 'lucide-react';
import { skillService } from '../services/skillService';
import {
  BusinessStatePanel,
  FilterSidebar,
  CollapsibleSection,
  FilterCheckbox,
} from 'sdkwork-claw-router-commons';
import { getLoadErrorMessage, hasStoredPortalSession } from 'sdkwork-claw-router-commons/runtime';
import {
  deriveSkillCatalogViewModel,
  type InstalledSkill,
  type Skill,
  type SkillSortKey,
} from '../skillRuntime';

export function SkillsHub() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SkillSortKey>('Most Popular');

  const [skills, setSkills] = useState<Skill[]>([]);
  const [installedSkills, setInstalledSkills] = useState<InstalledSkill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [installedLoadError, setInstalledLoadError] = useState<string | null>(null);
  const [categoryLoadError, setCategoryLoadError] = useState<string | null>(null);

  const loadCategories = useCallback(async (isActive: () => boolean = () => true) => {
    setCategoryLoadError(null);
    try {
      const cats = await skillService.getCategories();
      if (isActive()) {
        setCategories(cats);
      }
    } catch (error) {
      if (isActive()) {
        setCategories([]);
        setCategoryLoadError(getLoadErrorMessage(error, 'Failed to load skill categories.'));
      }
    }
  }, []);

  const loadSkills = useCallback(async (isActive: () => boolean = () => true) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const fetchedSkills = await skillService.getSkills({
        searchQuery,
        categories: selectedCategory !== 'All' ? [selectedCategory] : undefined,
        sortBy: sortBy
      });
      if (isActive()) {
        setSkills(fetchedSkills);
      }
    } catch (error) {
      if (isActive()) {
        setSkills([]);
        setLoadError(getLoadErrorMessage(error, 'Failed to load skills.'));
      }
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  }, [searchQuery, selectedCategory, sortBy]);

  const loadInstalledSkills = useCallback(async (isActive: () => boolean = () => true) => {
    setInstalledLoadError(null);
    if (!hasStoredPortalSession()) {
      setInstalledSkills([]);
      setInstalledLoadError(null);
      return;
    }
    try {
      const fetchedInstalledSkills = await skillService.getMySkills();
      if (isActive()) {
        setInstalledSkills(fetchedInstalledSkills);
      }
    } catch (error) {
      if (isActive()) {
        setInstalledSkills([]);
        setInstalledLoadError(getLoadErrorMessage(error, 'Failed to load installed skills.'));
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadCategories(() => active);
    return () => {
      active = false;
    };
  }, [loadCategories]);

  useEffect(() => {
    let active = true;
    void loadSkills(() => active);
    return () => {
      active = false;
    };
  }, [loadSkills]);

  useEffect(() => {
    let active = true;
    void loadInstalledSkills(() => active);
    return () => {
      active = false;
    };
  }, [loadInstalledSkills]);

  const view = deriveSkillCatalogViewModel({
    skills,
    categories,
    installedSkills,
    filters: {
      searchQuery,
      categories: selectedCategory !== 'All' ? [selectedCategory] : [],
      sortBy,
    },
  });

  return (
    <div
      data-business-state={loadError ? 'error' : undefined}
      className="pt-24 pb-24 w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 min-h-screen bg-slate-50 dark:bg-[#0a0a0a]"
    >
      {/* Sidebar Filters */}
      <FilterSidebar>
        <CollapsibleSection title={t('skills.category')} icon={LayoutGrid}>
          <div className="space-y-2">
            {view.categoryOptions.map(category => (
              <FilterCheckbox
                key={category.id}
                checked={selectedCategory === category.id}
                label={category.id === 'All' ? t('skills.allCategories') : category.label}
                onClick={() => setSelectedCategory(category.id)}
                activeColorClass="bg-lobster-500 border-lobster-500"
              />
            ))}
          </div>
        </CollapsibleSection>

        {categoryLoadError ? (
          <BusinessStatePanel
            kind="error"
            title="Skill categories could not be loaded"
            description={categoryLoadError}
            onRetry={() => void loadCategories()}
            className="min-h-0 rounded-xl border border-red-200 bg-white/70 px-3 py-4 dark:border-red-500/20 dark:bg-white/[0.03]"
          />
        ) : null}

        {installedLoadError ? (
          <BusinessStatePanel
            kind="error"
            title="Installed skills could not be loaded"
            description={installedLoadError}
            onRetry={() => void loadInstalledSkills()}
            className="min-h-0 rounded-xl border border-red-200 bg-white/70 px-3 py-4 dark:border-red-500/20 dark:bg-white/[0.03]"
          />
        ) : null}
      </FilterSidebar>

      {/* Skill Grid */}
      <main className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div className="relative w-full sm:w-72 lg:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-lobster-500 transition-colors" />
                <input
                  type="text"
                  placeholder={t('skills.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-lobster-500 focus:ring-1 focus:ring-lobster-500 transition-all shadow-sm"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SkillSortKey)}
                  className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-lobster-500 focus:ring-1 focus:ring-lobster-500 shadow-sm cursor-pointer transition-all hover:border-slate-300 dark:hover:border-white/20"
                >
                  {view.sortOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
                // Skeleton Loader
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 overflow-hidden h-[240px] animate-pulse">
                    <div className="p-5 flex flex-col gap-4 h-full">
                      <div className="flex gap-4">
                         <div className="w-12 h-12 bg-slate-200 dark:bg-white/5 rounded-xl block" />
                         <div className="flex-1 space-y-2">
                           <div className="h-5 bg-slate-200 dark:bg-white/5 rounded w-3/4" />
                           <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-1/2" />
                         </div>
                      </div>
                      <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-full mt-4" />
                      <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-5/6" />
                      <div className="h-8 bg-slate-200 dark:bg-white/5 rounded w-full mt-auto" />
                    </div>
                  </div>
                ))
              ) : !view.emptyStateVisible ? (
                view.skillCards.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/skills-hub/${skill.id}`}
                      className="group block bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:shadow-xl hover:border-lobster-500/50 transition-all duration-300 h-full flex flex-col p-5"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-white/10">
                           <LayoutGrid className="w-6 h-6 text-lobster-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-lobster-500 transition-colors truncate">{skill.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate max-w-[120px]">{skill.developer}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10">{skill.license}</span>
                            <span
                              className={[
                                'text-xs flex items-center gap-1 px-2 py-0.5 rounded-md border',
                                skill.enabled
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                                  : skill.installed
                                    ? 'border-lobster-100 bg-lobster-50 text-lobster-600 dark:border-lobster-500/20 dark:bg-lobster-500/10 dark:text-lobster-400'
                                    : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400',
                              ].join(' ')}
                            >
                              {skill.installationLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-6 flex-1 leading-relaxed">
                        {skill.descriptionPreview}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 text-xs font-medium text-slate-600 dark:text-slate-400">
                          {skill.category}
                        </span>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-1 text-xs text-slate-500">
                             <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                             <span className="font-medium text-slate-700 dark:text-slate-300">{skill.ratingLabel}</span>
                           </div>
                           <div className="flex items-center gap-1 text-xs text-slate-500">
                             <Download className="w-3.5 h-3.5" />
                             {skill.downloadsLabel}
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
                    title="Skills could not be loaded"
                    description={loadError}
                    onRetry={() => void loadSkills()}
                    className="min-h-[300px] rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0a0a0a]"
                  />
                </div>
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('skills.noResults')}</h3>
                  <p className="text-slate-500">{t('skills.noResultsDesc')}</p>
                </div>
              )}
            </div>
      </main>
    </div>
  );
}
