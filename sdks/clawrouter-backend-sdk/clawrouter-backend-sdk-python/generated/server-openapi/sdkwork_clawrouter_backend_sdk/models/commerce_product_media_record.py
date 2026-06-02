from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductMediaRecord:
    """Commerce product media record schema exposed by Claw Router."""
    created_at: str
    media_resource_id: str
    media_role: str
    owner_id: str
    owner_type: str
    sort_order: str
    status: str
    tenant_id: str
    updated_at: str
    alt_text: Optional[str] = None
    id: Optional[str] = None
    object_blob_id: Optional[str] = None
    organization_id: Optional[str] = None
    resource_snapshot: Optional[Dict[str, str]] = None
