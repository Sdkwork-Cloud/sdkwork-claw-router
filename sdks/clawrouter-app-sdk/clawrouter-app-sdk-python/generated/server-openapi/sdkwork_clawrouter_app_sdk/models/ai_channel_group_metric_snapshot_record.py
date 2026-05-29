from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChannelGroupMetricSnapshotRecord:
    """Ai channel group metric snapshot record schema exposed by Claw Router."""
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    capacity_limit: Optional[str] = None
    capacity_used: Optional[str] = None
    channel_available_count: Optional[str] = None
    channel_group_id: Optional[str] = None
    channel_total_count: Optional[str] = None
    created_at: Optional[str] = None
    group_code: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    provider_code: Optional[str] = None
    rebuild_version: Optional[str] = None
    request_count_today: Optional[str] = None
    request_count_total: Optional[str] = None
    snapshot_at: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    updated_at: Optional[str] = None
    usage_amount_today: Optional[str] = None
    usage_amount_total: Optional[str] = None
