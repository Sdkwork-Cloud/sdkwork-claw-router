from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceVipLevelItem:
    """Commerce vip level item schema exposed by Claw Router."""
    code: str
    id: str
    name: str
    rank: int
    status: str
