from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AdminSkillCreateRequest:
    """Admin skill create request schema exposed by Claw Router."""
    name: str
    skill_key: str
    builtin: Optional[bool] = None
    capabilities: Optional[List[str]] = None
    category_id: Optional[str] = None
    config_schema: Optional[Dict[str, str]] = None
    cover: Optional[MediaResource] = None
    currency: Optional[str] = None
    default_config: Optional[Dict[str, str]] = None
    description: Optional[str] = None
    documentation_url: Optional[str] = None
    enabled: Optional[bool] = None
    entrypoint: Optional[str] = None
    featured: Optional[bool] = None
    homepage_url: Optional[str] = None
    icon: Optional[MediaResource] = None
    is_builtin: Optional[bool] = None
    license_name: Optional[str] = None
    manifest_url: Optional[str] = None
    market_status: Optional[str] = None
    package_id: Optional[str] = None
    price: Optional[str] = None
    provider: Optional[str] = None
    recommend_weight: Optional[int] = None
    repository_url: Optional[str] = None
    review_status: Optional[str] = None
    runtime: Optional[str] = None
    source_type: Optional[str] = None
    summary: Optional[str] = None
    tags: Optional[List[str]] = None
    version: Optional[str] = None
    version_name: Optional[str] = None
    visibility: Optional[str] = None
