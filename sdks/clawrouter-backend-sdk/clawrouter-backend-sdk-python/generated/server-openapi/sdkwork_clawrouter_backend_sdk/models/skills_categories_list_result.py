from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_category_list_response import AdminSkillCategoryListResponse


@dataclass
class SkillsCategoriesListResult:
    """Skills categories list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillCategoryListResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
