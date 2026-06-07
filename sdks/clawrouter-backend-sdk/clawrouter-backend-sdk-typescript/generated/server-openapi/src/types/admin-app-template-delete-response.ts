/** Admin app template delete response schema exposed by Claw Router. */
export interface AdminAppTemplateDeleteResponse {
  /** Whether the app template was soft-deleted and detached from catalog projections. */
  deleted: boolean;
}
