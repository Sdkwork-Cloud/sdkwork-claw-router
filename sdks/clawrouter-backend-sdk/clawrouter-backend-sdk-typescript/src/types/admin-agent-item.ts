import type { AdminAgentCapabilities } from './admin-agent-capabilities';
import type { AdminAgentVersionItem } from './admin-agent-version-item';
import type { MediaResource } from './media-resource';

/** Admin agent item schema exposed by Claw Router. */
export interface AdminAgentItem {
  /** Avatar field on admin agent item. */
  avatar?: MediaResource;
  /** Capabilities field on admin agent item. */
  capabilities: AdminAgentCapabilities;
  /** Code field on admin agent item. */
  code: string;
  /** Created at field on admin agent item. */
  createdAt: string;
  /** Default version field on admin agent item. */
  defaultVersion: AdminAgentVersionItem;
  /** Description field on admin agent item. */
  description: string;
  /** Id field on admin agent item. */
  id: string;
  /** Name field on admin agent item. */
  name: string;
  /** Owner user id field on admin agent item. */
  ownerUserId: number;
  /** Status field on admin agent item. */
  status: 'active' | 'disabled';
  /** Template source field on admin agent item. */
  templateSource?: string | null;
  /** Updated at field on admin agent item. */
  updatedAt: string;
  /** Visibility field on admin agent item. */
  visibility: 'private' | 'organization' | 'public';
}
