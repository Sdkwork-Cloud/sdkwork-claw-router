from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AdminSkillAssetUpdateRequest:
    """Admin skill asset update request schema exposed by Claw Router."""
    alt_text: Optional[str] = None
    artifact_id: Optional[str] = None
    asset: Optional[MediaResource] = None
    asset_type: Optional[int] = None
    duration_seconds: Optional[str] = None
    file_size: Optional[str] = None
    height: Optional[int] = None
    mime_type: Optional[str] = None
    published_at: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[int] = None
    thumbnail: Optional[MediaResource] = None
    title: Optional[str] = None
    width: Optional[int] = None
