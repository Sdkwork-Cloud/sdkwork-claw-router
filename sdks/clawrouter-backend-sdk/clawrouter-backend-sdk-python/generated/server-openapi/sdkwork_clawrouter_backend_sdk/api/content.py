from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import AdminAnnouncementCreateRequest, AdminAnnouncementUpdateRequest, AdminCourseApplicationReviewRequest, AdminCourseCommentModerationRequest, AdminCourseLessonMutationRequest, AdminCourseMutationRequest, AdminCourseRelationsReplaceRequest, AdminCourseSectionMutationRequest, AnnouncementsCreateResult, AnnouncementsDeleteResult, AnnouncementsListResult, AnnouncementsUpdateResult, CourseApplicationsListResult, CourseApplicationsReviewResult, CourseCommentsListResult, CourseCommentsModerateResult, CourseEngagementListResult, CourseLessonsDeleteResult, CourseLessonsUpdateResult, CoursesCreateResult, CoursesDashboardRetrieveResult, CoursesDeleteResult, CourseSectionsDeleteResult, CourseSectionsUpdateResult, CoursesLessonsCreateResult, CoursesLessonsListResult, CoursesListResult, CoursesRelationsListResult, CoursesRelationsReplaceResult, CoursesSectionsCreateResult, CoursesSectionsListResult, CoursesUpdateResult

def _append_query_string(path: str, raw_query_string: str) -> str:
    query = raw_query_string.lstrip('?')
    if not query:
        return path
    separator = '&' if '?' in path else '?'
    return f"{path}{separator}{query}"

def serialize_path_parameter(value: Any, spec: Dict[str, Any]) -> str:
    if value is None:
        return ''

    style = str(spec.get('style') or 'simple')
    name = str(spec.get('name') or '')
    explode = bool(spec.get('explode'))
    if isinstance(value, (list, tuple)):
        return serialize_path_array(name, value, style, explode)
    if isinstance(value, dict):
        return serialize_path_object(name, value, style, explode)
    return path_prefix(name, style) + encode_path_value(serialize_path_primitive(value))


def serialize_path_array(name: str, values: Any, style: str, explode: bool) -> str:
    serialized = [encode_path_value(serialize_path_primitive(item)) for item in values if item is not None]
    if not serialized:
        return path_prefix(name, style)
    if style == 'matrix':
        return ''.join(f";{name}={item}" for item in serialized) if explode else f";{name}={','.join(serialized)}"
    return path_prefix(name, style) + ('.' if explode else ',').join(serialized)


def serialize_path_object(name: str, value: Dict[str, Any], style: str, explode: bool) -> str:
    entries = [(key, entry_value) for key, entry_value in value.items() if entry_value is not None]
    if not entries:
        return path_prefix(name, style)
    if style == 'matrix':
        if explode:
            return ''.join(f";{encode_path_value(str(key))}={encode_path_value(serialize_path_primitive(entry_value))}" for key, entry_value in entries)
        serialized = ','.join(item for key, entry_value in entries for item in (encode_path_value(str(key)), encode_path_value(serialize_path_primitive(entry_value))))
        return f";{name}={serialized}"
    if explode:
        separator = '.' if style == 'label' else ','
        serialized = separator.join(f"{encode_path_value(str(key))}={encode_path_value(serialize_path_primitive(entry_value))}" for key, entry_value in entries)
    else:
        serialized = ','.join(item for key, entry_value in entries for item in (encode_path_value(str(key)), encode_path_value(serialize_path_primitive(entry_value))))
    return path_prefix(name, style) + serialized


def path_prefix(name: str, style: str) -> str:
    if style == 'label':
        return '.'
    if style == 'matrix':
        return f";{name}"
    return ''


def encode_path_value(value: str) -> str:
    from urllib.parse import quote

    return quote(value, safe='')


def serialize_path_primitive(value: Any) -> str:
    if isinstance(value, dict):
        import json

        return json.dumps(value, separators=(',', ':'))
    return str(value)


def build_query_string(parameters: List[Dict[str, Any]]) -> str:
    pairs: List[str] = []
    for parameter in parameters:
        append_serialized_parameter(pairs, parameter)
    return '&'.join(pairs)


def append_serialized_parameter(pairs: List[str], parameter: Dict[str, Any]) -> None:
    value = parameter.get('value')
    if value is None:
        return

    name = str(parameter.get('name') or '')
    allow_reserved = bool(parameter.get('allow_reserved'))
    content_type = parameter.get('content_type')
    if content_type:
        import json

        pairs.append(f"{encode_query_component(name)}={encode_query_value(json.dumps(value, separators=(',', ':')), allow_reserved)}")
        return

    style = str(parameter.get('style') or 'form')
    explode = bool(parameter.get('explode'))
    if style == 'deepObject':
        append_deep_object_parameter(pairs, name, value, allow_reserved)
        return
    if isinstance(value, (list, tuple)):
        append_array_parameter(pairs, name, value, style, explode, allow_reserved)
        return
    if isinstance(value, dict):
        append_object_parameter(pairs, name, value, style, explode, allow_reserved)
        return

    pairs.append(f"{encode_query_component(name)}={encode_query_value(serialize_primitive(value), allow_reserved)}")


def append_array_parameter(
    pairs: List[str],
    name: str,
    value: Any,
    style: str,
    explode: bool,
    allow_reserved: bool,
) -> None:
    values = [serialize_primitive(item) for item in value if item is not None]
    if not values:
        return

    if style == 'form' and explode:
        for item in values:
            pairs.append(f"{encode_query_component(name)}={encode_query_value(item, allow_reserved)}")
        return

    pairs.append(f"{encode_query_component(name)}={encode_query_value(','.join(values), allow_reserved)}")


def append_object_parameter(
    pairs: List[str],
    name: str,
    value: Dict[str, Any],
    style: str,
    explode: bool,
    allow_reserved: bool,
) -> None:
    entries = [(key, entry_value) for key, entry_value in value.items() if entry_value is not None]
    if not entries:
        return

    if style == 'form' and explode:
        for key, entry_value in entries:
            pairs.append(f"{encode_query_component(str(key))}={encode_query_value(serialize_primitive(entry_value), allow_reserved)}")
        return

    serialized = ','.join(
        item
        for key, entry_value in entries
        for item in (str(key), serialize_primitive(entry_value))
    )
    pairs.append(f"{encode_query_component(name)}={encode_query_value(serialized, allow_reserved)}")


def append_deep_object_parameter(pairs: List[str], name: str, value: Any, allow_reserved: bool) -> None:
    if not isinstance(value, dict):
        pairs.append(f"{encode_query_component(name)}={encode_query_value(serialize_primitive(value), allow_reserved)}")
        return

    for key, entry_value in value.items():
        if entry_value is None:
            continue
        pairs.append(f"{encode_query_component(f'{name}[{key}]')}={encode_query_value(serialize_primitive(entry_value), allow_reserved)}")


def serialize_primitive(value: Any) -> str:
    if isinstance(value, dict):
        import json

        return json.dumps(value, separators=(',', ':'))
    return str(value)


def encode_query_component(value: str) -> str:
    from urllib.parse import quote

    return quote(value, safe='')


def encode_query_value(value: str, allow_reserved: bool) -> str:
    from urllib.parse import quote

    return quote(value, safe=':/?#[]@!$&\'()*+,;=' if allow_reserved else '')



class ContentApi:
    """content content API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.announcements = ContentAnnouncementsApi(client)
        self.course_applications = ContentCourseApplicationsApi(client)
        self.course_lessons = ContentCourseLessonsApi(client)
        self.course_sections = ContentCourseSectionsApi(client)
        self.courses = ContentCoursesApi(client)
        self.course_comments = ContentCourseCommentsApi(client)
        self.course_engagement = ContentCourseEngagementApi(client)


class ContentAnnouncementsApi:
    """content content.announcements API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> AnnouncementsListResult:
        """List announcements"""
        return self._client.get(f"/backend/v3/api/content/announcements")

    def create(self, body: AdminAnnouncementCreateRequest) -> AnnouncementsCreateResult:
        """Create announcement"""
        return self._client.post(f"/backend/v3/api/content/announcements", json=body)

    def delete(self, announcement_id: str) -> AnnouncementsDeleteResult:
        """Delete announcement"""
        return self._client.delete(f"/backend/v3/api/content/announcements/{serialize_path_parameter(announcement_id, {'name': 'announcementId', 'style': 'simple', 'explode': False})}")

    def update(self, announcement_id: str, body: AdminAnnouncementUpdateRequest) -> AnnouncementsUpdateResult:
        """Update announcement"""
        return self._client.patch(f"/backend/v3/api/content/announcements/{serialize_path_parameter(announcement_id, {'name': 'announcementId', 'style': 'simple', 'explode': False})}", json=body)

class ContentCourseApplicationsApi:
    """content content.course_applications API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None, status: Optional[str] = None) -> CourseApplicationsListResult:
        """Admin Course Applications List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/content/course-applications", query))

    def review(self, application_id: str, body: AdminCourseApplicationReviewRequest) -> CourseApplicationsReviewResult:
        """Admin Course Application Review"""
        return self._client.patch(f"/backend/v3/api/content/course-applications/{serialize_path_parameter(application_id, {'name': 'applicationId', 'style': 'simple', 'explode': False})}/review", json=body)

class ContentCourseLessonsApi:
    """content content.course_lessons API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def delete(self, lesson_id: str) -> CourseLessonsDeleteResult:
        """Admin Course Lesson Delete"""
        return self._client.delete(f"/backend/v3/api/content/course-lessons/{serialize_path_parameter(lesson_id, {'name': 'lessonId', 'style': 'simple', 'explode': False})}")

    def update(self, lesson_id: str, body: AdminCourseLessonMutationRequest) -> CourseLessonsUpdateResult:
        """Admin Course Lesson Update"""
        return self._client.patch(f"/backend/v3/api/content/course-lessons/{serialize_path_parameter(lesson_id, {'name': 'lessonId', 'style': 'simple', 'explode': False})}", json=body)

class ContentCourseSectionsApi:
    """content content.course_sections API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def delete(self, section_id: str) -> CourseSectionsDeleteResult:
        """Admin Course Section Delete"""
        return self._client.delete(f"/backend/v3/api/content/course-sections/{serialize_path_parameter(section_id, {'name': 'sectionId', 'style': 'simple', 'explode': False})}")

    def update(self, section_id: str, body: AdminCourseSectionMutationRequest) -> CourseSectionsUpdateResult:
        """Admin Course Section Update"""
        return self._client.patch(f"/backend/v3/api/content/course-sections/{serialize_path_parameter(section_id, {'name': 'sectionId', 'style': 'simple', 'explode': False})}", json=body)

class ContentCoursesApi:
    """content content.courses API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.dashboard = ContentCoursesDashboardApi(client)
        self.lessons = ContentCoursesLessonsApi(client)
        self.relations = ContentCoursesRelationsApi(client)
        self.sections = ContentCoursesSectionsApi(client)


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None, status: Optional[str] = None) -> CoursesListResult:
        """Admin Courses List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/content/courses", query))

    def create(self, body: AdminCourseMutationRequest) -> CoursesCreateResult:
        """Admin Course Create"""
        return self._client.post(f"/backend/v3/api/content/courses", json=body)

    def delete(self, course_id: str) -> CoursesDeleteResult:
        """Admin Course Delete"""
        return self._client.delete(f"/backend/v3/api/content/courses/{serialize_path_parameter(course_id, {'name': 'courseId', 'style': 'simple', 'explode': False})}")

    def update(self, course_id: str, body: AdminCourseMutationRequest) -> CoursesUpdateResult:
        """Admin Course Update"""
        return self._client.patch(f"/backend/v3/api/content/courses/{serialize_path_parameter(course_id, {'name': 'courseId', 'style': 'simple', 'explode': False})}", json=body)

class ContentCoursesDashboardApi:
    """content content.courses.dashboard API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> CoursesDashboardRetrieveResult:
        """Course Dashboard Retrieve"""
        return self._client.get(f"/backend/v3/api/content/courses/dashboard")

class ContentCoursesLessonsApi:
    """content content.courses.lessons API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, course_id: str, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None, status: Optional[str] = None) -> CoursesLessonsListResult:
        """Admin Course Lessons List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/content/courses/{serialize_path_parameter(course_id, {'name': 'courseId', 'style': 'simple', 'explode': False})}/lessons", query))

    def create(self, course_id: str, body: AdminCourseLessonMutationRequest) -> CoursesLessonsCreateResult:
        """Admin Course Lesson Create"""
        return self._client.post(f"/backend/v3/api/content/courses/{serialize_path_parameter(course_id, {'name': 'courseId', 'style': 'simple', 'explode': False})}/lessons", json=body)

class ContentCoursesRelationsApi:
    """content content.courses.relations API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, course_id: str, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None, status: Optional[str] = None) -> CoursesRelationsListResult:
        """Admin Course Relations List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/content/courses/{serialize_path_parameter(course_id, {'name': 'courseId', 'style': 'simple', 'explode': False})}/relations", query))

    def replace(self, course_id: str, body: AdminCourseRelationsReplaceRequest) -> CoursesRelationsReplaceResult:
        """Admin Course Relations Replace"""
        return self._client.put(f"/backend/v3/api/content/courses/{serialize_path_parameter(course_id, {'name': 'courseId', 'style': 'simple', 'explode': False})}/relations", json=body)

class ContentCoursesSectionsApi:
    """content content.courses.sections API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, course_id: str, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None, status: Optional[str] = None) -> CoursesSectionsListResult:
        """Admin Course Sections List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/content/courses/{serialize_path_parameter(course_id, {'name': 'courseId', 'style': 'simple', 'explode': False})}/sections", query))

    def create(self, course_id: str, body: AdminCourseSectionMutationRequest) -> CoursesSectionsCreateResult:
        """Admin Course Section Create"""
        return self._client.post(f"/backend/v3/api/content/courses/{serialize_path_parameter(course_id, {'name': 'courseId', 'style': 'simple', 'explode': False})}/sections", json=body)

class ContentCourseCommentsApi:
    """content content.course_comments API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None, status: Optional[str] = None) -> CourseCommentsListResult:
        """Admin Course Comments List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/content/courses/comments", query))

    def moderate(self, comment_id: str, body: AdminCourseCommentModerationRequest) -> CourseCommentsModerateResult:
        """Admin Course Comment Moderate"""
        return self._client.patch(f"/backend/v3/api/content/courses/comments/{serialize_path_parameter(comment_id, {'name': 'commentId', 'style': 'simple', 'explode': False})}/moderation", json=body)

class ContentCourseEngagementApi:
    """content content.course_engagement API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None, status: Optional[str] = None) -> CourseEngagementListResult:
        """Admin Course Engagement List"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/content/courses/engagement", query))
