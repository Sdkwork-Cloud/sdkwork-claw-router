import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, BarChart, BookOpen, CheckCircle, ChevronRight, LayoutGrid, Layers, PlayCircle, Search, Shield, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  COURSE_CATALOG,
  deriveCourseCatalogViewModel,
  type CourseLevelFilter,
} from '../data';

export function CoursesView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState<CourseLevelFilter>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const view = deriveCourseCatalogViewModel({
    catalog: COURSE_CATALOG,
    filters: {
      level: activeLevel,
      category: activeCategory,
      searchQuery,
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#010409] pt-24 pb-16">
      <div className="bg-slate-900 border-b border-white/10 text-white mb-10 py-16 -mt-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
          <div className="flex w-full items-center">
            <div className="w-full max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-medium text-sm mb-6 border border-blue-500/30">
                <Award className="w-4 h-4" /> Professional Academy
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {t('courses.title')}
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
                {t('courses.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" /> {t('courses.startLearning')}
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> {t('courses.browseCourses')}
                </button>
              </div>
            </div>

            <div className="hidden lg:flex flex-1 justify-center relative">
              <div className="w-80 h-80 relative">
                <div className="absolute inset-0 border-4 border-blue-500/30 rounded-2xl rotate-3" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#161b22] to-slate-800 rounded-2xl shadow-2xl -rotate-3 border border-white/10 flex flex-col overflow-hidden">
                  <div className="h-40 bg-slate-800 relative overflow-hidden">
                    <img
                      src={COURSE_CATALOG[0].thumbnail}
                      className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                      alt=""
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl">
                        <PlayCircle className="w-8 h-8 text-white" fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-end">
                    <div className="w-4/5 h-4 bg-white/10 rounded mb-3" />
                    <div className="w-full h-2 bg-white/5 rounded mb-2" />
                    <div className="w-3/5 h-2 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-[#0d1117] p-6 rounded-xl border border-slate-200 dark:border-white/10">
            <Shield className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{t('courses.features.industry.title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{t('courses.features.industry.desc')}</p>
          </div>
          <div className="bg-white dark:bg-[#0d1117] p-6 rounded-xl border border-slate-200 dark:border-white/10">
            <CheckCircle className="w-8 h-8 text-green-500 mb-4" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{t('courses.features.handsOn.title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{t('courses.features.handsOn.desc')}</p>
          </div>
          <div className="bg-white dark:bg-[#0d1117] p-6 rounded-xl border border-slate-200 dark:border-white/10">
            <BarChart className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{t('courses.features.advanced.title')}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{t('courses.features.advanced.desc')}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-10">
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-3">
                  <LayoutGrid className="w-4 h-4" />
                  {t('courses.categories', 'Categories')}
                </h3>
                <div className="flex flex-col gap-1">
                  {view.categoryOptions.map((category) => {
                    const isActive = activeCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        type="button"
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${
                          isActive
                            ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-semibold shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-[#161b22] hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span>{category.id === 'All' ? t('courses.category.all', category.label) : category.label}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                          isActive
                            ? 'bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-white/10'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-3">
                  <Layers className="w-4 h-4" />
                  {t('courses.level.title', 'Level')}
                </h3>
                <div className="flex flex-col gap-1">
                  {view.levelOptions.map((level) => {
                    const isActive = activeLevel === level.id;
                    const label = level.id === 'All'
                      ? t('courses.level.all', level.label)
                      : t(`courses.level.${level.id.toLowerCase()}`, level.label);
                    return (
                      <button
                        key={level.id}
                        onClick={() => setActiveLevel(level.id)}
                        type="button"
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${
                          isActive
                            ? 'bg-slate-200/60 dark:bg-white/10 text-slate-900 dark:text-white font-semibold shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-[#161b22] hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span>{label}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                          isActive
                            ? 'bg-slate-300/50 dark:bg-white/20 text-slate-800 dark:text-white'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-white/10'
                        }`}>
                          {level.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeCategory === 'All' ? t('courses.featured', view.heading) : view.heading}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {view.snapshotSource.sourceLabel} - {view.snapshotSource.observedAt}
                </p>
              </div>
              <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-[#161b22] px-3 py-1 rounded-full">
                {view.resultCount} {t('courses.results', 'courses')}
              </span>
            </div>

            <div className="relative mb-6 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('courses.search', 'Search courses...')}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label={t('courses.search', 'Search courses...')}
                className="w-full bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {view.filteredCourses.map((course) => (
                <motion.button
                  key={course.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  aria-label={`Open course ${course.title}`}
                  className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden flex flex-col hover:border-blue-300 dark:hover:border-blue-500/30 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-[#010409] transition-all group cursor-pointer text-left"
                >
                  <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                      <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                        <PlayCircle className="w-7 h-7" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded">
                      {course.duration}
                    </div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full text-white backdrop-blur-md ${
                        course.level === 'Beginner' ? 'bg-green-500/80 border-green-400/50' :
                        course.level === 'Intermediate' ? 'bg-yellow-500/80 border-yellow-400/50' :
                        'bg-red-500/80 border-red-400/50'
                      } border`}>
                        {t(`courses.level.${course.level.toLowerCase()}`)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1 text-orange-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{course.rating}</span>
                        <span>({course.studentsCount.toLocaleString()})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.lessonsCount} {t('courses.lessons')}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6 flex-1">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                      <div className="flex items-center gap-2">
                        <img src={course.instructor.avatar} alt={course.instructor.name} className="w-8 h-8 rounded-full" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{course.instructor.name}</span>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center">
                        {t('courses.startCourse')} <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
