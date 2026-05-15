from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamUserPreferenceRecord:
    """Iam user preference record schema exposed by Claw Router."""
    appearance_config: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_console_path: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    language: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    notification_preferences: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    theme_mode: Optional[str] = None
    timezone: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
