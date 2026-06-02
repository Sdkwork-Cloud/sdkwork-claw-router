from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductSpuRecord:
    """Commerce product spu record schema exposed by Claw Router."""
    created_at: str
    product_type: str
    spu_no: str
    status: str
    tenant_id: str
    title: str
    updated_at: str
    brand: Optional[str] = None
    description: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    published_at: Optional[str] = None
    subtitle: Optional[str] = None
