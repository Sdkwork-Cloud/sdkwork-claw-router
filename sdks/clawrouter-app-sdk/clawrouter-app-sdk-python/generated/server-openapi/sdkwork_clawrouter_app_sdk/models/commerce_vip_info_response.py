from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceVipInfoResponse:
    """Commerce vip info response schema exposed by Claw Router."""
    level_code: str
    level_name: str
    status: str
