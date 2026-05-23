from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductCategoryItem:
    """Commerce product category item schema exposed by Claw Router."""
    category_no: str
    created_at: str
    id: str
    level_no: int
    name: str
    path: str
    sort_order: int
    status: str
    updated_at: str
    parent_id: Optional[str] = None
