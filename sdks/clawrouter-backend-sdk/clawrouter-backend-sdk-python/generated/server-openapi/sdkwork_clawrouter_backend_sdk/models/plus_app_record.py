from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class PlusAppRecord:
    """Plus app record schema exposed by Claw Router."""
    access_url: Optional[str] = None
    app_type: Optional[str] = None
    artifact: Optional[MediaResource] = None
    bundle_id: Optional[str] = None
    config: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_scope: Optional[int] = None
    description: Optional[str] = None
    icon: Optional[MediaResource] = None
    id: Optional[str] = None
    install_config: Optional[Dict[str, str]] = None
    install_platforms: Optional[Dict[str, str]] = None
    install_skill: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    package_name: Optional[str] = None
    platforms: Optional[Dict[str, str]] = None
    project_id: Optional[str] = None
    release_notes: Optional[Dict[str, str]] = None
    resource_list: Optional[Dict[str, str]] = None
    status: Optional[int] = None
    store_url: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    v: Optional[str] = None
    version: Optional[str] = None
