from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionDiscountAllocationRecord:
    """Promotion discount allocation record schema exposed by Claw Router."""
    allocation_amount_minor: str
    application_id: str
    created_at: str
    currency_code: str
    order_id: str
    tenant_id: str
    allocation_ratio_bps: Optional[int] = None
    id: Optional[str] = None
    order_item_id: Optional[str] = None
    organization_id: Optional[str] = None
    sku_id: Optional[str] = None
