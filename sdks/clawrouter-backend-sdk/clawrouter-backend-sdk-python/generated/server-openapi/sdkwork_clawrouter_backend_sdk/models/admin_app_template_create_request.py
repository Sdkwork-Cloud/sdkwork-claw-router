from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAppTemplateCreateRequest:
    """Admin app template create request schema exposed by Claw Router."""
    template_code: str
    template_name: str
    app_config_schema: Optional[Dict[str, str]] = None
    capability_manifest: Optional[List[Dict[str, str]]] = None
    category_code: Optional[str] = None
    category_id: Optional[str] = None
    cover_url: Optional[str] = None
    default_app_config: Optional[Dict[str, str]] = None
    dependency_manifest: Optional[List[Dict[str, str]]] = None
    description: Optional[str] = None
    featured: Optional[bool] = None
    framework: Optional[str] = None
    git_ref: Optional[str] = None
    git_repo_url: Optional[str] = None
    git_sub_path: Optional[str] = None
    icon_url: Optional[str] = None
    language: Optional[str] = None
    publish_status: Optional[str] = None
    runtime: Optional[str] = None
    sort_weight: Optional[int] = None
    source_app_id: Optional[str] = None
    template_no: Optional[str] = None
    template_type: Optional[str] = None
    variable_schema: Optional[Dict[str, str]] = None
    visibility: Optional[str] = None
