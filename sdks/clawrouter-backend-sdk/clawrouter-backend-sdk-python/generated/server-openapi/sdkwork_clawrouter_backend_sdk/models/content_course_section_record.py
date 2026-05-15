from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ContentCourseSectionRecord:
    """Content course section record schema exposed by Claw Router."""
    course_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    duration_seconds: Optional[str] = None
    id: Optional[str] = None
    lesson_count: Optional[int] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    section_no: Optional[int] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
