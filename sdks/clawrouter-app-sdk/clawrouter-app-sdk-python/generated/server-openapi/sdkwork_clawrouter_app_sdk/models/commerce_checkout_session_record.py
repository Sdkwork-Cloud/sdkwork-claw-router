from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCheckoutSessionRecord:
    """Commerce checkout session record schema exposed by Claw Router."""
    checkout_session_no: str
    created_at: str
    currency_code: str
    expires_at: str
    idempotency_key: str
    owner_user_id: str
    request_hash: str
    source_type: str
    status: str
    tenant_id: str
    updated_at: str
    organization_id: Optional[str] = None
    source_id: Optional[str] = None
