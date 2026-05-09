export interface ContentCourseRelationRecord {
  course_id?: string;
  created_at?: string;
  data_scope?: string;
  deleted_at?: string;
  deleted_by?: string;
  id?: string;
  metadata?: Record<string, unknown>;
  organization_id?: string;
  related_course_id?: string;
  relation_type?: string;
  sort_order?: number;
  status?: string;
  tenant_id?: string;
  updated_at?: string;
  uuid?: string;
  version?: string;
}
