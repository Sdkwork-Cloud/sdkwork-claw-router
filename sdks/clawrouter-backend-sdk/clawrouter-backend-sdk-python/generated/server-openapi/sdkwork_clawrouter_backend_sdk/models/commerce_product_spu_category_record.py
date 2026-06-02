from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductSpuCategoryRecord:
    """Commerce product spu category record schema exposed by Claw Router."""
    category_id: str
    created_at: str
    primary_flag: bool
    sort_order: str
    spu_id: str
    status: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
