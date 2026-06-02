from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class MessagingProviderRecord:
    """Messaging provider record schema exposed by Claw Router."""
    display_name: str
    organization_id: str
    provider_code: str
    status: str
    tenant_id: str
    uuid: str
    channel: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    docs_url: Optional[str] = None
    icon: Optional[MediaResource] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    metadata_schema_version: Optional[str] = None
    provider_type: Optional[str] = None
    sort_order: Optional[int] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
    website_url: Optional[str] = None
