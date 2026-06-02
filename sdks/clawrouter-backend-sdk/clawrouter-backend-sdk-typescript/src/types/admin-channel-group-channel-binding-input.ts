/** Admin channel group channel binding input schema exposed by Claw Router. */
export interface AdminChannelGroupChannelBindingInput {
  /** Capabilities field on admin channel group channel binding input. */
  capabilities?: string[];
  /** Channel id field on admin channel group channel binding input. */
  channelId: string;
  /** Model scope field on admin channel group channel binding input. */
  modelScope?: string[];
  /** Priority field on admin channel group channel binding input. */
  priority?: number;
  /** Status field on admin channel group channel binding input. */
  status?: 'active' | 'disabled';
  /** Weight field on admin channel group channel binding input. */
  weight?: number;
}
