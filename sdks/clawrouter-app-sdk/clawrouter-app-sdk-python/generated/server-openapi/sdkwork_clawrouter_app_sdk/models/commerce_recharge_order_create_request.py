from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRechargeOrderCreateRequest:
    """Commerce recharge order create request schema exposed by Claw Router."""
    amount: str
    currency_code: str
    source: str
    client_request_no: Optional[str] = None
    package_id: Optional[str] = None
