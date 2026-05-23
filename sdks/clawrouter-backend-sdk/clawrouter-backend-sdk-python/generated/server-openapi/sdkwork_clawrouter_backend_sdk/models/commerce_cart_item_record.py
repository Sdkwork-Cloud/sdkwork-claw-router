from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCartItemRecord:
    """Commerce cart item record schema exposed by Claw Router."""
    cart_id: str
    created_at: str
    sku_id: str
    tenant_id: str
    updated_at: str
    metadata_json: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    price_snapshot_json: Optional[Dict[str, str]] = None
