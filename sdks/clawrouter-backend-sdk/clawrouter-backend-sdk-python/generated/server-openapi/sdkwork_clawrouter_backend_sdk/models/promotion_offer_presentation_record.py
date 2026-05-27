from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionOfferPresentationRecord:
    """Promotion offer presentation record schema exposed by Claw Router."""
    created_at: str
    customer_action_json: Dict[str, str]
    display_name: str
    field_schema_json: Dict[str, str]
    locale: str
    merchant_display_name: str
    offer_version_id: str
    param_schema_json: Dict[str, str]
    presentation_no: str
    recognition_type: str
    status: str
    style_snapshot_json: Dict[str, str]
    surface_type: str
    tenant_id: str
    terms_json: Dict[str, str]
    updated_at: str
    verify_method: str
    brand_name: Optional[str] = None
    cover_asset_id: Optional[str] = None
    created_by: Optional[str] = None
    logo_asset_id: Optional[str] = None
    offer_id: Optional[str] = None
    organization_id: Optional[str] = None
    primary_color: Optional[str] = None
    recognition_hash: Optional[str] = None
    secondary_color: Optional[str] = None
    updated_by: Optional[str] = None
