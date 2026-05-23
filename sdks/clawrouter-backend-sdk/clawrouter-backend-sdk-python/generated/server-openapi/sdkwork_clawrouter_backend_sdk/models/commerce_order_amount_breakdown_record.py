from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceOrderAmountBreakdownRecord:
    """Commerce order amount breakdown record schema exposed by Claw Router."""
    created_at: str
    currency_code: str
    discount_amount: str
    order_id: str
    original_amount: str
    payable_amount: str
    tenant_id: str
