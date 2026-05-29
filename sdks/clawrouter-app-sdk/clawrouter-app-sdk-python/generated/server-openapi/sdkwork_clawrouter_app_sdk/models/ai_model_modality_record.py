from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelModalityRecord:
    """Ai model modality record schema exposed by Claw Router."""
    catalog_key: str
    modality_code: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    direction: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    modality_id: Optional[str] = None
    model: Optional[str] = None
    model_id: Optional[str] = None
    sort_order: Optional[int] = None
    supported: Optional[bool] = None
    updated_at: Optional[str] = None
    vendor_code: Optional[str] = None
    version: Optional[str] = None
