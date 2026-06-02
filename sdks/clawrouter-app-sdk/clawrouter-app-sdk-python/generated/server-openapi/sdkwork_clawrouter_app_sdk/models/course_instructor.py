from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class CourseInstructor:
    """Course instructor schema exposed by Claw Router."""
    avatar: MediaResource
    bio: str
    name: str
    title: str
