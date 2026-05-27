/** Admin access group channel binding item schema exposed by Claw Router. */
export interface AdminAccessGroupChannelBindingItem {
  /** Capabilities field on admin access group channel binding item. */
  capabilities: string[];
  /** Channel code field on admin access group channel binding item. */
  channelCode: string;
  /** Channel id field on admin access group channel binding item. */
  channelId: string;
  /** Channel name field on admin access group channel binding item. */
  channelName: string;
  /** Group id field on admin access group channel binding item. */
  groupId: string;
  /** Health status field on admin access group channel binding item. */
  healthStatus: 'active' | 'error';
  /** Id field on admin access group channel binding item. */
  id: string;
  /** Model scope field on admin access group channel binding item. */
  modelScope: string[];
  /** Models field on admin access group channel binding item. */
  models: string[];
  /** Priority field on admin access group channel binding item. */
  priority: number;
  /** Provider code field on admin access group channel binding item. */
  providerCode: string;
  /** Provider name field on admin access group channel binding item. */
  providerName: string;
  /** Status field on admin access group channel binding item. */
  status: 'active' | 'disabled';
  /** Weight field on admin access group channel binding item. */
  weight: number;
}
