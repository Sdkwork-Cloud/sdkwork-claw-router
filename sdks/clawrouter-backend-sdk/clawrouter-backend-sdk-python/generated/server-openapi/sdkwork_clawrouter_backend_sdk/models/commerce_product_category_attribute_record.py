from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductCategoryAttributeRecord:
    """Commerce product category attribute record schema exposed by Claw Router."""
    attribute_id: str
    category_id: str
    created_at: str
    filterable: bool
    required: bool
    searchable: bool
    sort_order: str
    status: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
