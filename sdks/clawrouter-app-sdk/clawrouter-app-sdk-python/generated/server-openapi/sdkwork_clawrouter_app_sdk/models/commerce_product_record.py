from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductRecord:
    """Commerce product record schema exposed by Claw Router."""
    created_at: str
    product_no: str
    status: str
    tenant_id: str
    title: str
    updated_at: str
    category_id: Optional[str] = None
    description: Optional[str] = None
    organization_id: Optional[str] = None
    subtitle: Optional[str] = None
