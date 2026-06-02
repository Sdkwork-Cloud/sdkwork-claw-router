from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceAccountHoldRecord:
    """Commerce account hold record schema exposed by Claw Router."""
    account_id: str
    amount: str
    asset_type: str
    created_at: str
    expires_at: str
    idempotency_key: str
    owner_user_id: str
    prehold_no: str
    request_no: str
    status: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
    released_at: Optional[str] = None
    settled_at: Optional[str] = None
