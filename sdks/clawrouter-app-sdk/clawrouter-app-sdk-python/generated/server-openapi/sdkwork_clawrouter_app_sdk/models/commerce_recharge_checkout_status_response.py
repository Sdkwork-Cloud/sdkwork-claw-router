from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRechargeCheckoutStatusResponse:
    """Commerce recharge checkout status response schema exposed by Claw Router."""
    amount: str
    cashier_url: str
    created_at: str
    currency_code: str
    expires_at: str
    next_action: str
    order_no: str
    order_status: str
    out_trade_no: str
    paid_at: str
    payment_method: str
    payment_product: str
    payment_status: str
    points: int
    provider_code: str
    qr_code_payload: str
    recharge_status: str
    status: str
    request_payment_payload: Optional[Dict[str, str]] = None
