from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminSkillAssetDeleteResponse:
    """Admin skill asset delete response schema exposed by Claw Router."""
    deleted: bool
