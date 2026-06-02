/** Commerce product category attribute item schema exposed by Claw Router. */
export interface CommerceProductCategoryAttributeItem {
  /** Attribute id field on commerce product category attribute item. */
  attributeId: string;
  /** Attribute name field on commerce product category attribute item. */
  attributeName: string;
  /** Attribute no field on commerce product category attribute item. */
  attributeNo: string;
  /** Category id field on commerce product category attribute item. */
  categoryId: string;
  /** Category name field on commerce product category attribute item. */
  categoryName: string;
  /** Category path field on commerce product category attribute item. */
  categoryPath: string;
  /** Created at field on commerce product category attribute item. */
  createdAt: string;
  /** Filterable field on commerce product category attribute item. */
  filterable: boolean;
  /** Id field on commerce product category attribute item. */
  id: string;
  /** Required field on commerce product category attribute item. */
  required: boolean;
  /** Scope field on commerce product category attribute item. */
  scope: 'spu' | 'sku' | 'both';
  /** Searchable field on commerce product category attribute item. */
  searchable: boolean;
  /** Sort order field on commerce product category attribute item. */
  sortOrder: number;
  /** Status field on commerce product category attribute item. */
  status: 'active' | 'inactive' | 'archived';
  /** Updated at field on commerce product category attribute item. */
  updatedAt: string;
  /** Value type field on commerce product category attribute item. */
  valueType: 'text' | 'number' | 'boolean' | 'enum' | 'date';
}
