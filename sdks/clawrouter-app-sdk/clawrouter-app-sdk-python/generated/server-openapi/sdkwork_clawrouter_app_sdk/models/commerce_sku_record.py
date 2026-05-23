from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceSkuRecord:
    """Commerce sku record schema exposed by Claw Router."""
    created_at: str
    currency_code: str
    name: str
    price_amount: str
    product_id: str
    sku_no: str
    status: str
    tenant_id: str
    title: str
    updated_at: str
    organization_id: Optional[str] = None
    original_price_amount: Optional[str] = None
    spec_json: Optional[str] = None
    stock_quantity: Optional[str] = None
