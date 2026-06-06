from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductCategoryAttributeMutationRequest:
    """Commerce product category attribute mutation request schema exposed by Claw Router."""
    attribute_id: str
    category_id: str
    filterable: bool
    required: bool
    searchable: bool
    status: str
    sort_order: Optional[str] = None
