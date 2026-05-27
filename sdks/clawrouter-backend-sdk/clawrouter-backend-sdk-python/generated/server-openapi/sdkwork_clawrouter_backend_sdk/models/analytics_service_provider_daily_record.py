from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AnalyticsServiceProviderDailyRecord:
    """Analytics service provider daily record schema exposed by Claw Router."""
    ancestor_provider_id: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    expense_amount: Optional[str] = None
    failure_count: Optional[str] = None
    id: Optional[str] = None
    income_amount: Optional[str] = None
    margin_amount: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    provider_id: Optional[str] = None
    rebuild_version: Optional[str] = None
    report_date: Optional[str] = None
    request_count: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    status: Optional[str] = None
    success_count: Optional[str] = None
    tenant_id: Optional[str] = None
    token_count: Optional[str] = None
    updated_at: Optional[str] = None
    upstream_cost_amount: Optional[str] = None
    uuid: Optional[str] = None
