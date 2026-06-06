from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminUserUpdateRequest:
    """Admin user update request schema exposed by Claw Router."""
    id: str
    group: Optional[str] = None
    status: Optional[str] = None
    username: Optional[str] = None
