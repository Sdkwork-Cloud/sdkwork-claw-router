from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class StudioAppTemplateRecord:
    """Studio app template record schema exposed by Claw Router."""
    app_config_schema: Optional[Dict[str, str]] = None
    capability_manifest: Optional[Dict[str, str]] = None
    category_code: Optional[str] = None
    category_id: Optional[str] = None
    cover: Optional[MediaResource] = None
    created_at: Optional[str] = None
    current_version_id: Optional[str] = None
    data_scope: Optional[str] = None
    default_app_config: Optional[Dict[str, str]] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    dependency_manifest: Optional[Dict[str, str]] = None
    deprecated_at: Optional[str] = None
    description: Optional[str] = None
    featured: Optional[bool] = None
    framework: Optional[str] = None
    git_ref: Optional[str] = None
    git_repo_url: Optional[str] = None
    git_sub_path: Optional[str] = None
    icon: Optional[MediaResource] = None
    id: Optional[str] = None
    language: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_user_id: Optional[str] = None
    publish_status: Optional[str] = None
    published_at: Optional[str] = None
    runtime: Optional[str] = None
    sort_weight: Optional[int] = None
    source_app_id: Optional[str] = None
    status: Optional[str] = None
    template_code: Optional[str] = None
    template_name: Optional[str] = None
    template_no: Optional[str] = None
    template_type: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    variable_schema: Optional[Dict[str, str]] = None
    version: Optional[str] = None
    visibility: Optional[str] = None
