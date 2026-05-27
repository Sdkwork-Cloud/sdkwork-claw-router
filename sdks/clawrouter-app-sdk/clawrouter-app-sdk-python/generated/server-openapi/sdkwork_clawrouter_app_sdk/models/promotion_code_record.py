from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionCodeRecord:
    """Promotion code record schema exposed by Claw Router."""
    activation_status: str
    can_resend: bool
    code_no: str
    code_type: str
    created_at: str
    currency_code: str
    offer_id: str
    offer_version_id: str
    promotion_code_hash: str
    status: str
    stock_id: str
    tenant_id: str
    updated_at: str
    activated_at: Optional[str] = None
    cancel_until: Optional[str] = None
    canceled_at: Optional[str] = None
    channel_code: Optional[str] = None
    claim_code_hash: Optional[str] = None
    claim_code_suffix: Optional[str] = None
    created_by: Optional[str] = None
    expires_at: Optional[str] = None
    organization_id: Optional[str] = None
    promotion_code_last4: Optional[str] = None
    starts_at: Optional[str] = None
    updated_by: Optional[str] = None
