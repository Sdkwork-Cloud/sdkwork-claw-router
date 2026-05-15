from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiPricingImportSnapshotRecord:
    """Ai pricing import snapshot record schema exposed by Claw Router."""
    import_source: str
    observed_at: str
    organization_id: str
    request_id: str
    source_hash: str
    source_name: str
    status: str
    tenant_id: str
    uuid: str
    accepted_count: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    data_format: Optional[str] = None
    error_message_masked: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    normalized_payload_hash: Optional[str] = None
    payload_hash: Optional[str] = None
    published_at: Optional[str] = None
    raw_payload_ref: Optional[str] = None
    rejected_count: Optional[str] = None
    retention_until: Optional[str] = None
    row_count: Optional[str] = None
    schema_version: Optional[str] = None
    source_url: Optional[str] = None
    source_version: Optional[str] = None
    trace_id: Optional[str] = None
    upstream_commit: Optional[str] = None
    user_id: Optional[str] = None
