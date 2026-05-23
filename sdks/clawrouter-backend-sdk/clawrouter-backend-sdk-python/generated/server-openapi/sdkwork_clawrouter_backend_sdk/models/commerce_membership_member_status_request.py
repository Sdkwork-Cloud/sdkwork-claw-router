from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceMembershipMemberStatusRequest:
    """Commerce membership member status request schema exposed by Claw Router."""
    status: str
