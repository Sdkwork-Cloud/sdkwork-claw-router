from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusAgentSkillPackageRecord:
    """Plus agent skill package record schema exposed by Claw Router."""
    category_id: Optional[str] = None
    cover_image: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    latest_published_at: Optional[str] = None
    summary: Optional[str] = None
    user_id: Optional[str] = None
