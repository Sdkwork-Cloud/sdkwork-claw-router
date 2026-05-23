import type { CommerceProductSkuAttributeItem } from './commerce-product-sku-attribute-item';

/** Commerce product sku mutation request schema exposed by Claw Router. */
export interface CommerceProductSkuMutationRequest {
  /** Attributes field on commerce product sku mutation request. */
  attributes?: CommerceProductSkuAttributeItem[];
  /** Default currency code field on commerce product sku mutation request. */
  defaultCurrencyCode?: string | null;
  /** Default price amount field on commerce product sku mutation request. */
  defaultPriceAmount?: string | null;
  /** Fulfillment type field on commerce product sku mutation request. */
  fulfillmentType: 'physical_shipment' | 'digital_delivery' | 'entitlement_grant' | 'points_credit' | 'wallet_credit' | 'subscription_activation' | 'service_activation' | 'none';
  /** Product id field on commerce product sku mutation request. */
  productId: string;
  /** Sales unit field on commerce product sku mutation request. */
  salesUnit?: string | null;
  /** Sku no field on commerce product sku mutation request. */
  skuNo: string;
  /** Status field on commerce product sku mutation request. */
  status: 'draft' | 'active' | 'inactive' | 'archived';
  /** Tax category field on commerce product sku mutation request. */
  taxCategory?: string | null;
  /** Title field on commerce product sku mutation request. */
  title: string;
}
