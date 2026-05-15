from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiGenerationSessionRecord:
    """Ai generation session record schema exposed by Claw Router."""
    active_modality: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    filter_config: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    last_opened_at: Optional[str] = None
    last_prompt: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    selected_models: Optional[Dict[str, str]] = None
    session_code: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
