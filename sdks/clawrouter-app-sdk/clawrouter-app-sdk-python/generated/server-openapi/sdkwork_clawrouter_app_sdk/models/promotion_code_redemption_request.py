from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionCodeRedemptionRequest:
    """Promotion code redemption request schema exposed by Claw Router."""
    code: str
    client_request_no: Optional[str] = None
    note: Optional[str] = None
    scene: Optional[str] = None
    source: Optional[str] = None
