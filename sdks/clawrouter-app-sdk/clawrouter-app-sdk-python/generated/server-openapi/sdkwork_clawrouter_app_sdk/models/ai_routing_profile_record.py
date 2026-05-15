from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRoutingProfileRecord:
    """Ai routing profile record schema exposed by Claw Router."""
    config_hash: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    policy_id: Optional[str] = None
    profile_name: Optional[str] = None
    profile_version: Optional[str] = None
    published_at: Optional[str] = None
    published_by: Optional[str] = None
    release_status: Optional[str] = None
    rollback_from_profile_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    traffic_percent: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
