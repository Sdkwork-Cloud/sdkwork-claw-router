import type { CommerceProductSkuAttributeItem } from './commerce-product-sku-attribute-item';

/** Commerce product sku item schema exposed by Claw Router. */
export interface CommerceProductSkuItem {
  /** Attributes field on commerce product sku item. */
  attributes?: CommerceProductSkuAttributeItem[];
  /** Created at field on commerce product sku item. */
  createdAt: string;
  /** Default currency code field on commerce product sku item. */
  defaultCurrencyCode?: string | null;
  /** Default price amount field on commerce product sku item. */
  defaultPriceAmount?: string | null;
  /** Fulfillment type field on commerce product sku item. */
  fulfillmentType: 'physical_shipment' | 'digital_delivery' | 'entitlement_grant' | 'points_credit' | 'wallet_credit' | 'subscription_activation' | 'service_activation' | 'none';
  /** Id field on commerce product sku item. */
  id: string;
  /** Product id field on commerce product sku item. */
  productId: string;
  /** Published at field on commerce product sku item. */
  publishedAt?: string | null;
  /** Sales unit field on commerce product sku item. */
  salesUnit?: string | null;
  /** Sku no field on commerce product sku item. */
  skuNo: string;
  /** Status field on commerce product sku item. */
  status: 'draft' | 'active' | 'inactive' | 'archived';
  /** Tax category field on commerce product sku item. */
  taxCategory?: string | null;
  /** Title field on commerce product sku item. */
  title: string;
  /** Updated at field on commerce product sku item. */
  updatedAt: string;
}
