from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ContentSdkReleaseRecord:
    """Content sdk release record schema exposed by Claw Router."""
    api_system: Optional[str] = None
    artifact_manifest: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_base_url: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    docs_url: Optional[str] = None
    example_code: Optional[str] = None
    example_manifest: Optional[Dict[str, str]] = None
    github_url: Optional[str] = None
    id: Optional[str] = None
    import_code: Optional[str] = None
    init_code: Optional[str] = None
    install_command: Optional[str] = None
    language: Optional[str] = None
    language_description: Optional[str] = None
    language_icon: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    openapi_snapshot_id: Optional[str] = None
    organization_id: Optional[str] = None
    package_manager: Optional[str] = None
    package_name: Optional[str] = None
    published_at: Optional[str] = None
    source_repo: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
