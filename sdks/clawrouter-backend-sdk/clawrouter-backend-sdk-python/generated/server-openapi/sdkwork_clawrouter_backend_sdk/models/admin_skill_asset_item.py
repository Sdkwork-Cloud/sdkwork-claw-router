from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminSkillAssetItem:
    """Updated skill catalog asset snapshot returned by the backend."""
    asset_type: int
    asset_url: str
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
    thumbnail_url: Optional[str] = None
    title: Optional[str] = None
    width: Optional[int] = None
