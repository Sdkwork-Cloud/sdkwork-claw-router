from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_installed_skills_response import AppInstalledSkillsResponse


@dataclass
class UsersCurrentSkillsListResult:
    """Users current skills list result schema exposed by Claw Router."""
    code: str
    data: Optional[AppInstalledSkillsResponse] = None
    msg: Optional[str] = None
