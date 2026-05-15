from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePreflightRequest:
    """Commerce preflight request schema exposed by Claw Router."""
    amount: str
    request_no: str
    business_type: Optional[str] = None
    remarks: Optional[str] = None
