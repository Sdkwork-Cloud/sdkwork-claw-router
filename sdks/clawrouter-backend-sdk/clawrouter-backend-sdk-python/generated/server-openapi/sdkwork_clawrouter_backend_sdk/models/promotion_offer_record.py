from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionOfferRecord:
    """Promotion offer record schema exposed by Claw Router."""
    audience_scope: str
    combinability: str
    created_at: str
    name: str
    offer_code: str
    offer_no: str
    offer_type: str
    priority: int
    status: str
    tenant_id: str
    updated_at: str
    created_by: Optional[str] = None
    current_offer_version_id: Optional[str] = None
    description: Optional[str] = None
    ends_at: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    starts_at: Optional[str] = None
    updated_by: Optional[str] = None
