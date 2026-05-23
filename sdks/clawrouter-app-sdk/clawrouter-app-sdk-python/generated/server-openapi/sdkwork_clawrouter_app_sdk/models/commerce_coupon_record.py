from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCouponRecord:
    """Commerce coupon record schema exposed by Claw Router."""
    coupon_code: str
    created_at: str
    idempotency_key: str
    request_no: str
    status: str
    template_id: str
    tenant_id: str
    updated_at: str
    claimed_at: Optional[str] = None
    disabled_at: Optional[str] = None
    expires_at: Optional[str] = None
    issue_batch_id: Optional[str] = None
    organization_id: Optional[str] = None
    owner_user_id: Optional[str] = None
    redeemed_at: Optional[str] = None
