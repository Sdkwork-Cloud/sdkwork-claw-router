/** Commerce product category mutation request schema exposed by Claw Router. */
export interface CommerceProductCategoryMutationRequest {
  /** Category no field on commerce product category mutation request. */
  categoryNo: string;
  /** Name field on commerce product category mutation request. */
  name: string;
  /** Parent id field on commerce product category mutation request. */
  parentId?: string | null;
  /** Sort order field on commerce product category mutation request. */
  sortOrder?: number;
  /** Status field on commerce product category mutation request. */
  status: 'active' | 'inactive' | 'archived';
}
