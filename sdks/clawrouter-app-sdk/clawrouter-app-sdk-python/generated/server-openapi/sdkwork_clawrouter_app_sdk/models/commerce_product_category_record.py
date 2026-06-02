from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class CommerceProductCategoryRecord:
    """Commerce product category record schema exposed by Claw Router."""
    category_no: str
    created_at: str
    level_no: int
    name: str
    path: str
    sort_order: str
    status: str
    tenant_id: str
    updated_at: str
    description: Optional[str] = None
    icon: Optional[MediaResource] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    parent_id: Optional[str] = None
