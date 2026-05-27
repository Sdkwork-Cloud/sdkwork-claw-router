/** Admin prompt item schema exposed by Claw Router. */
export interface AdminPromptItem {
  /** Category code field on admin prompt item. */
  categoryCode?: string | null;
  /** Category id field on admin prompt item. */
  categoryId?: string | null;
  /** Created at field on admin prompt item. */
  createdAt: string;
  /** Description field on admin prompt item. */
  description?: string | null;
  /** Id field on admin prompt item. */
  id: number;
  /** Latest version id field on admin prompt item. */
  latestVersionId?: number | null;
  /** Name field on admin prompt item. */
  name: string;
  /** Organization id field on admin prompt item. */
  organizationId: number;
  /** Owner user id field on admin prompt item. */
  ownerUserId?: number | null;
  /** Prompt key field on admin prompt item. */
  promptKey: string;
  /** Prompt type field on admin prompt item. */
  promptType: string;
  /** Published version id field on admin prompt item. */
  publishedVersionId?: number | null;
  /** Status field on admin prompt item. */
  status: string;
  /** Tags field on admin prompt item. */
  tags: string[];
  /** Tenant id field on admin prompt item. */
  tenantId: number;
  /** Updated at field on admin prompt item. */
  updatedAt: string;
  /** Uuid field on admin prompt item. */
  uuid: string;
  /** Visibility field on admin prompt item. */
  visibility: string;
}
