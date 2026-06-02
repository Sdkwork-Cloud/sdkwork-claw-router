from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class AdminSkillArtifactUpdateRequest:
    """Admin skill artifact update request schema exposed by Claw Router."""
    artifact: Optional[MediaResource] = None
    artifact_ref: Optional[str] = None
    artifact_size_bytes: Optional[int] = None
    artifact_type: Optional[int] = None
    checksum_hash: Optional[str] = None
    deprecated_at: Optional[str] = None
    frameworks: Optional[List[str]] = None
    license_name: Optional[str] = None
    os_name: Optional[str] = None
    platform_type: Optional[str] = None
    published_at: Optional[str] = None
    release_notes: Optional[str] = None
    runtime: Optional[str] = None
    status: Optional[int] = None
    version: Optional[str] = None
