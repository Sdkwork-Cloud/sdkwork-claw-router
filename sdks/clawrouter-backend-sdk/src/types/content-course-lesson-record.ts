export interface ContentCourseLessonRecord {
  content?: string;
  course_id?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  description?: string;
  duration_seconds?: string;
  duration_text?: string;
  external_bvid?: string;
  free_preview?: boolean;
  id?: string;
  lesson_no?: number;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  section_id?: string;
  sort_order?: number;
  source_provider?: string;
  status?: string;
  tenant_id?: string;
  title?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
  video_url?: string;
}
