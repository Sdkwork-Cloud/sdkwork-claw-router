from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUsageServiceProviderStatementItemRecord:
    """Commerce usage service provider statement item record schema exposed by Claw Router."""
    amount: Optional[str] = None
    billing_meter_code: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    organization_id: Optional[str] = None
    quantity: Optional[str] = None
    rebuild_version: Optional[str] = None
    request_count: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_usage_fact_ids: Optional[Dict[str, str]] = None
    source_version: Optional[str] = None
    statement_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    token_count: Optional[str] = None
    token_kind: Optional[str] = None
    updated_at: Optional[str] = None
    usage_edge_id: Optional[str] = None
    uuid: Optional[str] = None
