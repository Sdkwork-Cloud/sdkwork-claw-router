from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiAgentMcpServerRecord:
    """Ai agent mcp server record schema exposed by Claw Router."""
    connection_config: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    credential_ref: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_checked_at: Optional[str] = None
    last_error_masked: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    permission_policy: Optional[Dict[str, str]] = None
    prompt_catalog: Optional[Dict[str, str]] = None
    resource_catalog: Optional[Dict[str, str]] = None
    server_code: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    tool_catalog: Optional[Dict[str, str]] = None
    transport_type: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
