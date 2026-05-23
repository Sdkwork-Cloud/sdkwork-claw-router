from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationProviderRecord:
    """Integration provider record schema exposed by Claw Router."""
    auth_type: Optional[str] = None
    base_url: Optional[str] = None
    capabilities: Optional[Dict[str, str]] = None
    color_token: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_vendor_code: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    display_name: Optional[str] = None
    docs_url: Optional[str] = None
    icon_url: Optional[str] = None
    id: Optional[str] = None
    integration_type: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    metadata_schema_version: Optional[str] = None
    organization_id: Optional[str] = None
    protocol: Optional[str] = None
    provider_code: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    upstream_provider_code: Optional[str] = None
    upstream_vendor_code: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    website_url: Optional[str] = None
