from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamSessionRefreshRequest:
    """Iam session refresh request schema exposed by Claw Router."""
    refresh_token: Optional[str] = None
