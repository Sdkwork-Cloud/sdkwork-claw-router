from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiResourceRouteProfileRecord:
    """Ai resource route profile record schema exposed by Claw Router."""
    failure_strategy: str
    model_requirement: str
    organization_id: str
    resource_code: str
    route_key: str
    route_strategy: str
    selection_strategy: str
    status: str
    tenant_id: str
    uuid: str
    billing_meter_code: Optional[str] = None
    cache_ttl_seconds: Optional[str] = None
    capability: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    endpoint_failover_scope: Optional[str] = None
    http_method: Optional[str] = None
    id: Optional[str] = None
    idempotency_mode: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    parent_object_types: Optional[Dict[str, str]] = None
    path_pattern: Optional[str] = None
    request_extractors: Optional[Dict[str, str]] = None
    resource_id: Optional[str] = None
    response_bindings: Optional[Dict[str, str]] = None
    sort_order: Optional[int] = None
    sticky_object_type: Optional[str] = None
    sticky_scope: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
