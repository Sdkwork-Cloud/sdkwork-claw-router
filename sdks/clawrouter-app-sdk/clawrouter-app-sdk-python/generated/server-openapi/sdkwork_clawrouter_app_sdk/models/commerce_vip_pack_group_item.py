from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceVipPackGroupItem:
    """Commerce vip pack group item schema exposed by Claw Router."""
    code: str
    id: str
    name: str
    sort_order: int
    status: str
