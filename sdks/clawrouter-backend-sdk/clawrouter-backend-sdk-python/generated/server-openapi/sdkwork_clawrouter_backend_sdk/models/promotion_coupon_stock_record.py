from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionCouponStockRecord:
    """Promotion coupon stock record schema exposed by Claw Router."""
    activation_status: str
    available_quantity: str
    can_resend: bool
    claimed_quantity: str
    code_mode: str
    created_at: str
    currency_code: str
    disabled_quantity: str
    generated_quantity: str
    issue_channel: str
    locked_quantity: str
    name: str
    offer_id: str
    offer_version_id: str
    overspend_policy: str
    redeemed_quantity: str
    requested_quantity: str
    returned_quantity: str
    status: str
    stock_no: str
    stock_type: str
    tenant_id: str
    title: str
    updated_at: str
    budget_account_id: Optional[str] = None
    budget_stop_threshold_bps: Optional[int] = None
    budget_warning_threshold_bps: Optional[int] = None
    cancel_until: Optional[str] = None
    code_prefix: Optional[str] = None
    created_by: Optional[str] = None
    expires_at: Optional[str] = None
    id: Optional[str] = None
    max_claims_per_natural_person: Optional[int] = None
    max_claims_per_subject: Optional[int] = None
    organization_id: Optional[str] = None
    per_subject_limit: Optional[str] = None
    starts_at: Optional[str] = None
    stock_creator_merchant_id: Optional[str] = None
    total_quantity: Optional[str] = None
    updated_by: Optional[str] = None
