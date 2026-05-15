from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .app_installed_skill_response import AppInstalledSkillResponse


@dataclass
class SkillsDisableResult:
    """Skills disable result schema exposed by Claw Router."""
    code: str
    data: Optional[AppInstalledSkillResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
