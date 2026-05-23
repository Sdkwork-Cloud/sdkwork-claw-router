from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_category_delete_response import AdminSkillCategoryDeleteResponse


@dataclass
class SkillsCategoriesDeleteResult:
    """Skills categories delete result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillCategoryDeleteResponse] = None
    msg: Optional[str] = None
