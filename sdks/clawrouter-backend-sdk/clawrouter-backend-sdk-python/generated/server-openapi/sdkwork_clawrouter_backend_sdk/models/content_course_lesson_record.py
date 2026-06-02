from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class ContentCourseLessonRecord:
    """Content course lesson record schema exposed by Claw Router."""
    content: Optional[str] = None
    course_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    duration_seconds: Optional[str] = None
    duration_text: Optional[str] = None
    external_bvid: Optional[str] = None
    free_preview: Optional[bool] = None
    id: Optional[str] = None
    lesson_no: Optional[int] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    section_id: Optional[str] = None
    sort_order: Optional[int] = None
    source_provider: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    video: Optional[MediaResource] = None
