from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionOfferTimeWindowRecord:
    """Promotion offer time window record schema exposed by Claw Router."""
    created_at: str
    offer_version_id: str
    tenant_id: str
    updated_at: str
    window_type: str
    ends_at: Optional[str] = None
    local_end_time: Optional[str] = None
    local_start_time: Optional[str] = None
    organization_id: Optional[str] = None
    starts_at: Optional[str] = None
    timezone: Optional[str] = None
    weekday_mask: Optional[int] = None
