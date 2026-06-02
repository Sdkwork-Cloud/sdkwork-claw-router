from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_config import AdminAppConfig
    from .media_resource import MediaResource


@dataclass
class AdminAppUpdateRequest:
    """Admin app update request schema exposed by Claw Router."""
    access_url: Optional[str] = None
    app_type: Optional[str] = None
    artifact: Optional[MediaResource] = None
    bundle_id: Optional[str] = None
    config: Optional[AdminAppConfig] = None
    description: Optional[str] = None
    icon: Optional[MediaResource] = None
    install_config: Optional[Dict[str, str]] = None
    install_platforms: Optional[Dict[str, str]] = None
    install_skill: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    package_name: Optional[str] = None
    platforms: Optional[Dict[str, str]] = None
    project_id: Optional[str] = None
    release_notes: Optional[List[Dict[str, str]]] = None
    resource_list: Optional[Dict[str, str]] = None
    store_url: Optional[str] = None
    user_id: Optional[str] = None
    version: Optional[str] = None
