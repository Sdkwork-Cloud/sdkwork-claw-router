from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiAgentToolBindingRecord:
    """Ai agent tool binding record schema exposed by Claw Router."""
    agent_id: Optional[str] = None
    agent_version_id: Optional[str] = None
    binding_key: Optional[str] = None
    binding_type: Optional[str] = None
    created_at: Optional[str] = None
    credential_ref: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    enabled: Optional[bool] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_checked_at: Optional[str] = None
    mcp_server_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    permission_policy: Optional[Dict[str, str]] = None
    runtime_config: Optional[Dict[str, str]] = None
    skill_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    tool_name: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
