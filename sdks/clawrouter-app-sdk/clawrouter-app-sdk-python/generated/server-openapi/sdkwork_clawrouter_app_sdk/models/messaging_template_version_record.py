from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingTemplateVersionRecord:
    """Messaging template version record schema exposed by Claw Router."""
    content_hash: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    html_template: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    published_at: Optional[str] = None
    render_engine: Optional[str] = None
    retired_at: Optional[str] = None
    review_status: Optional[str] = None
    status: Optional[str] = None
    subject_template: Optional[str] = None
    template_id: Optional[str] = None
    tenant_id: Optional[str] = None
    text_template: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    variable_schema: Optional[Dict[str, str]] = None
    version: Optional[str] = None
    version_no: Optional[int] = None
