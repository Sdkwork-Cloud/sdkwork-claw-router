from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .generation_history_media_item import GenerationHistoryMediaItem


@dataclass
class GenerationHistoryItem:
    """Generation history item schema exposed by Claw Router."""
    date: str
    id: str
    images: List[str]
    prompt: str
    type: str
    videos: List[GenerationHistoryMediaItem]
    aspect_ratio: Optional[str] = None
    created_at: Optional[str] = None
    duration_seconds: Optional[int] = None
    model_catalog_key: Optional[str] = None
    model_info: Optional[str] = None
    output_text: Optional[str] = None
    status: Optional[str] = None
    updated_at: Optional[str] = None
    url: Optional[str] = None
