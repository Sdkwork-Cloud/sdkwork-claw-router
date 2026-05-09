export interface ContentCourseSectionRecord {
  course_id?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  description?: string;
  duration_seconds?: string;
  id?: string;
  lesson_count?: number;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  section_no?: number;
  sort_order?: number;
  status?: string;
  tenant_id?: string;
  title?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
