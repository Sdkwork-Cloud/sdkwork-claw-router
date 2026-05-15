from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .skill_catalog_item import SkillCatalogItem


@dataclass
class SkillsCatalogResponse:
    """Skills catalog response schema exposed by Claw Router."""
    items: List[SkillCatalogItem]
