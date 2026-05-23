from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelCapabilityRecord:
    """Ai model capability record schema exposed by Claw Router."""
    capability_code: str
    catalog_key: str
    model: str
    model_id: str
    organization_id: str
    status: str
    supported: bool
    tenant_id: str
    uuid: str
    vendor_code: str
    capability: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    endpoint_formats: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    input_modalities: Optional[Dict[str, str]] = None
    limit_unit: Optional[str] = None
    limit_value: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    modality: Optional[str] = None
    output_modalities: Optional[Dict[str, str]] = None
    parameter_name: Optional[str] = None
    parameter_schema: Optional[Dict[str, str]] = None
    schema_version: Optional[str] = None
    sort_order: Optional[int] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
