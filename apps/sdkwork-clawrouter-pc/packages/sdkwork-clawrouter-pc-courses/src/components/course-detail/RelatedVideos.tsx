import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, PlayCircle } from 'lucide-react';
import { readMediaResourceUrl } from 'sdkwork-clawrouter-pc-commons';
import type { CourseRelatedCardView } from '../../data';

export function RelatedVideos({ relatedCourses }: { relatedCourses: CourseRelatedCardView[] }) {
  return (
    <div className="bg-white dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-white/10 p-4 shadow-sm w-full">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Related courses</h3>
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
        {relatedCourses.map((course) => {
          const thumbnailSrc = readMediaResourceUrl(course.thumbnail) || '/assets/courses/covers/ai-coding.svg';
          return (
          <Link key={course.id} to={`/courses/${course.id}`} className="group flex gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors">
            <div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img src={thumbnailSrc} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                {course.duration}
              </div>
            </div>
            <div className="flex flex-col flex-1 py-0.5">
              <h4 className="font-medium text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#00aeec] transition-colors">{course.title}</h4>
              <div className="mt-auto">
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.instructorName}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  <PlayCircle className="w-3 h-3 inline mr-0.5" /> {course.viewsLabel}
                  <MessageSquare className="w-3 h-3 inline ml-2 mr-0.5" /> {course.discussionsLabel}
                </p>
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
