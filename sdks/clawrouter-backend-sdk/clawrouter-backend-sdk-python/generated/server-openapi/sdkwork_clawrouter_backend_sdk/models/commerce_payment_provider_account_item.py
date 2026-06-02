from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentProviderAccountItem:
    """Commerce payment provider account item schema exposed by Claw Router."""
    account_no: str
    country_code: str
    created_at: str
    environment: str
    id: str
    merchant_id: str
    provider_code: str
    secret_ref: str
    settlement_currency: str
    status: str
    updated_at: str
    account_role: Optional[str] = None
    certificate_ref: Optional[str] = None
    note: Optional[str] = None
    rotated_at: Optional[str] = None
    webhook_secret_ref: Optional[str] = None
