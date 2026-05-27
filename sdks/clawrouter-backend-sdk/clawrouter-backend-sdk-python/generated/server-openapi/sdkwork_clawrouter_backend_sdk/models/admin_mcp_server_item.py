from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminMcpServerItem:
    """Admin mcp server item schema exposed by Claw Router."""
    created_at: str
    health_status: str
    id: int
    name: str
    organization_id: int
    server_key: str
    status: str
    tags: List[str]
    tenant_id: int
    transport: str
    updated_at: str
    uuid: str
    visibility: str
    category_code: Optional[str] = None
    category_id: Optional[str] = None
    deprecated_at: Optional[str] = None
    description: Optional[str] = None
    last_checked_at: Optional[str] = None
    last_error_masked: Optional[str] = None
    latest_revision_id: Optional[int] = None
    owner_user_id: Optional[int] = None
    published_at: Optional[str] = None
    published_revision_id: Optional[int] = None
