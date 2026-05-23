from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceOrderRecord:
    """Commerce order record schema exposed by Claw Router."""
    created_at: str
    currency_code: str
    idempotency_key: str
    order_no: str
    owner_user_id: str
    request_no: str
    status: str
    subject: str
    tenant_id: str
    updated_at: str
    cancelled_at: Optional[str] = None
    expired_at: Optional[str] = None
    organization_id: Optional[str] = None
    paid_at: Optional[str] = None
