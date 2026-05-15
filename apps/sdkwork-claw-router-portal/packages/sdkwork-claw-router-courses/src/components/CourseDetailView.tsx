import React, { useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  buildPortalAuthLoginRedirect,
  hasStoredPortalSession,
} from 'sdkwork-claw-router-commons/runtime';
import { courseService, selectCourseLesson, type CourseDetailResult } from '../courseService';
import { deriveCourseDetailView } from '../data';
import { VideoPlayer } from './course-detail/VideoPlayer';
import { CourseInfo } from './course-detail/CourseInfo';
import { CommentSection } from './course-detail/CommentSection';
import { PublisherCard } from './course-detail/PublisherCard';
import { CoursePlaylist } from './course-detail/CoursePlaylist';
import { RelatedVideos } from './course-detail/RelatedVideos';

void deriveCourseDetailView;

export function CourseDetailView() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = React.useState<CourseDetailResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const detail = result?.detail ?? null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function loadCourseDetail() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const detailResult = id ? await courseService.fetchCourseDetail(id) : null;
        if (!cancelled) {
          setResult(detailResult);
        }
      } catch (error) {
        if (!cancelled) {
          setResult(null);
          setLoadError(error instanceof Error ? error.message : 'Failed to load course');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCourseDetail();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#010409] pt-32 pb-16 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{t('courses.loadingDetail', 'Loading course...')}</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#010409] pt-32 pb-16 flex items-center justify-center px-4">
        <div className="flex max-w-xl items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{loadError}</span>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#010409] pt-32 pb-16 flex items-center justify-center">
        <div className="text-center text-slate-500">Course not found.</div>
      </div>
    );
  }

  const handleLessonSelect = (lessonId: string) => {
    setResult((current) => current
      ? {
        ...current,
        detail: selectCourseLesson(current.detail, lessonId),
      }
      : current);
  };

  const requireLoginForCourseDetailAction = () => {
    if (!hasStoredPortalSession()) {
      navigate(buildPortalAuthLoginRedirect(location));
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#010409] pt-24 pb-16">
      <div className="w-full mx-auto px-4 lg:px-6 xl:px-8 2xl:px-12">
        <Link to="/courses" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-4 font-medium">
          <ChevronLeft className="w-4 h-4" />
          <span>{t('courses.backToCourses', 'Back to Courses')}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4 w-full min-w-0">
            <VideoPlayer video={detail.video} />
            <CourseInfo
              info={detail.info}
              snapshotSource={detail.snapshotSource}
              requireLoginForAction={requireLoginForCourseDetailAction}
            />
            <CommentSection comments={detail.comments} />
          </div>

          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 self-start lg:sticky lg:top-24 w-full min-w-0">
            <PublisherCard publisher={detail.publisher} />
            <CoursePlaylist playlist={detail.playlist} onLessonSelect={handleLessonSelect} />
            <RelatedVideos relatedCourses={detail.relatedCourses} />
          </div>
        </div>
      </div>
    </div>
  );
}
