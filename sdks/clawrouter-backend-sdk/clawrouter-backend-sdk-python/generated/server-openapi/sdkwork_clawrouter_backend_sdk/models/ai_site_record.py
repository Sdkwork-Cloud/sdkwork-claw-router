from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AiSiteRecord:
    """Ai site record schema exposed by Claw Router."""
    display_name: str
    organization_id: str
    site_code: str
    site_name: str
    status: str
    tenant_id: str
    uuid: str
    base_url: Optional[str] = None
    color_token: Optional[str] = None
    consecutive_error_count: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    docs_url: Optional[str] = None
    environment: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_checked_at: Optional[str] = None
    last_latency_ms: Optional[int] = None
    last_sync_at: Optional[str] = None
    logo: Optional[MediaResource] = None
    metadata: Optional[Dict[str, str]] = None
    owner_kind: Optional[str] = None
    region_code: Optional[str] = None
    site_type: Optional[str] = None
    sort_order: Optional[int] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
    website_url: Optional[str] = None
