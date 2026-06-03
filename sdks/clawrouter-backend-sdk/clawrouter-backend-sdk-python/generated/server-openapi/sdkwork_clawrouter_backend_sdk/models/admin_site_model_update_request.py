from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminSiteModelUpdateRequest:
    """Admin site model update request schema exposed by Claw Router."""
    capabilities: Optional[List[str]] = None
    context_tokens: Optional[int] = None
    display_name: Optional[str] = None
    max_input_tokens: Optional[int] = None
    max_output_tokens: Optional[int] = None
    modality: Optional[str] = None
    model_code: Optional[str] = None
    model_name: Optional[str] = None
    provider_model: Optional[str] = None
    provider_native_model: Optional[str] = None
    status: Optional[str] = None
    supports_json_schema: Optional[bool] = None
    supports_streaming: Optional[bool] = None
    supports_tools: Optional[bool] = None
    vendor_code: Optional[str] = None
