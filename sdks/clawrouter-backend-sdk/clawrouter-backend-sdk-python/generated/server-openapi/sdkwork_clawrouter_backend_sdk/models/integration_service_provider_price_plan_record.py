from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationServiceProviderPricePlanRecord:
    """Integration service provider price plan record schema exposed by Claw Router."""
    base_amount_source: Optional[str] = None
    buyer_provider_id: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    data_scope: Optional[str] = None
    default_markup_amount: Optional[str] = None
    default_multiplier: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    edge_id: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    fallback_mode: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    plan_code: Optional[str] = None
    plan_name: Optional[str] = None
    pricing_mode: Optional[str] = None
    seller_provider_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
