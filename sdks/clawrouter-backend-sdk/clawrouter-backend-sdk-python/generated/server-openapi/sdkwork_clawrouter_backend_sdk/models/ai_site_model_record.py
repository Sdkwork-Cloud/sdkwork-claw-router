from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiSiteModelRecord:
    """Ai site model record schema exposed by Claw Router."""
    model_code: str
    model_name: str
    organization_id: str
    service_type: str
    site_code: str
    site_id: str
    site_service_id: str
    status: str
    tenant_id: str
    uuid: str
    capabilities: Optional[Dict[str, str]] = None
    capability: Optional[str] = None
    catalog_key: Optional[str] = None
    consecutive_error_count: Optional[str] = None
    context_tokens: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_parameters: Optional[Dict[str, str]] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    display_name: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_latency_ms: Optional[int] = None
    last_sync_at: Optional[str] = None
    max_input_tokens: Optional[str] = None
    max_output_tokens: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    modality: Optional[str] = None
    model_aliases: Optional[Dict[str, str]] = None
    model_id: Optional[str] = None
    pricing_snapshot: Optional[Dict[str, str]] = None
    provider_model: Optional[str] = None
    provider_native_model: Optional[str] = None
    site_service_code: Optional[str] = None
    supports_json_schema: Optional[bool] = None
    supports_streaming: Optional[bool] = None
    supports_tools: Optional[bool] = None
    updated_at: Optional[str] = None
    vendor_code: Optional[str] = None
    version: Optional[str] = None
