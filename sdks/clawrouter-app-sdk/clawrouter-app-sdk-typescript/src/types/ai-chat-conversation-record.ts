import type { JsonValue } from './json-value';

/** Ai chat conversation record schema exposed by Claw Router. */
export interface AiChatConversationRecord {
  /** Agent id field on ai chat conversation record. */
  agent_id?: string;
  /** Agent session id field on ai chat conversation record. */
  agent_session_id?: string;
  /** Cached token total field on ai chat conversation record. */
  cached_token_total?: string;
  /** Conversation code field on ai chat conversation record. */
  conversation_code?: string;
  /** Cost amount total field on ai chat conversation record. */
  cost_amount_total?: string;
  /** Created at field on ai chat conversation record. */
  created_at?: string;
  /** Currency field on ai chat conversation record. */
  currency?: string;
  /** Data scope field on ai chat conversation record. */
  data_scope?: string;
  /** Default endpoint field on ai chat conversation record. */
  default_endpoint?: string;
  /** Default model field on ai chat conversation record. */
  default_model?: string;
  /** Default provider field on ai chat conversation record. */
  default_provider?: string;
  /** Deleted at field on ai chat conversation record. */
  deleted_at?: string;
  /** Deleted by field on ai chat conversation record. */
  deleted_by?: string;
  /** Id field on ai chat conversation record. */
  id?: string;
  /** Input token total field on ai chat conversation record. */
  input_token_total?: string;
  /** Item count field on ai chat conversation record. */
  item_count?: string;
  /** Last item id field on ai chat conversation record. */
  last_item_id?: string;
  /** Last message preview field on ai chat conversation record. */
  last_message_preview?: string;
  /** Last turn id field on ai chat conversation record. */
  last_turn_id?: string;
  /** Memory space id field on ai chat conversation record. */
  memory_space_id?: string;
  /** Message count field on ai chat conversation record. */
  message_count?: string;
  /** Metadata field on ai chat conversation record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai chat conversation record. */
  organization_id?: string;
  /** Output token total field on ai chat conversation record. */
  output_token_total?: string;
  /** Owner id field on ai chat conversation record. */
  owner_id?: string;
  /** Owner type field on ai chat conversation record. */
  owner_type?: string;
  /** Reasoning token total field on ai chat conversation record. */
  reasoning_token_total?: string;
  /** Source surface field on ai chat conversation record. */
  source_surface?: string;
  /** Status field on ai chat conversation record. */
  status?: string;
  /** Summary field on ai chat conversation record. */
  summary?: string;
  /** Tenant id field on ai chat conversation record. */
  tenant_id?: string;
  /** Title field on ai chat conversation record. */
  title?: string;
  /** Turn count field on ai chat conversation record. */
  turn_count?: string;
  /** Updated at field on ai chat conversation record. */
  updated_at?: string;
  /** User id field on ai chat conversation record. */
  user_id?: string;
  /** Uuid field on ai chat conversation record. */
  uuid?: string;
  /** Version field on ai chat conversation record. */
  version?: string;
  /** Visibility field on ai chat conversation record. */
  visibility?: string;
}
