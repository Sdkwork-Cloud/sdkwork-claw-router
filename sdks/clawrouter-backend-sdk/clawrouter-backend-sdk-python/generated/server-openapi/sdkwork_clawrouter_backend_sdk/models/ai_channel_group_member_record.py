from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChannelGroupMemberRecord:
    """Ai channel group member record schema exposed by Claw Router."""
    channel_group_id: str
    channel_id: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
