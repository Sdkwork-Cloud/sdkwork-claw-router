from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiVendorApiEndpointRecord:
    """Ai vendor api endpoint record schema exposed by Claw Router."""
    endpoint_code: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    vendor_code: str
    api_endpoint_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    sort_order: Optional[int] = None
    supported: Optional[bool] = None
    updated_at: Optional[str] = None
    vendor_id: Optional[str] = None
    version: Optional[str] = None
