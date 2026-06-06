/** Admin course relation item schema exposed by Claw Router. */
export interface AdminCourseRelationItem {
  /** Course id field on admin course relation item. */
  courseId?: string | null;
  /** Id field on admin course relation item. */
  id: string;
  /** Related course id field on admin course relation item. */
  relatedCourseId?: string | null;
  /** Relation type field on admin course relation item. */
  relationType?: string | null;
  /** Sort order field on admin course relation item. */
  sortOrder?: string | null;
  /** Status field on admin course relation item. */
  status?: string | null;
}
