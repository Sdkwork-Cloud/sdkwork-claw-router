from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsNotificationDeliveryRecord:
    """Ops notification delivery record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    delivered_at: Optional[str] = None
    delivery_channel: Optional[str] = None
    delivery_status: Optional[str] = None
    failure_code: Optional[str] = None
    id: Optional[str] = None
    message_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    read_at: Optional[str] = None
    retry_count: Optional[int] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
