from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCouponRedemptionRecord:
    """Commerce coupon redemption record schema exposed by Claw Router."""
    coupon_id: str
    created_at: str
    discount_amount: str
    idempotency_key: str
    order_id: str
    owner_user_id: str
    redeemed_at: str
    request_no: str
    status: str
    tenant_id: str
    updated_at: str
    organization_id: Optional[str] = None
    rolled_back_at: Optional[str] = None
