from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentProviderAccountMutationRequest:
    """Commerce payment provider account mutation request schema exposed by Claw Router."""
    account_no: str
    country_code: str
    environment: str
    merchant_id: str
    provider_code: str
    secret_ref: str
    settlement_currency: str
    status: str
    certificate_ref: Optional[str] = None
    client_request_no: Optional[str] = None
    note: Optional[str] = None
    rotated_at: Optional[str] = None
    webhook_secret_ref: Optional[str] = None
