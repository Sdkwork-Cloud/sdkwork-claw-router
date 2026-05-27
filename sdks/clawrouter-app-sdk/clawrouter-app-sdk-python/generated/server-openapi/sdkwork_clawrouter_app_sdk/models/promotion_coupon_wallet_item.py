from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionCouponWalletItem:
    """Promotion coupon wallet item schema exposed by Claw Router."""
    claim_source: str
    claimed_at: str
    coupon_no: str
    currency_code: str
    expires_at: str
    id: str
    offer_id: str
    status: str
    stock_id: str
    valid_from: str
    code_id: Optional[str] = None
    discount_type: Optional[str] = None
    face_value_minor: Optional[int] = None
    lock_expires_at: Optional[str] = None
    locked_at: Optional[str] = None
    redeemed_at: Optional[str] = None
    returned_at: Optional[str] = None
    source_code_last4: Optional[str] = None
