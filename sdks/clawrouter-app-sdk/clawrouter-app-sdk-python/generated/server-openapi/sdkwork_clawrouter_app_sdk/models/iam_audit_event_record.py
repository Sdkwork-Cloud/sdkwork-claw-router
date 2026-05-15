from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamAuditEventRecord:
    """Iam audit event record schema exposed by Claw Router."""
    action: Optional[str] = None
    actor_user_id: Optional[str] = None
    app_id: Optional[str] = None
    created_at: Optional[str] = None
    detail_json: Optional[Dict[str, str]] = None
    environment: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    request_id: Optional[str] = None
    resource_id: Optional[str] = None
    resource_type: Optional[str] = None
    sharding_key: Optional[str] = None
    tenant_id: Optional[str] = None
