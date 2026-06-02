from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionOfferAudienceRuleRecord:
    """Promotion offer audience rule record schema exposed by Claw Router."""
    created_at: str
    offer_version_id: str
    priority: int
    rule_operator: str
    rule_type: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
    rule_value: Optional[str] = None
    rule_value_json: Optional[Dict[str, str]] = None
