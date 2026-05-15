from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceWalletCommandRequest:
    """Commerce wallet command request schema exposed by Claw Router."""
    amount: str
    request_no: str
    asset_type: Optional[str] = None
    remarks: Optional[str] = None
