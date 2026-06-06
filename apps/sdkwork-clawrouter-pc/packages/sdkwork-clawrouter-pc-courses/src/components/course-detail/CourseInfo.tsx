import React from 'react';
import { AlertTriangle, BookOpen, CalendarDays, Eye, ListVideo, Share, Star, ThumbsUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CourseInfoView, CourseOverviewSource } from '../../data';

export function CourseInfo({
  info,
  snapshotSource,
  requireLoginForAction,
}: {
  info: CourseInfoView;
  snapshotSource: CourseOverviewSource;
  requireLoginForAction: () => boolean;
}) {
  const { t } = useTranslation();
  const handlePrivateAction = () => {
    requireLoginForAction();
  };

  return (
    <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-none sm:rounded-xl p-5 md:p-6 space-y-4 shadow-sm w-full">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
        {info.title}
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500 border-b border-slate-100 dark:border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {info.viewsLabel}</span>
          <span className="flex items-center gap-1.5"><ListVideo className="w-4 h-4" /> {info.lessonsLabel}</span>
          <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {info.publishedAt}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrivateAction}
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors font-medium text-slate-700 dark:text-slate-300"
          >
            <ThumbsUp className="w-5 h-5" />
            <span>{info.reactions.likes}</span>
          </button>
          <button
            type="button"
            onClick={handlePrivateAction}
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors font-medium text-slate-700 dark:text-slate-300"
          >
            <Star className="w-5 h-5" />
            <span>{info.reactions.saves}</span>
          </button>
          <button
            type="button"
            onClick={handlePrivateAction}
            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors font-medium text-slate-700 dark:text-slate-300"
          >
            <Share className="w-5 h-5" />
            <span>{info.reactions.shares}</span>
          </button>

          <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-2" />

          <button
            type="button"
            onClick={handlePrivateAction}
            className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-500"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.actions.reportContent')}</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 mt-4">
        <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              <BookOpen className="w-4 h-4" />
              {t('courses.aboutThisCourse', 'About This Course')}
            </div>
          <p>{info.description}</p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {snapshotSource.sourceLabel} - {snapshotSource.observedAt}
        </p>
      </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
          <span className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300">
            {info.category}
          </span>
          {info.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-slate-200 dark:bg-white/10 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
