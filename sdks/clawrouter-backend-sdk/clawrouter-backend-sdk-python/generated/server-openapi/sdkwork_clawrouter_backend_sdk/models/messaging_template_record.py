from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingTemplateRecord:
    """Messaging template record schema exposed by Claw Router."""
    category: Optional[str] = None
    channel: Optional[str] = None
    created_at: Optional[str] = None
    current_version_id: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    delivery_purpose: Optional[str] = None
    description: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_app_id: Optional[str] = None
    publish_status: Optional[str] = None
    scene_code: Optional[str] = None
    status: Optional[str] = None
    template_code: Optional[str] = None
    template_name: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
