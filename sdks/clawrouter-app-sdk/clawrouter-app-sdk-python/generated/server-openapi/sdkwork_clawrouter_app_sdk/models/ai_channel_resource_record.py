from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChannelResourceRecord:
    """Ai channel resource record schema exposed by Claw Router."""
    channel_id: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    channel_code: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    provider_code: Optional[str] = None
    resource_code: Optional[str] = None
    resource_group_code: Optional[str] = None
    resource_group_id: Optional[str] = None
    resource_id: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
