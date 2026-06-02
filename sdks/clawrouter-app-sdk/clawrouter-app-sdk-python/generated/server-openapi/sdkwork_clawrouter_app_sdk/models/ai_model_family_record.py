from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AiModelFamilyRecord:
    """Ai model family record schema exposed by Claw Router."""
    display_name: str
    family_code: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    vendor_code: str
    color_token: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_model: Optional[str] = None
    default_model_id: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    docs_url: Optional[str] = None
    family_type: Optional[str] = None
    icon: Optional[MediaResource] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model_count: Optional[str] = None
    primary_modality: Optional[str] = None
    sort_order: Optional[int] = None
    updated_at: Optional[str] = None
    vendor_id: Optional[str] = None
    version: Optional[str] = None
