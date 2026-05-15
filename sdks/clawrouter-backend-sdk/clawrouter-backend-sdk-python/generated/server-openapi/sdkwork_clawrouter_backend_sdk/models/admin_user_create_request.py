from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminUserCreateRequest:
    """Admin user create request schema exposed by Claw Router."""
    email: str
    balance: Optional[str] = None
    username: Optional[str] = None
