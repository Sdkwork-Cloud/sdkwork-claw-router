from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentMethodItem:
    """Commerce payment method item schema exposed by Claw Router."""
    checkout_scenes: List[str]
    created_at: str
    display_name: str
    id: str
    method_code: str
    method_type: str
    sort_order: int
    status: str
    updated_at: str
    provider_code: Optional[str] = None
