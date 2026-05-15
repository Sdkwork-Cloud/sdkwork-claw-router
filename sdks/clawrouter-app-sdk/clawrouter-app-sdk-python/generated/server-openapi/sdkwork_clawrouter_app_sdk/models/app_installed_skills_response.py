from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_installed_skill_item import AppInstalledSkillItem


@dataclass
class AppInstalledSkillsResponse:
    """App installed skills response schema exposed by Claw Router."""
    items: List[AppInstalledSkillItem]
