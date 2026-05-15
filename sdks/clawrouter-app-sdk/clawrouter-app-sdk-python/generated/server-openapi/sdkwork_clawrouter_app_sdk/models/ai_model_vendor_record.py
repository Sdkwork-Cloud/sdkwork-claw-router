from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelVendorRecord:
    """Ai model vendor record schema exposed by Claw Router."""
    display_name: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    vendor_code: str
    capabilities: Optional[Dict[str, str]] = None
    color_token: Optional[str] = None
    country_region: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    docs_url: Optional[str] = None
    icon_url: Optional[str] = None
    id: Optional[str] = None
    legal_name: Optional[str] = None
    logo_url: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model_families: Optional[Dict[str, str]] = None
    open_source: Optional[bool] = None
    sort_order: Optional[int] = None
    updated_at: Optional[str] = None
    vendor_type: Optional[str] = None
    version: Optional[str] = None
    website_url: Optional[str] = None
