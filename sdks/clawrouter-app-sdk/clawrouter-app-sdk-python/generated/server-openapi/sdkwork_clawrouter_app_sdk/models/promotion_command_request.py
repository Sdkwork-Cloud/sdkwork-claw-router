from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionCommandRequest:
    """Promotion command request schema exposed by Claw Router."""
    client_request_no: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    note: Optional[str] = None
