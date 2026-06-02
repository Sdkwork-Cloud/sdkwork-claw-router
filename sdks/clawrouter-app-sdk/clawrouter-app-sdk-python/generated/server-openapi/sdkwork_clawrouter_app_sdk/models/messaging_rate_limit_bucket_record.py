from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingRateLimitBucketRecord:
    """Messaging rate limit bucket record schema exposed by Claw Router."""
    channel: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    device_hash: Optional[str] = None
    id: Optional[str] = None
    ip_hash: Optional[str] = None
    last_event_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    reject_count: Optional[int] = None
    scene_code: Optional[str] = None
    send_count: Optional[int] = None
    status: Optional[str] = None
    target_hash: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    verify_count: Optional[int] = None
    version: Optional[str] = None
    window_seconds: Optional[int] = None
    window_start: Optional[str] = None
