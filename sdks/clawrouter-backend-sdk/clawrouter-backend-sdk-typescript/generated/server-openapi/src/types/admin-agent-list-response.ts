import type { AdminAgentItem } from './admin-agent-item';

/** Admin agent list response schema exposed by Claw Router. */
export interface AdminAgentListResponse {
  /** Items field on admin agent list response. */
  items: AdminAgentItem[];
}
