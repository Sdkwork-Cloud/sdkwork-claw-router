from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiResourceRecord:
    """Ai resource record schema exposed by Claw Router."""
    organization_id: str
    resource_code: str
    resource_type: str
    status: str
    tenant_id: str
    uuid: str
    api_code: Optional[str] = None
    api_endpoint_id: Optional[str] = None
    catalog_key: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    display_name: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    metadata_schema: Optional[Dict[str, str]] = None
    modality_code: Optional[str] = None
    modality_id: Optional[str] = None
    model: Optional[str] = None
    model_code: Optional[str] = None
    model_id: Optional[str] = None
    provider_native_model: Optional[str] = None
    resource_schema: Optional[Dict[str, str]] = None
    sort_order: Optional[int] = None
    updated_at: Optional[str] = None
    vendor_code: Optional[str] = None
    vendor_id: Optional[str] = None
    version: Optional[str] = None
