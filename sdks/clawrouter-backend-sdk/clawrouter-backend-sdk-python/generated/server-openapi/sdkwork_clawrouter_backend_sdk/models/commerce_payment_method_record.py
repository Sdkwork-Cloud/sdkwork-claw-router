from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentMethodRecord:
    """Commerce payment method record schema exposed by Claw Router."""
    created_at: str
    display_name: str
    idempotency_key: str
    method_key: str
    provider: str
    request_no: str
    sort_weight: str
    status: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
