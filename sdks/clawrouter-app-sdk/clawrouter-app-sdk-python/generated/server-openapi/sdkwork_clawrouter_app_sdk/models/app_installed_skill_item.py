from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .skill_catalog_item import SkillCatalogItem


@dataclass
class AppInstalledSkillItem:
    """App installed skill item schema exposed by Claw Router."""
    config: Dict[str, str]
    enabled: bool
    id: str
    installed_at: str
    last_enabled_at: str
    skill: SkillCatalogItem
    skill_id: str
