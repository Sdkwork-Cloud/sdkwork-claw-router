import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, LayoutGrid, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CoursePlaylistView } from '../../data';

export function CoursePlaylist({
  playlist,
  onLessonSelect,
}: {
  playlist: CoursePlaylistView;
  onLessonSelect?: (lessonId: string) => void;
}) {
  const { t } = useTranslation();
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({ 0: true });
  const [showGrid, setShowGrid] = useState(false);
  const [selectedGridTab, setSelectedGridTab] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const isSingleChapter = playlist.chapters.length === 1;
  const selectedChapter = playlist.chapters[selectedGridTab] ?? playlist.chapters[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (gridRef.current && !gridRef.current.contains(event.target as Node)) {
        setShowGrid(false);
      }
    }
    if (showGrid) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGrid]);

  const toggleChapter = (index: number) => {
    setExpandedChapters((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="bg-white dark:bg-[#0d1117] rounded-xl border border-slate-200 dark:border-white/10 p-4 shadow-sm w-full relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 dark:text-white">Course lessons</h3>
          <span className="text-xs text-slate-500">({playlist.currentLessonNumber}/{playlist.totalLessons})</span>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 ml-1 rounded-md transition-colors ${showGrid ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10 dark:hover:text-slate-200'}`}
            title={t('common.actions.lessonGrid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span>Autoplay</span>
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`w-9 h-5 rounded-full relative transition-colors ${isAutoPlay ? 'bg-[#00aeec]' : 'bg-slate-300 dark:bg-slate-600'}`}
            aria-pressed={isAutoPlay}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${isAutoPlay ? 'left-4.5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {showGrid && selectedChapter && (
        <div
          ref={gridRef}
          className="absolute top-14 left-0 right-0 z-20 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col mx-2"
          style={{ maxHeight: 'calc(100vh - 200px)', minHeight: '200px' }}
        >
          <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-white/5 shrink-0 bg-slate-50/50 dark:bg-white/5">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">Select lesson</h4>
            <button onClick={() => setShowGrid(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {!isSingleChapter && playlist.chapters.length > 2 && (
            <div className="flex overflow-x-auto custom-scrollbar border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-white/5">
              <div className="flex p-2 gap-2">
                {playlist.chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedGridTab(index)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedGridTab === index
                        ? 'bg-[#00aeec] text-white shadow-sm'
                        : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {chapter.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {selectedChapter.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  title={lesson.title}
                  type="button"
                  onClick={() => {
                    onLessonSelect?.(lesson.id);
                    setShowGrid(false);
                  }}
                  aria-pressed={lesson.active}
                  aria-label={`Play lesson ${lesson.number}: ${lesson.title}`}
                  className={`aspect-square flex flex-col items-center justify-center gap-1 rounded-xl border text-sm font-bold transition-all ${
                    lesson.active
                      ? 'border-[#00aeec] bg-[#00aeec]/10 text-[#00aeec] shadow-sm'
                      : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-[#00aeec] hover:text-[#00aeec] hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  {lesson.active && <div className="w-1.5 h-1.5 rounded-full bg-[#00aeec] mb-0.5" />}
                  <span>{lesson.number}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {playlist.chapters.map((chapter, index) => {
          const isExpanded = isSingleChapter || expandedChapters[index];

          return (
            <div key={chapter.id} className={`rounded-lg overflow-hidden bg-white dark:bg-transparent ${isSingleChapter ? '' : 'border border-slate-100 dark:border-white/5'}`}>
              {!isSingleChapter && (
                <button
                  onClick={() => toggleChapter(index)}
                  className="w-full flex items-center justify-between bg-slate-50/80 dark:bg-white/5 px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <span className="truncate pr-2">{chapter.title}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
              )}

              <div className={`transition-all overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className={`flex flex-col py-1 ${isSingleChapter ? 'px-0' : 'px-1'}`}>
                  {chapter.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => onLessonSelect?.(lesson.id)}
                      aria-pressed={lesson.active}
                      className={`group flex w-full items-center justify-between gap-2 px-2.5 py-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer rounded-md text-left focus:outline-none focus:ring-2 focus:ring-[#00aeec] ${lesson.active ? 'bg-slate-50 dark:bg-white/5' : ''}`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden w-full">
                        {lesson.active ? (
                          <div className="w-2 h-2 rounded-full bg-[#00aeec] flex-shrink-0" />
                        ) : (
                          <div className="w-3 flex-shrink-0" />
                        )}
                        <span className={`text-sm truncate w-full ${lesson.active ? 'text-[#00aeec] font-medium' : 'text-slate-700 dark:text-slate-300 group-hover:text-[#00aeec]'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex-shrink-0 font-mono hidden sm:inline-block bg-slate-50 dark:bg-white/5 px-1.5 py-0.5 rounded">{lesson.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
