from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductCategoryRecord:
    """Commerce product category record schema exposed by Claw Router."""
    category_no: str
    created_at: str
    level_no: int
    name: str
    path: str
    status: str
    tenant_id: str
    updated_at: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    organization_id: Optional[str] = None
    parent_id: Optional[str] = None
