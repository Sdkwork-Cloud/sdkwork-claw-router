from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelCatalogSyncRunRecord:
    """Ai model catalog sync run record schema exposed by Claw Router."""
    organization_id: str
    run_status: str
    source_code: str
    started_at: str
    status: str
    tenant_id: str
    uuid: str
    accepted_count: Optional[str] = None
    catalog_version: Optional[str] = None
    change_summary: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    error_message_masked: Optional[str] = None
    finished_at: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    observed_at: Optional[str] = None
    observed_meter_count: Optional[str] = None
    observed_model_count: Optional[str] = None
    observed_price_count: Optional[str] = None
    observed_vendor_count: Optional[str] = None
    payload_hash: Optional[str] = None
    provider_code: Optional[str] = None
    region_code: Optional[str] = None
    rejected_count: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    skipped_count: Optional[str] = None
    source_hash: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    vendor_code: Optional[str] = None
