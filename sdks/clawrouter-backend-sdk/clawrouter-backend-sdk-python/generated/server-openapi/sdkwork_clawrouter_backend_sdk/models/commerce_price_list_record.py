from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePriceListRecord:
    """Commerce price list record schema exposed by Claw Router."""
    created_at: str
    currency_code: str
    price_list_no: str
    status: str
    tenant_id: str
    updated_at: str
    customer_segment: Optional[str] = None
    ends_at: Optional[str] = None
    market_code: Optional[str] = None
    organization_id: Optional[str] = None
    starts_at: Optional[str] = None
