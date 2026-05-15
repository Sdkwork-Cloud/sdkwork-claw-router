/** Commerce exchange rule item schema exposed by Claw Router. */
export interface CommerceExchangeRuleItem {
  /** Id field on commerce exchange rule item. */
  id: string;
  /** Rate field on commerce exchange rule item. */
  rate: string;
  /** Source asset type field on commerce exchange rule item. */
  sourceAssetType: string;
  /** Status field on commerce exchange rule item. */
  status: 'active' | 'inactive';
  /** Target asset type field on commerce exchange rule item. */
  targetAssetType: string;
}
