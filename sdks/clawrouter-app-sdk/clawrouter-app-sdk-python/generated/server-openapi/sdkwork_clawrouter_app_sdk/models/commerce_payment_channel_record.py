from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentChannelRecord:
    """Commerce payment channel record schema exposed by Claw Router."""
    channel_no: str
    country_code: str
    created_at: str
    currency_code: str
    method_id: str
    priority: str
    provider_account_id: str
    scene_code: str
    status: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
