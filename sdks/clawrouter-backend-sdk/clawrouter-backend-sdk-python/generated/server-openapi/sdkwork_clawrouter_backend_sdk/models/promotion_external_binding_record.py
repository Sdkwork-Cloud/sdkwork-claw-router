from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionExternalBindingRecord:
    """Promotion external binding record schema exposed by Claw Router."""
    binding_no: str
    created_at: str
    external_currency_code: str
    external_object_id: str
    external_object_type: str
    platform: str
    sync_status: str
    tenant_id: str
    updated_at: str
    claim_code_hash: Optional[str] = None
    claim_code_suffix: Optional[str] = None
    code_id: Optional[str] = None
    created_by: Optional[str] = None
    external_merchant_id: Optional[str] = None
    id: Optional[str] = None
    last_error_code: Optional[str] = None
    last_error_message: Optional[str] = None
    last_sync_at: Optional[str] = None
    metadata_json: Optional[Dict[str, str]] = None
    offer_id: Optional[str] = None
    offer_version_id: Optional[str] = None
    organization_id: Optional[str] = None
    platform_card_id: Optional[str] = None
    platform_coupon_id: Optional[str] = None
    platform_stock_id: Optional[str] = None
    platform_template_id: Optional[str] = None
    stock_id: Optional[str] = None
    updated_by: Optional[str] = None
    user_coupon_id: Optional[str] = None
