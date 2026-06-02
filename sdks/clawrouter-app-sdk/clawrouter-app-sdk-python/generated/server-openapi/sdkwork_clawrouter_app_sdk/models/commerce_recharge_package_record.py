from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRechargePackageRecord:
    """Commerce recharge package record schema exposed by Claw Router."""
    bonus_points: str
    created_at: str
    currency_code: str
    external_id: str
    idempotency_key: str
    name: str
    package_no: str
    price_amount: str
    request_no: str
    sku_id: str
    sort_weight: str
    status: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
    valid_from: Optional[str] = None
    valid_to: Optional[str] = None
