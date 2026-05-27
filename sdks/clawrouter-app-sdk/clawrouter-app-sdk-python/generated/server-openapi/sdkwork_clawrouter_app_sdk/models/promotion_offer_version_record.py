from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionOfferVersionRecord:
    """Promotion offer version record schema exposed by Claw Router."""
    benefit_kind: str
    breakage_policy: str
    created_at: str
    currency_code: str
    discount_type: str
    face_value_minor: str
    liability_policy: str
    lifecycle_status: str
    offer_id: str
    return_policy: str
    rule_snapshot_json: Dict[str, str]
    settlement_policy: str
    stack_strategy: str
    tax_treatment: str
    tenant_id: str
    updated_at: str
    validity_type: str
    version_no: str
    benefit_definition_id: Optional[str] = None
    benefit_quantity: Optional[str] = None
    created_by: Optional[str] = None
    discount_amount_minor: Optional[str] = None
    discount_percent_bps: Optional[int] = None
    fixed_price_minor: Optional[str] = None
    maximum_discount_amount_minor: Optional[str] = None
    organization_id: Optional[str] = None
    published_at: Optional[str] = None
    updated_by: Optional[str] = None
    validity_duration_seconds: Optional[str] = None
