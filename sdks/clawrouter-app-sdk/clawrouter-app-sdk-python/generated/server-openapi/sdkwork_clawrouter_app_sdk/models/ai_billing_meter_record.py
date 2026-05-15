from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiBillingMeterRecord:
    """Ai billing meter record schema exposed by Claw Router."""
    billing_mode: str
    default_unit: str
    default_unit_size: str
    display_name: str
    meter_code: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    aggregation_mode: Optional[str] = None
    allow_negative_quantity: Optional[bool] = None
    canonical_price_item_type: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    modality: Optional[str] = None
    quantity_precision: Optional[int] = None
    quantity_source: Optional[str] = None
    result_selector: Optional[str] = None
    sort_order: Optional[int] = None
    supports_expression: Optional[bool] = None
    supports_tier: Optional[bool] = None
    updated_at: Optional[str] = None
    usage_type: Optional[str] = None
    version: Optional[str] = None
