from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRefundItemRecord:
    """Commerce refund item record schema exposed by Claw Router."""
    created_at: str
    order_item_id: str
    quantity: str
    refund_amount: str
    refund_id: str
    shipping_refund_amount: str
    tax_refund_amount: str
    tenant_id: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
