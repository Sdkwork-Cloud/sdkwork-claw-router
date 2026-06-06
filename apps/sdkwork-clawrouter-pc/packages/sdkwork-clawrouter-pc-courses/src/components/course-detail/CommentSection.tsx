import React from 'react';
import { ThumbsDown, ThumbsUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { readMediaResourceUrl } from 'sdkwork-clawrouter-pc-commons';
import type { CourseCommentsView } from '../../data';

export function CommentSection({ comments }: { comments: CourseCommentsView }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-none sm:rounded-xl p-5 md:p-6 shadow-sm w-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-lg font-bold text-slate-900 dark:text-white">Discussion</span>
        <span className="text-sm text-slate-500">{comments.totalCount}</span>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <Users className="w-5 h-5 text-slate-400" />
        </div>
        <div className="flex-1">
          <div className="relative">
            <textarea
              placeholder="Add a constructive course comment"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00aeec] resize-none h-20"
            />
            <button className="absolute right-2 bottom-2 bg-[#00aeec] text-white px-5 py-1.5 rounded-md text-sm font-medium hover:bg-[#00a1d6] transition-colors">{t('common.actions.post')}</button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {comments.items.map((comment) => {
          const avatarSrc = readMediaResourceUrl(comment.avatar) || '/assets/courses/avatars/learner.svg';
          return (
          <div key={comment.id} className="flex gap-4 border-b border-slate-100 dark:border-white/5 pb-6 last:border-0 last:pb-0">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
              <img src={avatarSrc} alt={comment.author} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-[#FB7299] dark:text-[#FB7299]">{comment.author}</span>
                <span className="text-xs text-slate-400">Level {comment.level}</span>
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 mb-2">{comment.body}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>{comment.createdAt}</span>
                <button className="flex items-center gap-1 hover:text-[#00aeec] transition-colors"><ThumbsUp className="w-3.5 h-3.5" /> {comment.likes}</button>
                <button className="flex items-center gap-1 hover:text-[#00aeec] transition-colors"><ThumbsDown className="w-3.5 h-3.5" /></button>
                <button className="hover:text-[#00aeec] transition-colors">{t('common.actions.reply')}</button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
