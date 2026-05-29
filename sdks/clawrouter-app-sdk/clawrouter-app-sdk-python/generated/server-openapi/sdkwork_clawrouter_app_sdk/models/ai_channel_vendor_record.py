from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChannelVendorRecord:
    """Ai channel vendor record schema exposed by Claw Router."""
    channel_id: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    vendor_code: str
    channel_code: Optional[str] = None
    channel_type: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    provider_code: Optional[str] = None
    sort_order: Optional[int] = None
    supported: Optional[bool] = None
    updated_at: Optional[str] = None
    vendor_id: Optional[str] = None
    version: Optional[str] = None
