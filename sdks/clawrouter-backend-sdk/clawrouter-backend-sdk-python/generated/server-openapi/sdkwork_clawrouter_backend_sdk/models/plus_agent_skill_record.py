from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class PlusAgentSkillRecord:
    """Plus agent skill record schema exposed by Claw Router."""
    builtin: Optional[bool] = None
    capabilities: Optional[Dict[str, str]] = None
    category_id: Optional[str] = None
    config_schema: Optional[Dict[str, str]] = None
    cover: Optional[MediaResource] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    data_scope: Optional[int] = None
    default_config: Optional[Dict[str, str]] = None
    description: Optional[str] = None
    documentation_url: Optional[str] = None
    enabled: Optional[bool] = None
    entrypoint: Optional[str] = None
    featured: Optional[bool] = None
    homepage_url: Optional[str] = None
    icon: Optional[MediaResource] = None
    id: Optional[str] = None
    install_count: Optional[str] = None
    is_builtin: Optional[bool] = None
    latest_published_at: Optional[str] = None
    license_name: Optional[str] = None
    manifest_url: Optional[str] = None
    market_status: Optional[str] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    package_id: Optional[str] = None
    price: Optional[str] = None
    provider: Optional[str] = None
    rating_avg: Optional[str] = None
    rating_count: Optional[str] = None
    recommend_weight: Optional[int] = None
    repository_url: Optional[str] = None
    review_comment: Optional[str] = None
    review_status: Optional[str] = None
    reviewed_at: Optional[str] = None
    reviewed_by: Optional[str] = None
    runtime: Optional[str] = None
    skill_key: Optional[str] = None
    source_type: Optional[str] = None
    summary: Optional[str] = None
    tags: Optional[Dict[str, str]] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    v: Optional[str] = None
    version: Optional[str] = None
    version_name: Optional[str] = None
    visibility: Optional[str] = None
