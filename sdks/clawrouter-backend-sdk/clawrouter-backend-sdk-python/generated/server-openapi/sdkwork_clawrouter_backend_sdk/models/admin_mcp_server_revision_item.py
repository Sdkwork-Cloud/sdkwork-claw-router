from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminMcpServerRevisionItem:
    """Admin mcp server revision item schema exposed by Claw Router."""
    args_json: List[str]
    auth_type: str
    config_hash: str
    created_at: str
    created_by: int
    env_schema: Dict[str, str]
    id: int
    lifecycle_status: str
    organization_id: int
    retry_policy: Dict[str, str]
    revision_no: str
    server_id: int
    status: str
    tenant_id: int
    timeout_ms: int
    transport: str
    updated_at: str
    uuid: str
    command: Optional[str] = None
    deprecated_at: Optional[str] = None
    endpoint_url: Optional[str] = None
    published_at: Optional[str] = None
    secret_ref: Optional[str] = None
