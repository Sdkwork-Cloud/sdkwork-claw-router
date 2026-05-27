from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionOfferScopeRecord:
    """Promotion offer scope record schema exposed by Claw Router."""
    created_at: str
    match_mode: str
    offer_version_id: str
    scope_type: str
    tenant_id: str
    updated_at: str
    organization_id: Optional[str] = None
    target_code: Optional[str] = None
    target_id: Optional[str] = None
