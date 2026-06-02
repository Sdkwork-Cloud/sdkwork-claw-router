from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRechargeOrderCreateResponse:
    """Commerce recharge order create response schema exposed by Claw Router."""
    amount: str
    cashier_url: str
    currency_code: str
    next_action: str
    order_no: str
    payment_method: str
    payment_product: str
    points: int
    provider_code: str
    qr_code_payload: str
    status: str
    success: bool
    request_payment_payload: Optional[Dict[str, str]] = None
