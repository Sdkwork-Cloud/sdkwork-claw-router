/** Commerce product attribute mutation request schema exposed by Claw Router. */
export interface CommerceProductAttributeMutationRequest {
  /** Attribute no field on commerce product attribute mutation request. */
  attributeNo: string;
  /** Filterable field on commerce product attribute mutation request. */
  filterable: boolean;
  /** Name field on commerce product attribute mutation request. */
  name: string;
  /** Required field on commerce product attribute mutation request. */
  required: boolean;
  /** Scope field on commerce product attribute mutation request. */
  scope: 'spu' | 'sku' | 'both';
  /** Searchable field on commerce product attribute mutation request. */
  searchable: boolean;
  /** Status field on commerce product attribute mutation request. */
  status: 'active' | 'inactive' | 'archived';
  /** Value type field on commerce product attribute mutation request. */
  valueType: 'text' | 'number' | 'boolean' | 'enum' | 'date';
}
