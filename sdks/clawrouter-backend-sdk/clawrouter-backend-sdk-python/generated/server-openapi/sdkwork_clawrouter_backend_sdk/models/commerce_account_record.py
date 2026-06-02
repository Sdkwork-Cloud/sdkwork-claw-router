from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceAccountRecord:
    """Commerce account record schema exposed by Claw Router."""
    asset_type: str
    available_amount: str
    created_at: str
    frozen_amount: str
    owner_user_id: str
    status: str
    tenant_id: str
    updated_at: str
    version: str
    currency_code: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
