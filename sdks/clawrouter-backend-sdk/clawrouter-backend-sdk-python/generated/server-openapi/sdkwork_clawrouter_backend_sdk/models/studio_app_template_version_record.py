from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StudioAppTemplateVersionRecord:
    """Studio app template version record schema exposed by Claw Router."""
    app_config_schema: Optional[Dict[str, str]] = None
    artifact_id: Optional[str] = None
    capability_manifest: Optional[Dict[str, str]] = None
    changelog: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_app_config: Optional[Dict[str, str]] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    dependency_manifest: Optional[Dict[str, str]] = None
    deprecated_at: Optional[str] = None
    file_manifest: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    publish_status: Optional[str] = None
    published_at: Optional[str] = None
    status: Optional[str] = None
    template_id: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    variable_schema: Optional[Dict[str, str]] = None
    version: Optional[str] = None
    version_no: Optional[str] = None
