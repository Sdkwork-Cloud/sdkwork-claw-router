import type { JsonValue } from './json-value';

/** Admin mcp binding item schema exposed by Claw Router. */
export interface AdminMcpBindingItem {
  /** Allowed tools field on admin mcp binding item. */
  allowedTools: string[];
  /** Created at field on admin mcp binding item. */
  createdAt: string;
  /** Denied tools field on admin mcp binding item. */
  deniedTools: string[];
  /** Enabled field on admin mcp binding item. */
  enabled: boolean;
  /** Id field on admin mcp binding item. */
  id: number;
  /** Organization id field on admin mcp binding item. */
  organizationId: number;
  /** Owner id field on admin mcp binding item. */
  ownerId: number;
  /** Owner type field on admin mcp binding item. */
  ownerType: string;
  /** Policy json field on admin mcp binding item. */
  policyJson: Record<string, JsonValue>;
  /** Priority field on admin mcp binding item. */
  priority: number;
  /** Server id field on admin mcp binding item. */
  serverId: number;
  /** Server revision id field on admin mcp binding item. */
  serverRevisionId?: number | null;
  /** Snapshot json field on admin mcp binding item. */
  snapshotJson: Record<string, JsonValue>;
  /** Status field on admin mcp binding item. */
  status: string;
  /** Tenant id field on admin mcp binding item. */
  tenantId: number;
  /** Tool id field on admin mcp binding item. */
  toolId?: number | null;
  /** Updated at field on admin mcp binding item. */
  updatedAt: string;
  /** Uuid field on admin mcp binding item. */
  uuid: string;
}
