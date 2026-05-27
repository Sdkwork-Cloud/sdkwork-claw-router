from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiUsageServiceProviderEdgeRecord:
    """Ai usage service provider edge record schema exposed by Claw Router."""
    amount_role: Optional[str] = None
    billable_quantity: Optional[str] = None
    billing_meter_code: Optional[str] = None
    buyer_provider_id: Optional[str] = None
    buyer_snapshot: Optional[Dict[str, str]] = None
    chain_id: Optional[str] = None
    charge_amount: Optional[str] = None
    converted_charge_amount: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    edge_depth: Optional[int] = None
    edge_id: Optional[str] = None
    fx_rate_snapshot: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    occurred_at: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    price_snapshot: Optional[Dict[str, str]] = None
    pricing_plan_id: Optional[str] = None
    pricing_rule_id: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    seller_provider_id: Optional[str] = None
    seller_snapshot: Optional[Dict[str, str]] = None
    settlement_currency: Optional[str] = None
    settlement_status: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    token_kind: Optional[str] = None
    trace_id: Optional[str] = None
    unit_price: Optional[str] = None
    unit_size: Optional[str] = None
    usage_fact_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
