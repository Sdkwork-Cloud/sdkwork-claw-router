from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiPromptVersionRecord:
    """Ai prompt version record schema exposed by Claw Router."""
    checksum_hash: Optional[str] = None
    content: Optional[str] = None
    created_at: Optional[str] = None
    created_by: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    deprecated_at: Optional[str] = None
    examples_json: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    lifecycle_status: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model_constraints: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    output_schema: Optional[Dict[str, str]] = None
    prompt_id: Optional[str] = None
    published_at: Optional[str] = None
    review_comment: Optional[str] = None
    review_status: Optional[str] = None
    safety_policy: Optional[Dict[str, str]] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    variable_schema: Optional[Dict[str, str]] = None
    version: Optional[str] = None
    version_no: Optional[str] = None
