from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChannelEndpointRecord:
    """Ai channel endpoint record schema exposed by Claw Router."""
    api_code: str
    base_url: str
    channel_code: str
    channel_id: str
    channel_type: str
    organization_id: str
    region_code: str
    status: str
    tenant_id: str
    uuid: str
    vendor_code: str
    api_endpoint_id: Optional[str] = None
    consecutive_error_count: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_latency_ms: Optional[int] = None
    metadata: Optional[Dict[str, str]] = None
    path_prefix: Optional[str] = None
    priority: Optional[int] = None
    provider_code: Optional[str] = None
    retry_policy: Optional[Dict[str, str]] = None
    timeout_ms: Optional[int] = None
    updated_at: Optional[str] = None
    vendor_id: Optional[str] = None
    version: Optional[str] = None
    weight: Optional[int] = None
