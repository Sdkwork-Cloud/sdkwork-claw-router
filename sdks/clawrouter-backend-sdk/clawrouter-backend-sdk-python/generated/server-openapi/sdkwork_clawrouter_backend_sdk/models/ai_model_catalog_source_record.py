from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelCatalogSourceRecord:
    """Ai model catalog source record schema exposed by Claw Router."""
    organization_id: str
    parser_kind: str
    source_code: str
    source_kind: str
    source_name: str
    status: str
    tenant_id: str
    trust_level: str
    uuid: str
    catalog_version: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    error_message_masked: Optional[str] = None
    id: Optional[str] = None
    last_observed_at: Optional[str] = None
    last_success_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    normalized_payload_hash: Optional[str] = None
    provider_code: Optional[str] = None
    raw_payload_ref: Optional[str] = None
    refresh_interval_seconds: Optional[str] = None
    region_code: Optional[str] = None
    schema_version: Optional[str] = None
    source_hash: Optional[str] = None
    source_url: Optional[str] = None
    updated_at: Optional[str] = None
    vendor_code: Optional[str] = None
    version: Optional[str] = None
