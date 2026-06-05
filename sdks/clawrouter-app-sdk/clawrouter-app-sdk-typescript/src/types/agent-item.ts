import type { AgentCapabilities } from './agent-capabilities';
import type { AgentVersionItem } from './agent-version-item';
import type { MediaResource } from './media-resource';

/** Agent item schema exposed by Claw Router. */
export interface AgentItem {
  /** Avatar field on agent item. */
  avatar?: MediaResource;
  /** Capabilities field on agent item. */
  capabilities: AgentCapabilities;
  /** Code field on agent item. */
  code: string;
  /** Created at field on agent item. */
  createdAt: string;
  /** Default version field on agent item. */
  defaultVersion: AgentVersionItem;
  /** Description field on agent item. */
  description: string;
  /** Id field on agent item. */
  id: string;
  /** Name field on agent item. */
  name: string;
  /** Owner user id field on agent item. */
  ownerUserId: string;
  /** Status field on agent item. */
  status: 'active' | 'disabled';
  /** Template source field on agent item. */
  templateSource?: string | null;
  /** Updated at field on agent item. */
  updatedAt: string;
  /** Visibility field on agent item. */
  visibility: 'private' | 'organization' | 'public';
}
