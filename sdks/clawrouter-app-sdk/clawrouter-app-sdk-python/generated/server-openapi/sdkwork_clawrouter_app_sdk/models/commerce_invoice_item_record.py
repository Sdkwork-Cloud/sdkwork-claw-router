from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInvoiceItemRecord:
    """Commerce invoice item record schema exposed by Claw Router."""
    amount: str
    created_at: str
    invoice_id: str
    tax_amount: str
    tenant_id: str
    title: str
    id: Optional[str] = None
    order_item_id: Optional[str] = None
