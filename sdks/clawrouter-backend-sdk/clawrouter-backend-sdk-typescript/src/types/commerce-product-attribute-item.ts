/** Commerce product attribute item schema exposed by Claw Router. */
export interface CommerceProductAttributeItem {
  /** Attribute no field on commerce product attribute item. */
  attributeNo: string;
  /** Filterable field on commerce product attribute item. */
  filterable: boolean;
  /** Id field on commerce product attribute item. */
  id: string;
  /** Name field on commerce product attribute item. */
  name: string;
  /** Required field on commerce product attribute item. */
  required: boolean;
  /** Scope field on commerce product attribute item. */
  scope: 'spu' | 'sku' | 'both';
  /** Searchable field on commerce product attribute item. */
  searchable: boolean;
  /** Status field on commerce product attribute item. */
  status: 'active' | 'inactive' | 'archived';
  /** Value type field on commerce product attribute item. */
  valueType: 'text' | 'number' | 'boolean' | 'enum' | 'date';
}
