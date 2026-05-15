from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusAppRecord:
    """Plus app record schema exposed by Claw Router."""
    access_url: Optional[str] = None
    app_type: Optional[str] = None
    bundle_id: Optional[str] = None
    description: Optional[str] = None
    download_url: Optional[str] = None
    icon: Optional[Dict[str, str]] = None
    icon_url: Optional[str] = None
    install_config: Optional[Dict[str, str]] = None
    install_platforms: Optional[Dict[str, str]] = None
    install_skill: Optional[Dict[str, str]] = None
    package_name: Optional[str] = None
    platforms: Optional[Dict[str, str]] = None
    project_id: Optional[str] = None
    release_notes: Optional[Dict[str, str]] = None
    resource_list: Optional[Dict[str, str]] = None
    store_url: Optional[str] = None
    user_id: Optional[str] = None
    version: Optional[str] = None
