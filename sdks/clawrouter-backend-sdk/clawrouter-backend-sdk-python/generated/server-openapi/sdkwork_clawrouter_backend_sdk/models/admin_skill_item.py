from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AdminSkillItem:
    """Offline agent skill snapshot returned by the backend."""
    builtin: bool
    capabilities: List[str]
    config_schema: Dict[str, str]
    created_at: str
    currency: str
    default_config: Dict[str, str]
    enabled: bool
    featured: bool
    id: str
    install_count: str
    is_builtin: bool
    market_status: str
    name: str
    rating_avg: str
    rating_count: str
    recommend_weight: int
    review_status: str
    skill_key: str
    source_type: str
    tags: List[str]
    updated_at: str
    visibility: str
    category_id: Optional[str] = None
    cover: Optional[MediaResource] = None
    description: Optional[str] = None
    documentation_url: Optional[str] = None
    entrypoint: Optional[str] = None
    homepage_url: Optional[str] = None
    icon: Optional[MediaResource] = None
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
    version: Optional[str] = None
    version_name: Optional[str] = None
