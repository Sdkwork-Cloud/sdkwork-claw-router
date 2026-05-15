from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_category_mutation_response import AdminSkillCategoryMutationResponse


@dataclass
class SkillsCategoriesCreateResult:
    """Skills categories create result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillCategoryMutationResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
