from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductSkuRecord:
    """Commerce product sku record schema exposed by Claw Router."""
    created_at: str
    fulfillment_type: str
    sku_no: str
    spu_id: str
    status: str
    tenant_id: str
    title: str
    updated_at: str
    default_currency_code: Optional[str] = None
    default_price_amount: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    published_at: Optional[str] = None
    sales_unit: Optional[str] = None
    tax_category: Optional[str] = None
