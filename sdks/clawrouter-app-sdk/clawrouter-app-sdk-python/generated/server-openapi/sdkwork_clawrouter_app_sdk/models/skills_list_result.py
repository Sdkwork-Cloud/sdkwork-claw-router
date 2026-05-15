from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .skills_catalog_response import SkillsCatalogResponse


@dataclass
class SkillsListResult:
    """Skills list result schema exposed by Claw Router."""
    code: str
    data: Optional[SkillsCatalogResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
