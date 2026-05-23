/** Commerce product sku attribute item schema exposed by Claw Router. */
export interface CommerceProductSkuAttributeItem {
  /** Attribute id field on commerce product sku attribute item. */
  attributeId: string;
  /** Attribute name field on commerce product sku attribute item. */
  attributeName: string;
  /** Attribute value id field on commerce product sku attribute item. */
  attributeValueId?: string | null;
  /** Custom value field on commerce product sku attribute item. */
  customValue?: string | null;
  /** Display value field on commerce product sku attribute item. */
  displayValue?: string | null;
  /** Value code field on commerce product sku attribute item. */
  valueCode?: string | null;
}
