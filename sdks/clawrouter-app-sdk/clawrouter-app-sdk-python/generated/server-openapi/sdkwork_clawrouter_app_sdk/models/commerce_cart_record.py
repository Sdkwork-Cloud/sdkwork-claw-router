from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCartRecord:
    """Commerce cart record schema exposed by Claw Router."""
    cart_no: str
    created_at: str
    currency_code: str
    owner_user_id: str
    status: str
    tenant_id: str
    updated_at: str
    version: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
