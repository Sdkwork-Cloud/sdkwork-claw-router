from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingTemplateVariantRecord:
    """Messaging template variant record schema exposed by Claw Router."""
    body_template: Optional[str] = None
    channel: Optional[str] = None
    content_format: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    length_limit: Optional[int] = None
    locale: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    provider_payload_schema: Optional[Dict[str, str]] = None
    render_options: Optional[Dict[str, str]] = None
    status: Optional[str] = None
    template_version_id: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
