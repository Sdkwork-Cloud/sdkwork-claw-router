from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationProxyRecord:
    """Integration proxy record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    endpoint: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_checked_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    proxy_code: Optional[str] = None
    proxy_type: Optional[str] = None
    region: Optional[str] = None
    secret_hash: Optional[str] = None
    secret_ref: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
