from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAccessGroupCreateRequest:
    """Admin access group create request schema exposed by Claw Router."""
    name: str
    billing_type: Optional[str] = None
    capacity: Optional[Dict[str, Any]] = None
    platform: Optional[str] = None
    rate_multiplier: Optional[float] = None
    status: Optional[str] = None
    type: Optional[str] = None
