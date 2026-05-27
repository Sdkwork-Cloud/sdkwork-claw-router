from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAppTemplateItemResponse:
    """Persisted app template snapshot returned by the backend."""
    app_config_schema: Dict[str, str]
    capability_manifest: List[Dict[str, str]]
    created_at: str
    default_app_config: Dict[str, str]
    dependency_manifest: List[Dict[str, str]]
    featured: bool
    id: str
    publish_status: str
    sort_weight: int
    template_code: str
    template_name: str
    template_no: str
    updated_at: str
    uuid: str
    variable_schema: Dict[str, str]
    visibility: str
    category_code: Optional[str] = None
    category_id: Optional[str] = None
    cover_url: Optional[str] = None
    current_version_id: Optional[str] = None
    description: Optional[str] = None
    framework: Optional[str] = None
    git_ref: Optional[str] = None
    git_repo_url: Optional[str] = None
    git_sub_path: Optional[str] = None
    icon_url: Optional[str] = None
    language: Optional[str] = None
    runtime: Optional[str] = None
    source_app_id: Optional[str] = None
    template_type: Optional[str] = None
