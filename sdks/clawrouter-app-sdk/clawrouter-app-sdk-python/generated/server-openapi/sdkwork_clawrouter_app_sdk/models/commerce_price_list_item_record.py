from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePriceListItemRecord:
    """Commerce price list item record schema exposed by Claw Router."""
    created_at: str
    min_quantity: str
    price_amount: str
    price_list_id: str
    sku_id: str
    tenant_id: str
    updated_at: str
    compare_at_amount: Optional[str] = None
    id: Optional[str] = None
    max_quantity: Optional[str] = None
    organization_id: Optional[str] = None
