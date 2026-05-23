from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductCategoryMutationRequest:
    """Commerce product category mutation request schema exposed by Claw Router."""
    category_no: str
    name: str
    status: str
    parent_id: Optional[str] = None
    sort_order: Optional[int] = None
