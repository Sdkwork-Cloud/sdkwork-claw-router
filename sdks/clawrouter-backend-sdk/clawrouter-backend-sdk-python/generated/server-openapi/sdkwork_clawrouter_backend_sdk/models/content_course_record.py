from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ContentCourseRecord:
    """Content course record schema exposed by Claw Router."""
    category: Optional[str] = None
    content: Optional[str] = None
    course_code: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    duration_text: Optional[str] = None
    external_bvid: Optional[str] = None
    id: Optional[str] = None
    instructor_snapshot: Optional[Dict[str, str]] = None
    is_collection: Optional[bool] = None
    lessons_count: Optional[int] = None
    level: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    price_amount: Optional[str] = None
    published_at: Optional[str] = None
    rating_score: Optional[str] = None
    status: Optional[str] = None
    students_count: Optional[str] = None
    tags: Optional[Dict[str, str]] = None
    tenant_id: Optional[str] = None
    thumbnail_url: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
