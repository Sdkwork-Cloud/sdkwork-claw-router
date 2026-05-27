from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StudioAppTemplateUsageRecord:
    """Studio app template usage record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    input_snapshot: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    output_snapshot: Optional[Dict[str, str]] = None
    request_id: Optional[str] = None
    status: Optional[str] = None
    target_app_id: Optional[str] = None
    template_id: Optional[str] = None
    template_version_id: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    usage_type: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
