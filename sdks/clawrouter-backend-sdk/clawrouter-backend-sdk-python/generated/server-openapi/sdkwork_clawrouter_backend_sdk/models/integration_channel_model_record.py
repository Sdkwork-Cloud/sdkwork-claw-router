from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationChannelModelRecord:
    """Integration channel model record schema exposed by Claw Router."""
    capability: Optional[str] = None
    catalog_key: Optional[str] = None
    channel_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_parameters: Optional[Dict[str, str]] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    max_input_tokens: Optional[str] = None
    max_output_tokens: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    model_aliases: Optional[Dict[str, str]] = None
    model_id: Optional[str] = None
    organization_id: Optional[str] = None
    provider_model: Optional[str] = None
    status: Optional[str] = None
    supports_streaming: Optional[bool] = None
    supports_tools: Optional[bool] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    vendor_code: Optional[str] = None
    version: Optional[str] = None
