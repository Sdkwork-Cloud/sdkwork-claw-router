/** Commerce product category item schema exposed by Claw Router. */
export interface CommerceProductCategoryItem {
  /** Category no field on commerce product category item. */
  categoryNo: string;
  /** Created at field on commerce product category item. */
  createdAt: string;
  /** Id field on commerce product category item. */
  id: string;
  /** Level no field on commerce product category item. */
  levelNo: number;
  /** Name field on commerce product category item. */
  name: string;
  /** Parent id field on commerce product category item. */
  parentId?: string | null;
  /** Path field on commerce product category item. */
  path: string;
  /** Sort order field on commerce product category item. */
  sortOrder: number;
  /** Status field on commerce product category item. */
  status: 'active' | 'inactive' | 'archived';
  /** Updated at field on commerce product category item. */
  updatedAt: string;
}
