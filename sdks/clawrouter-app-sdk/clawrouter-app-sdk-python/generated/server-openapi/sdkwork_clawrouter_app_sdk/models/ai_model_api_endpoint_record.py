from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelApiEndpointRecord:
    """Ai model api endpoint record schema exposed by Claw Router."""
    catalog_key: str
    endpoint_code: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    api_endpoint_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_parameters: Optional[Dict[str, str]] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    model_id: Optional[str] = None
    provider_native_model: Optional[str] = None
    sort_order: Optional[int] = None
    supported: Optional[bool] = None
    supports_streaming: Optional[bool] = None
    updated_at: Optional[str] = None
    vendor_code: Optional[str] = None
    version: Optional[str] = None
