import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COURSE_CATALOG, deriveCourseDetailView } from '../data';
import { VideoPlayer } from './course-detail/VideoPlayer';
import { CourseInfo } from './course-detail/CourseInfo';
import { CommentSection } from './course-detail/CommentSection';
import { PublisherCard } from './course-detail/PublisherCard';
import { CoursePlaylist } from './course-detail/CoursePlaylist';
import { RelatedVideos } from './course-detail/RelatedVideos';

export function CourseDetailView() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const detail = deriveCourseDetailView(COURSE_CATALOG, id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!detail) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#010409] pt-32 pb-16 flex items-center justify-center">
        <div className="text-center text-slate-500">Course not found.</div>
      </div>
    );
  }

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
            <CourseInfo info={detail.info} snapshotSource={detail.snapshotSource} />
            <CommentSection comments={detail.comments} />
          </div>

          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 self-start lg:sticky lg:top-24 w-full min-w-0">
            <PublisherCard publisher={detail.publisher} />
            <CoursePlaylist playlist={detail.playlist} />
            <RelatedVideos relatedCourses={detail.relatedCourses} />
          </div>
        </div>
      </div>
    </div>
  );
}
