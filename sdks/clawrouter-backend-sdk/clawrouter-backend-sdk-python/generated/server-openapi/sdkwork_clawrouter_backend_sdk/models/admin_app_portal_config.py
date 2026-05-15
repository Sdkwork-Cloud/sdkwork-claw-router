from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAppPortalConfig:
    """Admin app portal config schema exposed by Claw Router."""
    market_status: Optional[str] = None
