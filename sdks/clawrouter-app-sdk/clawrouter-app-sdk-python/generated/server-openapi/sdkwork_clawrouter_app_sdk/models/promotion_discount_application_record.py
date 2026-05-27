from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionDiscountApplicationRecord:
    """Promotion discount application record schema exposed by Claw Router."""
    application_no: str
    created_at: str
    currency_code: str
    idempotency_key: str
    offer_id: str
    offer_version_id: str
    order_id: str
    request_no: str
    status: str
    subject_id: str
    subject_type: str
    tenant_id: str
    updated_at: str
    applied_at: Optional[str] = None
    budget_account_id: Optional[str] = None
    failure_code: Optional[str] = None
    failure_message: Optional[str] = None
    order_no: Optional[str] = None
    organization_id: Optional[str] = None
    payment_id: Optional[str] = None
    released_at: Optional[str] = None
    reservation_expires_at: Optional[str] = None
    reserved_at: Optional[str] = None
    rolled_back_at: Optional[str] = None
    rule_snapshot_json: Optional[Dict[str, str]] = None
    settled_at: Optional[str] = None
    stock_id: Optional[str] = None
    user_coupon_id: Optional[str] = None
