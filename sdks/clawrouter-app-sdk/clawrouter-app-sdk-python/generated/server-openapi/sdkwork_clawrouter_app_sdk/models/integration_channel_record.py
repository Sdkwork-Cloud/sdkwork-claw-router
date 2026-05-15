from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationChannelRecord:
    """Integration channel record schema exposed by Claw Router."""
    access_type: Optional[str] = None
    account_id: Optional[str] = None
    base_url_override: Optional[str] = None
    capabilities: Optional[Dict[str, str]] = None
    channel_code: Optional[str] = None
    circuit_breaker_policy: Optional[Dict[str, str]] = None
    consecutive_error_count: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    environment: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_latency_ms: Optional[int] = None
    metadata: Optional[Dict[str, str]] = None
    model_mode: Optional[str] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    priority: Optional[int] = None
    protocol: Optional[str] = None
    provider_code: Optional[str] = None
    provider_id: Optional[str] = None
    proxy_id: Optional[str] = None
    region: Optional[str] = None
    retry_policy: Optional[Dict[str, str]] = None
    rpm_limit: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    timeout_ms: Optional[int] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    weight: Optional[int] = None
