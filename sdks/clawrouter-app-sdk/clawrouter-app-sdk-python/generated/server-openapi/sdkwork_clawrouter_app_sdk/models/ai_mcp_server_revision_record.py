from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiMcpServerRevisionRecord:
    """Ai mcp server revision record schema exposed by Claw Router."""
    command: Optional[str] = None
    config_hash: Optional[str] = None
    created_at: Optional[str] = None
    created_by: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    deprecated_at: Optional[str] = None
    endpoint_url: Optional[str] = None
    id: Optional[str] = None
    lifecycle_status: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    published_at: Optional[str] = None
    revision_no: Optional[str] = None
    secret_ref: Optional[str] = None
    server_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    transport: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
