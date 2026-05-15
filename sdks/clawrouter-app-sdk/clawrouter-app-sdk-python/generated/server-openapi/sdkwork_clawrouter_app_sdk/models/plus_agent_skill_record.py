from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusAgentSkillRecord:
    """Plus agent skill record schema exposed by Claw Router."""
    category_id: Optional[str] = None
    cover_image: Optional[str] = None
    description: Optional[str] = None
    documentation_url: Optional[str] = None
    entrypoint: Optional[str] = None
    homepage_url: Optional[str] = None
    icon: Optional[str] = None
    latest_published_at: Optional[str] = None
    license_name: Optional[str] = None
    manifest_url: Optional[str] = None
    package_id: Optional[str] = None
    price: Optional[str] = None
    provider: Optional[str] = None
    repository_url: Optional[str] = None
    review_comment: Optional[str] = None
    reviewed_at: Optional[str] = None
    reviewed_by: Optional[str] = None
    runtime: Optional[str] = None
    summary: Optional[str] = None
    user_id: Optional[str] = None
    version: Optional[str] = None
    version_name: Optional[str] = None
