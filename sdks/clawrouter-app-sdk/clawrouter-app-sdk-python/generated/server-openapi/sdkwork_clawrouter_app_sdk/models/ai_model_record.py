from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AiModelRecord:
    """Ai model record schema exposed by Claw Router."""
    catalog_key: str
    display_name: str
    model: str
    organization_id: str
    release_stage: str
    routing_state: str
    shelf_state: str
    status: str
    tenant_id: str
    uuid: str
    vendor_code: str
    api_format: Optional[str] = None
    capabilities: Optional[Dict[str, str]] = None
    capability: Optional[str] = None
    capability_intro: Optional[str] = None
    color_token: Optional[str] = None
    context_tokens: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_pricing_id: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    deprecated_at: Optional[str] = None
    description: Optional[str] = None
    docs_url: Optional[str] = None
    family_code: Optional[str] = None
    family_id: Optional[str] = None
    icon: Optional[MediaResource] = None
    id: Optional[str] = None
    input_modalities: Optional[Dict[str, str]] = None
    license_type: Optional[str] = None
    limitations: Optional[Dict[str, str]] = None
    max_duration_seconds: Optional[int] = None
    max_input_tokens: Optional[str] = None
    max_output_tokens: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    modalities: Optional[Dict[str, str]] = None
    model_aliases: Optional[Dict[str, str]] = None
    model_family: Optional[str] = None
    model_version: Optional[str] = None
    output_modalities: Optional[Dict[str, str]] = None
    performance_profile: Optional[Dict[str, str]] = None
    provider_hint: Optional[str] = None
    rank_score: Optional[str] = None
    replacement_model: Optional[str] = None
    retired_at: Optional[str] = None
    supported_languages: Optional[Dict[str, str]] = None
    supports_json_schema: Optional[bool] = None
    supports_streaming: Optional[bool] = None
    supports_tools: Optional[bool] = None
    training_data_cutoff: Optional[str] = None
    updated_at: Optional[str] = None
    use_cases: Optional[Dict[str, str]] = None
    vendor_id: Optional[str] = None
    vendor_name_snapshot: Optional[str] = None
    version: Optional[str] = None
