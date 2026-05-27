from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductSkuAttributeRecord:
    """Commerce product sku attribute record schema exposed by Claw Router."""
    attribute_id: str
    created_at: str
    sku_id: str
    tenant_id: str
    updated_at: str
    attribute_value_id: Optional[str] = None
    custom_value: Optional[str] = None
    organization_id: Optional[str] = None
