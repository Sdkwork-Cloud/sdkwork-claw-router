from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_category_item import AdminAppCategoryItem


@dataclass
class AdminAppCategoryListResponse:
    """Admin app category list response schema exposed by Claw Router."""
    items: List[AdminAppCategoryItem]
