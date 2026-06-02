from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRouteIdempotencyRecord:
    """Ai route idempotency record schema exposed by Claw Router."""
    api_key_id: str
    idempotency_key: str
    organization_id: str
    request_hash: str
    status: str
    tenant_id: str
    uuid: str
    channel_group_id: Optional[str] = None
    channel_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    endpoint_id: Optional[str] = None
    expires_at: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    object_id: Optional[str] = None
    object_type: Optional[str] = None
    response_status: Optional[int] = None
    route_strategy: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
