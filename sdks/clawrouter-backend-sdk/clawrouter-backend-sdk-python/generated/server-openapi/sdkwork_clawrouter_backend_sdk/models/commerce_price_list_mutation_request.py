from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePriceListMutationRequest:
    """Commerce price list mutation request schema exposed by Claw Router."""
    currency_code: str
    price_list_no: str
    status: str
    customer_segment: Optional[str] = None
    ends_at: Optional[str] = None
    market_code: Optional[str] = None
    starts_at: Optional[str] = None
