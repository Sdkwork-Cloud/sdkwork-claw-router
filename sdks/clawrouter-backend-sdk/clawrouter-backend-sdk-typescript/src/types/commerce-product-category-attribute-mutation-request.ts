/** Commerce product category attribute mutation request schema exposed by Claw Router. */
export interface CommerceProductCategoryAttributeMutationRequest {
  /** Attribute id field on commerce product category attribute mutation request. */
  attributeId: string;
  /** Category id field on commerce product category attribute mutation request. */
  categoryId: string;
  /** Filterable field on commerce product category attribute mutation request. */
  filterable: boolean;
  /** Required field on commerce product category attribute mutation request. */
  required: boolean;
  /** Searchable field on commerce product category attribute mutation request. */
  searchable: boolean;
  /** Sort order field on commerce product category attribute mutation request. */
  sortOrder?: number;
  /** Status field on commerce product category attribute mutation request. */
  status: 'active' | 'inactive' | 'archived';
}
