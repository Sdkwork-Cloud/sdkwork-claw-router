from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiMcpToolRecord:
    """Ai mcp tool record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    discovered_at: Optional[str] = None
    enabled: Optional[bool] = None
    id: Optional[str] = None
    input_schema: Optional[Dict[str, str]] = None
    last_invoked_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    output_schema: Optional[Dict[str, str]] = None
    rate_limit_policy: Optional[Dict[str, str]] = None
    requires_approval: Optional[bool] = None
    risk_level: Optional[str] = None
    schema_hash: Optional[str] = None
    server_id: Optional[str] = None
    server_revision_id: Optional[str] = None
    sort_weight: Optional[int] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    tool_key: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
