from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_category_mutation_response import AdminAppCategoryMutationResponse


@dataclass
class AppsCategoriesCreateResult:
    """Apps categories create result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAppCategoryMutationResponse] = None
    msg: Optional[str] = None
