from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCouponTemplateRecord:
    """Commerce coupon template record schema exposed by Claw Router."""
    created_at: str
    discount_type: str
    discount_value: str
    status: str
    template_no: str
    tenant_id: str
    title: str
    updated_at: str
    expires_at: Optional[str] = None
    organization_id: Optional[str] = None
    starts_at: Optional[str] = None
    total_quantity: Optional[str] = None
