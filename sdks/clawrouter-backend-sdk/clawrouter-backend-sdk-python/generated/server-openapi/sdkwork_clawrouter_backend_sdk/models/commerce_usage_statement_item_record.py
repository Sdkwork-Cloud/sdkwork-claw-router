from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUsageStatementItemRecord:
    """Commerce usage statement item record schema exposed by Claw Router."""
    asset_count: Optional[str] = None
    breakdown_payload: Optional[Dict[str, str]] = None
    cost_amount: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    duration_seconds: Optional[str] = None
    id: Optional[str] = None
    item_type: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    modality: Optional[str] = None
    model: Optional[str] = None
    model_list: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    provider_code: Optional[str] = None
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
    updated_at: Optional[str] = None
    usage_text: Optional[str] = None
    uuid: Optional[str] = None
