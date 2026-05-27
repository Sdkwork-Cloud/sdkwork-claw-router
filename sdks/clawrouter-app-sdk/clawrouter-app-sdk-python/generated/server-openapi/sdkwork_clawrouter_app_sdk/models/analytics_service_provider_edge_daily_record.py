from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AnalyticsServiceProviderEdgeDailyRecord:
    """Analytics service provider edge daily record schema exposed by Claw Router."""
    billing_meter_code: Optional[str] = None
    buyer_provider_id: Optional[str] = None
    catalog_key: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    edge_id: Optional[str] = None
    expense_amount: Optional[str] = None
    id: Optional[str] = None
    income_amount: Optional[str] = None
    margin_amount: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    organization_id: Optional[str] = None
    rebuild_version: Optional[str] = None
    report_date: Optional[str] = None
    request_count: Optional[str] = None
    seller_provider_id: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    token_count: Optional[str] = None
    token_kind: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
