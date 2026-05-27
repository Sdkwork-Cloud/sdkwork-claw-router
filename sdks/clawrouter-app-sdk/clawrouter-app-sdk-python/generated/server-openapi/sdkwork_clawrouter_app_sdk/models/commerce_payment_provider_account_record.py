from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentProviderAccountRecord:
    """Commerce payment provider account record schema exposed by Claw Router."""
    account_no: str
    country_code: str
    created_at: str
    environment: str
    merchant_id: str
    provider_code: str
    secret_ref: str
    settlement_currency: str
    status: str
    tenant_id: str
    updated_at: str
    certificate_ref: Optional[str] = None
    organization_id: Optional[str] = None
    rotated_at: Optional[str] = None
    webhook_secret_ref: Optional[str] = None
