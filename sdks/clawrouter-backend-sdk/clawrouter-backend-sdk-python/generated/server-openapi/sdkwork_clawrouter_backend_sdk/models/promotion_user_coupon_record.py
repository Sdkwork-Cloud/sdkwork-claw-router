from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionUserCouponRecord:
    """Promotion user coupon record schema exposed by Claw Router."""
    activation_status: str
    can_resend: bool
    claim_source: str
    coupon_no: str
    created_at: str
    currency_code: str
    face_value_minor: str
    idempotency_key: str
    maximum_discount_amount_minor: str
    minimum_order_amount_minor: str
    offer_id: str
    offer_version_id: str
    request_no: str
    status: str
    stock_id: str
    subject_id: str
    subject_type: str
    tenant_id: str
    updated_at: str
    verify_method: str
    budget_account_id: Optional[str] = None
    cancel_until: Optional[str] = None
    claim_code_hash: Optional[str] = None
    claim_code_suffix: Optional[str] = None
    claimed_at: Optional[str] = None
    code_id: Optional[str] = None
    coupon_code_hash: Optional[str] = None
    coupon_code_suffix: Optional[str] = None
    disabled_at: Optional[str] = None
    discount_percent_bps: Optional[int] = None
    expires_at: Optional[str] = None
    id: Optional[str] = None
    lock_expires_at: Optional[str] = None
    locked_at: Optional[str] = None
    organization_id: Optional[str] = None
    owner_user_id: Optional[str] = None
    recognition_hash: Optional[str] = None
    recognition_type: Optional[str] = None
    redeemed_at: Optional[str] = None
    returned_at: Optional[str] = None
    valid_from: Optional[str] = None
