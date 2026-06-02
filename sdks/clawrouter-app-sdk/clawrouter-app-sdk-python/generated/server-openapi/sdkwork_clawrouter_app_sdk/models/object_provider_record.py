from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ObjectProviderRecord:
    """Object provider record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    credential_ref: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    endpoint_url: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    idempotency_key: Optional[str] = None
    last_health_check_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    path_style_enabled: Optional[bool] = None
    provider_code: Optional[str] = None
    provider_type: Optional[str] = None
    region: Optional[str] = None
    request_id: Optional[str] = None
    status: Optional[str] = None
    supports_lifecycle: Optional[bool] = None
    supports_multipart: Optional[bool] = None
    supports_object_lock: Optional[bool] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
