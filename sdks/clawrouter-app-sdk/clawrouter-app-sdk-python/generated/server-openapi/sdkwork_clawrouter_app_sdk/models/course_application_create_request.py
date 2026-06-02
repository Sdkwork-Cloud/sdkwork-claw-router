from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class CourseApplicationCreateRequest:
    """Course application create request schema exposed by Claw Router."""
    category: str
    description: str
    source_provider: str
    title: str
    contact_email: Optional[str] = None
    contact_name: Optional[str] = None
    external_bvid: Optional[str] = None
    notes: Optional[str] = None
    video: Optional[MediaResource] = None
