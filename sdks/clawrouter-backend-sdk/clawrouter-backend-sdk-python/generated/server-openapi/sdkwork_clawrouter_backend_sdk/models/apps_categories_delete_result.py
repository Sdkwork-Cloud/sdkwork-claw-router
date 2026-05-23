from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_category_delete_response import AdminAppCategoryDeleteResponse


@dataclass
class AppsCategoriesDeleteResult:
    """Apps categories delete result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAppCategoryDeleteResponse] = None
    msg: Optional[str] = None
