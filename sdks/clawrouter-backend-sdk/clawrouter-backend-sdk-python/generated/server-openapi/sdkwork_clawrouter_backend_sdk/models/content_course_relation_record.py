from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ContentCourseRelationRecord:
    """Content course relation record schema exposed by Claw Router."""
    course_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    related_course_id: Optional[str] = None
    relation_type: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
