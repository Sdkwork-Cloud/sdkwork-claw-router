from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentFeeRecord:
    """Commerce payment fee record schema exposed by Claw Router."""
    amount: str
    created_at: str
    currency_code: str
    fee_type: str
    occurred_at: str
    provider_code: str
    tenant_id: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
    payment_attempt_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    refund_id: Optional[str] = None
    statement_item_id: Optional[str] = None
