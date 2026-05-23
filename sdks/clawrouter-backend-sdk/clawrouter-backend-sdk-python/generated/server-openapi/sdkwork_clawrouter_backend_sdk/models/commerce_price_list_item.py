from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePriceListItem:
    """Commerce price list item schema exposed by Claw Router."""
    created_at: str
    currency_code: str
    id: str
    price_list_no: str
    status: str
    updated_at: str
    customer_segment: Optional[str] = None
    ends_at: Optional[str] = None
    market_code: Optional[str] = None
    starts_at: Optional[str] = None
