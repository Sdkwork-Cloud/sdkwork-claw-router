from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceVipBenefitItem:
    """Commerce vip benefit item schema exposed by Claw Router."""
    benefit_type: str
    code: str
    id: str
    name: str
    status: str
