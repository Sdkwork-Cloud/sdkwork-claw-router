from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_config import AdminAppConfig


@dataclass
class AdminAppItemResponse:
    """Offline PlusApp snapshot returned by the backend."""
    config: AdminAppConfig
    created_at: str
    icon: Dict[str, str]
    id: str
    install_config: Dict[str, str]
    install_platforms: Dict[str, str]
    install_skill: Dict[str, str]
    market_status: str
    name: str
    platforms: Dict[str, str]
    release_notes: List[Dict[str, str]]
    resource_list: Dict[str, str]
    status: str
    updated_at: str
    uuid: str
    access_url: Optional[str] = None
    app_key: Optional[str] = None
    app_type: Optional[str] = None
    bundle_id: Optional[str] = None
    description: Optional[str] = None
    download_url: Optional[str] = None
    icon_url: Optional[str] = None
    package_name: Optional[str] = None
    project_id: Optional[str] = None
    store_url: Optional[str] = None
    user_id: Optional[str] = None
    version: Optional[str] = None
