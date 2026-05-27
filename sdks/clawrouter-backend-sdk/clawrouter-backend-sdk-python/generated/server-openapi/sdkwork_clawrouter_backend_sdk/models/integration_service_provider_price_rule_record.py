from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationServiceProviderPriceRuleRecord:
    """Integration service provider price rule record schema exposed by Claw Router."""
    billing_meter_code: Optional[str] = None
    buyer_provider_id: Optional[str] = None
    catalog_key: Optional[str] = None
    channel_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    edge_id: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    minimum_charge: Optional[str] = None
    model: Optional[str] = None
    organization_id: Optional[str] = None
    price_plan_id: Optional[str] = None
    priority: Optional[int] = None
    provider_code: Optional[str] = None
    rounding_mode: Optional[str] = None
    seller_provider_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    token_kind: Optional[str] = None
    unit_price: Optional[str] = None
    unit_size: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
