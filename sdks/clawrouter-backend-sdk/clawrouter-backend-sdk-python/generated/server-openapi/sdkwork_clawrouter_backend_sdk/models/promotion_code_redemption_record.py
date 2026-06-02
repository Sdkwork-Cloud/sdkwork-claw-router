from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionCodeRedemptionRecord:
    """Promotion code redemption record schema exposed by Claw Router."""
    created_at: str
    currency_code: str
    idempotency_key: str
    occurred_at: str
    offer_id: str
    offer_version_id: str
    redemption_channel: str
    redemption_no: str
    request_no: str
    result_status: str
    stock_id: str
    subject_id: str
    subject_type: str
    submitted_code_hash: str
    tenant_id: str
    code_id: Optional[str] = None
    failure_code: Optional[str] = None
    failure_message: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    owner_user_id: Optional[str] = None
    redemption_scene: Optional[str] = None
    submitted_code_suffix: Optional[str] = None
    user_coupon_id: Optional[str] = None
