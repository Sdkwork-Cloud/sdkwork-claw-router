from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusUserAgentSkillRecord:
    """Plus user agent skill record schema exposed by Claw Router."""
    installed_at: Optional[str] = None
    last_enabled_at: Optional[str] = None
    last_used_at: Optional[str] = None
