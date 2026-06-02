from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AdminSkillAssetItem:
    """Updated skill catalog asset snapshot returned by the backend."""
    asset: MediaResource
    asset_type: int
    created_at: str
    id: str
    skill_id: str
    sort_order: int
    status: int
    target_id: str
    target_type: int
    updated_at: str
    alt_text: Optional[str] = None
    artifact_id: Optional[str] = None
    duration_seconds: Optional[str] = None
    file_size: Optional[int] = None
    height: Optional[int] = None
    mime_type: Optional[str] = None
    published_at: Optional[str] = None
    thumbnail: Optional[MediaResource] = None
    title: Optional[str] = None
    width: Optional[int] = None
