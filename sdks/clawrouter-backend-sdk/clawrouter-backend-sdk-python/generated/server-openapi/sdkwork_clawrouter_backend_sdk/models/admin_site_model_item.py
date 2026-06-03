from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminSiteModelItem:
    """Admin site model item schema exposed by Claw Router."""
    health_status: str
    id: str
    model_code: str
    model_name: str
    service_type: str
    site_code: str
    site_id: str
    site_service_id: str
    status: str
    capabilities: Optional[List[str]] = None
    consecutive_error_count: Optional[int] = None
    context_tokens: Optional[int] = None
    display_name: Optional[str] = None
    last_latency_ms: Optional[int] = None
    last_sync_at: Optional[str] = None
    max_input_tokens: Optional[int] = None
    max_output_tokens: Optional[int] = None
    modality: Optional[str] = None
    provider_model: Optional[str] = None
    provider_native_model: Optional[str] = None
    site_service_code: Optional[str] = None
    supports_json_schema: Optional[bool] = None
    supports_streaming: Optional[bool] = None
    supports_tools: Optional[bool] = None
    vendor_code: Optional[str] = None
