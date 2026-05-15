from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusFavoriteRecord:
    """Plus favorite record schema exposed by Claw Router."""
    folder_id: Optional[str] = None
    image: Optional[Dict[str, str]] = None
    last_viewed_at: Optional[str] = None
    remark: Optional[str] = None
    tags: Optional[str] = None
    title: Optional[str] = None
    user_id: Optional[str] = None
