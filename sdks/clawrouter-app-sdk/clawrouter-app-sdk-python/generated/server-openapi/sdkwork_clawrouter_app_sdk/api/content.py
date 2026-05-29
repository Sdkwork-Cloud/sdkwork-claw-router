from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import ApplicationsCreateResult, ApplicationsVideosCreateResult, CommentsCreateResult, CommentsDeleteResult, CommentsLikesCreateResult, CommentsLikesCurrentDeleteResult, CommentsListResult, CommentsPinsCreateResult, CommentsPinsCurrentDeleteResult, CommentsRepliesListResult, CommentsReplyCreateResult, CommentsRetrieveResult, CommentsStatisticsListResult, CourseApplicationCreateRequest, CourseApplicationVideoUploadRequest, CoursesCategoriesListResult, CoursesListResult, CoursesOverviewRetrieveResult, CoursesRetrieveResult, FeedsCategoryRetrieveResult, FeedsCollectionsCreateResult, FeedsCollectionsCurrentDeleteResult, FeedsCollectionsCurrentRetrieveResult, FeedsCreateResult, FeedsDeleteResult, FeedsHotListResult, FeedsLikesCreateResult, FeedsLikesCurrentDeleteResult, FeedsListResult, FeedsMostLikedListResult, FeedsMostViewedListResult, FeedsOverviewRetrieveResult, FeedsRecommendListResult, FeedsRetrieveResult, FeedsSharesCreateResult, FeedsTopListResult, ForumCreateCommentRequest, ForumCreateFeedRequest, ForumReplyCommentRequest, UsersCurrentCommentsListResult

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
        self.comments = ContentCommentsApi(client)
        self.feeds = ContentFeedsApi(client)
        self.users = ContentUsersApi(client)
        self.courses = ContentCoursesApi(client)
        self.applications = ContentApplicationsApi(client)


class ContentCommentsApi:
    """content content.comments API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.statistics = ContentCommentsStatisticsApi(client)
        self.likes = ContentCommentsLikesApi(client)
        self.pins = ContentCommentsPinsApi(client)
        self.replies = ContentCommentsRepliesApi(client)


    def list(self, content_type: str, content_id: int, page: Optional[int] = None, page_size: Optional[int] = None) -> CommentsListResult:
        """List forum comments"""
        query = build_query_string([
            {'name': 'content_type', 'value': content_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'content_id', 'value': content_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/comments", query))

    def create(self, body: ForumCreateCommentRequest) -> CommentsCreateResult:
        """Create forum comment"""
        return self._client.post(f"/app/v3/api/content/comments", json=body)

    def delete(self, comment_id: str) -> CommentsDeleteResult:
        """Delete forum comment"""
        return self._client.delete(f"/app/v3/api/content/comments/{serialize_path_parameter(comment_id, {'name': 'commentId', 'style': 'simple', 'explode': False})}")

    def retrieve(self, comment_id: str) -> CommentsRetrieveResult:
        """List forum comment detail"""
        return self._client.get(f"/app/v3/api/content/comments/{serialize_path_parameter(comment_id, {'name': 'commentId', 'style': 'simple', 'explode': False})}")

class ContentCommentsStatisticsApi:
    """content content.comments.statistics API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, content_type: str, content_id: int) -> CommentsStatisticsListResult:
        """List forum comment statistics"""
        query = build_query_string([
            {'name': 'content_type', 'value': content_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'content_id', 'value': content_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/comments/statistics", query))

class ContentCommentsLikesApi:
    """content content.comments.likes API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.current = ContentCommentsLikesCurrentApi(client)


    def create(self, comment_id: str) -> CommentsLikesCreateResult:
        """Like forum comment"""
        return self._client.post(f"/app/v3/api/content/comments/{serialize_path_parameter(comment_id, {'name': 'commentId', 'style': 'simple', 'explode': False})}/likes")

class ContentCommentsLikesCurrentApi:
    """content content.comments.likes.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def delete(self, comment_id: str) -> CommentsLikesCurrentDeleteResult:
        """Unlike forum comment"""
        return self._client.delete(f"/app/v3/api/content/comments/{serialize_path_parameter(comment_id, {'name': 'commentId', 'style': 'simple', 'explode': False})}/likes/current")

class ContentCommentsPinsApi:
    """content content.comments.pins API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.current = ContentCommentsPinsCurrentApi(client)


    def create(self, comment_id: str) -> CommentsPinsCreateResult:
        """Pin forum comment"""
        return self._client.post(f"/app/v3/api/content/comments/{serialize_path_parameter(comment_id, {'name': 'commentId', 'style': 'simple', 'explode': False})}/pins")

class ContentCommentsPinsCurrentApi:
    """content content.comments.pins.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def delete(self, comment_id: str) -> CommentsPinsCurrentDeleteResult:
        """Unpin forum comment"""
        return self._client.delete(f"/app/v3/api/content/comments/{serialize_path_parameter(comment_id, {'name': 'commentId', 'style': 'simple', 'explode': False})}/pins/current")

class ContentCommentsRepliesApi:
    """content content.comments.replies API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, comment_id: str, page: Optional[int] = None, page_size: Optional[int] = None) -> CommentsRepliesListResult:
        """List forum comment replies"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/comments/{serialize_path_parameter(comment_id, {'name': 'commentId', 'style': 'simple', 'explode': False})}/replies", query))

    def create(self, comment_id: str, body: ForumReplyCommentRequest) -> CommentsReplyCreateResult:
        """Reply forum comment"""
        return self._client.post(f"/app/v3/api/content/comments/{serialize_path_parameter(comment_id, {'name': 'commentId', 'style': 'simple', 'explode': False})}/reply", json=body)

class ContentFeedsApi:
    """content content.feeds API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.category = ContentFeedsCategoryApi(client)
        self.hot = ContentFeedsHotApi(client)
        self.most_liked = ContentFeedsMostLikedApi(client)
        self.most_viewed = ContentFeedsMostViewedApi(client)
        self.overview = ContentFeedsOverviewApi(client)
        self.recommend = ContentFeedsRecommendApi(client)
        self.top = ContentFeedsTopApi(client)
        self.collections = ContentFeedsCollectionsApi(client)
        self.likes = ContentFeedsLikesApi(client)
        self.shares = ContentFeedsSharesApi(client)


    def list(self, type: Optional[str] = None, content_type: Optional[str] = None, q: Optional[str] = None, author_id: Optional[int] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> FeedsListResult:
        """List forum feeds"""
        query = build_query_string([
            {'name': 'type', 'value': type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'content_type', 'value': content_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'author_id', 'value': author_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/feeds", query))

    def create(self, body: ForumCreateFeedRequest) -> FeedsCreateResult:
        """Create forum feed"""
        return self._client.post(f"/app/v3/api/content/feeds", json=body)

    def delete(self, id: str) -> FeedsDeleteResult:
        """Delete forum feed"""
        return self._client.delete(f"/app/v3/api/content/feeds/{serialize_path_parameter(id, {'name': 'id', 'style': 'simple', 'explode': False})}")

    def retrieve(self, id: str) -> FeedsRetrieveResult:
        """List forum feed detail"""
        return self._client.get(f"/app/v3/api/content/feeds/{serialize_path_parameter(id, {'name': 'id', 'style': 'simple', 'explode': False})}")

class ContentFeedsCategoryApi:
    """content content.feeds.category API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, category_id: str, page: Optional[int] = None, page_size: Optional[int] = None) -> FeedsCategoryRetrieveResult:
        """List category forum feeds"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/feeds/category/{serialize_path_parameter(category_id, {'name': 'categoryId', 'style': 'simple', 'explode': False})}", query))

class ContentFeedsHotApi:
    """content content.feeds.hot API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, limit: Optional[int] = None) -> FeedsHotListResult:
        """List hot forum feeds"""
        query = build_query_string([
            {'name': 'limit', 'value': limit, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/feeds/hot", query))

class ContentFeedsMostLikedApi:
    """content content.feeds.most_liked API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, limit: Optional[int] = None) -> FeedsMostLikedListResult:
        """List most liked forum feeds"""
        query = build_query_string([
            {'name': 'limit', 'value': limit, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/feeds/most_liked", query))

class ContentFeedsMostViewedApi:
    """content content.feeds.most_viewed API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, limit: Optional[int] = None) -> FeedsMostViewedListResult:
        """List most viewed forum feeds"""
        query = build_query_string([
            {'name': 'limit', 'value': limit, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/feeds/most_viewed", query))

class ContentFeedsOverviewApi:
    """content content.feeds.overview API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> FeedsOverviewRetrieveResult:
        """List forum overview"""
        return self._client.get(f"/app/v3/api/content/feeds/overview")

class ContentFeedsRecommendApi:
    """content content.feeds.recommend API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, limit: Optional[int] = None) -> FeedsRecommendListResult:
        """List recommended forum feeds"""
        query = build_query_string([
            {'name': 'limit', 'value': limit, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/feeds/recommend", query))

class ContentFeedsTopApi:
    """content content.feeds.top API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, limit: Optional[int] = None) -> FeedsTopListResult:
        """List top forum feeds"""
        query = build_query_string([
            {'name': 'limit', 'value': limit, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/feeds/top", query))

class ContentFeedsCollectionsApi:
    """content content.feeds.collections API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.current = ContentFeedsCollectionsCurrentApi(client)


    def create(self, id: str, folder_id: Optional[int] = None) -> FeedsCollectionsCreateResult:
        """Collect forum feed"""
        query = build_query_string([
            {'name': 'folder_id', 'value': folder_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.post(_append_query_string(f"/app/v3/api/content/feeds/{serialize_path_parameter(id, {'name': 'id', 'style': 'simple', 'explode': False})}/collections", query))

class ContentFeedsCollectionsCurrentApi:
    """content content.feeds.collections.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def delete(self, id: str) -> FeedsCollectionsCurrentDeleteResult:
        """Uncollect forum feed"""
        return self._client.delete(f"/app/v3/api/content/feeds/{serialize_path_parameter(id, {'name': 'id', 'style': 'simple', 'explode': False})}/collections/current")

    def retrieve(self, id: str) -> FeedsCollectionsCurrentRetrieveResult:
        """Check forum feed collected"""
        return self._client.get(f"/app/v3/api/content/feeds/{serialize_path_parameter(id, {'name': 'id', 'style': 'simple', 'explode': False})}/collections/current")

class ContentFeedsLikesApi:
    """content content.feeds.likes API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.current = ContentFeedsLikesCurrentApi(client)


    def create(self, id: str) -> FeedsLikesCreateResult:
        """Like forum feed"""
        return self._client.post(f"/app/v3/api/content/feeds/{serialize_path_parameter(id, {'name': 'id', 'style': 'simple', 'explode': False})}/likes")

class ContentFeedsLikesCurrentApi:
    """content content.feeds.likes.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def delete(self, id: str) -> FeedsLikesCurrentDeleteResult:
        """Unlike forum feed"""
        return self._client.delete(f"/app/v3/api/content/feeds/{serialize_path_parameter(id, {'name': 'id', 'style': 'simple', 'explode': False})}/likes/current")

class ContentFeedsSharesApi:
    """content content.feeds.shares API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, id: str) -> FeedsSharesCreateResult:
        """Share forum feed"""
        return self._client.post(f"/app/v3/api/content/feeds/{serialize_path_parameter(id, {'name': 'id', 'style': 'simple', 'explode': False})}/shares")

class ContentUsersApi:
    """content content.users API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.current = ContentUsersCurrentApi(client)


class ContentUsersCurrentApi:
    """content content.users.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.comments = ContentUsersCurrentCommentsApi(client)


class ContentUsersCurrentCommentsApi:
    """content content.users.current.comments API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None) -> UsersCurrentCommentsListResult:
        """List my forum comments"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/content/users/current/comments", query))

class ContentCoursesApi:
    """content content.courses API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.categories = ContentCoursesCategoriesApi(client)
        self.overview = ContentCoursesOverviewApi(client)


    def list(self, level: Optional[int] = None, category: Optional[str] = None, q: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> CoursesListResult:
        """List courses"""
        query = build_query_string([
            {'name': 'level', 'value': level, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'category', 'value': category, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/courses", query))

    def retrieve(self, course_id: str) -> CoursesRetrieveResult:
        """List course detail"""
        return self._client.get(f"/app/v3/api/courses/{serialize_path_parameter(course_id, {'name': 'courseId', 'style': 'simple', 'explode': False})}")

class ContentCoursesCategoriesApi:
    """content content.courses.categories API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> CoursesCategoriesListResult:
        """List course categories"""
        return self._client.get(f"/app/v3/api/courses/categories")

class ContentCoursesOverviewApi:
    """content content.courses.overview API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> CoursesOverviewRetrieveResult:
        """List course overview"""
        return self._client.get(f"/app/v3/api/courses/overview")

class ContentApplicationsApi:
    """content content.applications API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.videos = ContentApplicationsVideosApi(client)


    def create(self, body: CourseApplicationCreateRequest) -> ApplicationsCreateResult:
        """Create course application"""
        return self._client.post(f"/app/v3/api/courses/applications", json=body)

class ContentApplicationsVideosApi:
    """content content.applications.videos API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CourseApplicationVideoUploadRequest) -> ApplicationsVideosCreateResult:
        """Upload course application video"""
        return self._client.post(f"/app/v3/api/courses/applications/videos", data=body)
