from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AdminSkillArtifactItem:
    """Updated skill catalog artifact snapshot returned by the backend."""
    artifact_size_bytes: int
    artifact_type: int
    created_at: str
    frameworks: List[str]
    id: str
    os_name: str
    platform_type: str
    skill_id: str
    status: int
    target_id: str
    target_type: int
    updated_at: str
    version: str
    artifact: Optional[MediaResource] = None
    artifact_ref: Optional[str] = None
    checksum_hash: Optional[str] = None
    deprecated_at: Optional[str] = None
    license_name: Optional[str] = None
    published_at: Optional[str] = None
    release_notes: Optional[str] = None
    runtime: Optional[str] = None
