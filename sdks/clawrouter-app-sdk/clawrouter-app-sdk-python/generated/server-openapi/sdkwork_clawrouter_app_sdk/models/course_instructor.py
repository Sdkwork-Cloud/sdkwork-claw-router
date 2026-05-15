from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CourseInstructor:
    """Course instructor schema exposed by Claw Router."""
    avatar: str
    bio: str
    name: str
    title: str
