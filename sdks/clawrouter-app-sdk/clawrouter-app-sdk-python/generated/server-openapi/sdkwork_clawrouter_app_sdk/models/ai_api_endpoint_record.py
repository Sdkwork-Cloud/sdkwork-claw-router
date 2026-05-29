from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiApiEndpointRecord:
    """Ai api endpoint record schema exposed by Claw Router."""
    endpoint_code: str
    organization_id: str
    path_template: str
    protocol_code: str
    status: str
    tenant_id: str
    uuid: str
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    display_name: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    method: Optional[str] = None
    request_schema: Optional[Dict[str, str]] = None
    response_schema: Optional[Dict[str, str]] = None
    sort_order: Optional[int] = None
    streaming_supported: Optional[bool] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
