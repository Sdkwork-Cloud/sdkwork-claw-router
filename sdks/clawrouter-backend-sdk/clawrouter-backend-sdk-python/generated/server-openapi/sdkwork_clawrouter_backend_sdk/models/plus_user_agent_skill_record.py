from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusUserAgentSkillRecord:
    """Plus user agent skill record schema exposed by Claw Router."""
    config: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_scope: Optional[int] = None
    enabled: Optional[bool] = None
    id: Optional[str] = None
    installed_at: Optional[str] = None
    last_enabled_at: Optional[str] = None
    last_used_at: Optional[str] = None
    organization_id: Optional[str] = None
    skill_id: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    used_count: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    v: Optional[str] = None
