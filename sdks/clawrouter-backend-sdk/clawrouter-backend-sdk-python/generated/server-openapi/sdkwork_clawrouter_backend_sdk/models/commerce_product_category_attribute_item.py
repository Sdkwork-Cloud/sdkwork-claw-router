from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductCategoryAttributeItem:
    """Commerce product category attribute item schema exposed by Claw Router."""
    attribute_id: str
    attribute_name: str
    attribute_no: str
    category_id: str
    category_name: str
    category_path: str
    created_at: str
    filterable: bool
    id: str
    required: bool
    scope: str
    searchable: bool
    sort_order: int
    status: str
    updated_at: str
    value_type: str
