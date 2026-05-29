from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModalityRecord:
    """Ai modality record schema exposed by Claw Router."""
    display_name: str
    modality_code: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    id: Optional[str] = None
    input_supported: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    modality_group: Optional[str] = None
    output_supported: Optional[bool] = None
    sort_order: Optional[int] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
