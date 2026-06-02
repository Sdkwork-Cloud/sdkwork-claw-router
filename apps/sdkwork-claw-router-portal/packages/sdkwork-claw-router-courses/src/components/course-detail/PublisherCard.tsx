import React from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { readMediaResourceUrl } from 'sdkwork-claw-router-commons';
import type { CoursePublisherView } from '../../data';

export function PublisherCard({ publisher }: { publisher: CoursePublisherView }) {
  const { t } = useTranslation();
  const avatarSrc = readMediaResourceUrl(publisher.avatar) || '/assets/courses/avatars/learner.svg';
  return (
    <div className="bg-white dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-white/10 p-4 shadow-sm flex flex-col gap-3 w-full">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img src={avatarSrc} alt={publisher.name} className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10" />
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-0.5 border-2 border-white dark:border-[#0d1117]">
            <Star className="w-2.5 h-2.5 text-white fill-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{publisher.name}</span>
            <button className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs transition-colors">
              <MessageSquare className="w-3.5 h-3.5" /> {t('common.actions.message')}
            </button>
          </div>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-1 mt-0.5">{publisher.title}</p>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{publisher.bio}</p>
        </div>
      </div>
      <button className="w-full bg-[#00aeec] hover:bg-[#00a1d6] text-white font-medium py-1.5 rounded-md transition-colors text-sm flex items-center justify-center gap-1">
        <span>{t('common.actions.follow')}</span>
        <span>{publisher.followersLabel}</span>
      </button>
    </div>
  );
}
