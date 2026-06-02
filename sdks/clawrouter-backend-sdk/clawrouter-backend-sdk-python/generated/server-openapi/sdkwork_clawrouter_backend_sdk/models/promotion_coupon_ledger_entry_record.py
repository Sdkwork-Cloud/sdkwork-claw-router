from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionCouponLedgerEntryRecord:
    """Promotion coupon ledger entry record schema exposed by Claw Router."""
    balance_after: str
    business_type: str
    created_at: str
    direction: str
    idempotency_key: str
    ledger_no: str
    occurred_at: str
    offer_id: str
    quantity_delta: str
    request_no: str
    source_id: str
    source_type: str
    stock_id: str
    tenant_id: str
    application_id: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    subject_id: Optional[str] = None
    subject_type: Optional[str] = None
    user_coupon_id: Optional[str] = None
