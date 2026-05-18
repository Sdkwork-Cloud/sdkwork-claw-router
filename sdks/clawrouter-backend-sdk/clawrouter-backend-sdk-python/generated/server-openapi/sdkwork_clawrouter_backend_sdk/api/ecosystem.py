from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import AdminSkillArtifactCreateRequest, AdminSkillArtifactUpdateRequest, AdminSkillAssetCreateRequest, AdminSkillAssetUpdateRequest, AdminSkillCategoryCreateRequest, AdminSkillCreateRequest, AdminSkillPackageCreateRequest, AdminSkillPackageUpdateRequest, AdminSkillReviewRequest, AdminSkillUpdateRequest, SkillsArtifactsCreateResult, SkillsArtifactsDeleteResult, SkillsArtifactsListResult, SkillsArtifactsRetrieveResult, SkillsArtifactsUpdateResult, SkillsAssetsCreateResult, SkillsAssetsDeleteResult, SkillsAssetsListResult, SkillsAssetsRetrieveResult, SkillsAssetsUpdateResult, SkillsCategoriesCreateResult, SkillsCategoriesListResult, SkillsCreateResult, SkillsDeleteResult, SkillsDisableResult, SkillsEnableResult, SkillsListResult, SkillsPackageCreateResult, SkillsPackageDeleteResult, SkillsPackageDisableResult, SkillsPackageEnableResult, SkillsPackageListResult, SkillsPackageRetrieveResult, SkillsPackageUpdateResult, SkillsPublishResult, SkillsRetrieveResult, SkillsReviewApproveResult, SkillsReviewRejectResult, SkillsUnpublishResult, SkillsUpdateResult

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

def build_request_headers(headers: Dict[str, Dict[str, Any]], cookies: Optional[Dict[str, Dict[str, Any]]] = None) -> Optional[Dict[str, str]]:
    request_headers: Dict[str, str] = {}
    for name, parameter in headers.items():
        serialized = serialize_parameter_value(parameter)
        if serialized is not None:
            request_headers[name] = serialized

    cookie_header = build_cookie_header(cookies or {})
    if cookie_header:
        request_headers['Cookie'] = (
            f"{request_headers['Cookie']}; {cookie_header}"
            if 'Cookie' in request_headers
            else cookie_header
        )

    return request_headers or None


def build_cookie_header(cookies: Dict[str, Dict[str, Any]]) -> Optional[str]:
    from urllib.parse import quote

    pairs: List[str] = []
    for name, parameter in cookies.items():
        serialized = serialize_parameter_value(parameter)
        if serialized is not None:
            pairs.append(f"{quote(str(name), safe='')}={quote(serialized, safe='')}")
    return '; '.join(pairs) if pairs else None


def serialize_parameter_value(parameter: Optional[Dict[str, Any]]) -> Optional[str]:
    value = None if parameter is None else parameter.get('value')
    if value is None:
        return None
    if parameter and parameter.get('content_type'):
        import json

        return json.dumps(value, separators=(',', ':'))
    if isinstance(value, (list, tuple)):
        return ','.join(serialize_header_primitive(item) for item in value if item is not None)
    if isinstance(value, dict):
        return serialize_header_object(value, bool(parameter and parameter.get('explode')))
    return serialize_header_primitive(value)


def serialize_header_object(value: Dict[str, Any], explode: bool) -> str:
    entries = [(key, entry_value) for key, entry_value in value.items() if entry_value is not None]
    if explode:
        return ','.join(f"{key}={serialize_header_primitive(entry_value)}" for key, entry_value in entries)
    return ','.join(item for key, entry_value in entries for item in (str(key), serialize_header_primitive(entry_value)))


def serialize_header_primitive(value: Any) -> str:
    return str(value)


class EcosystemApi:
    """ecosystem ecosystem API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.skills = EcosystemSkillsApi(client)


class EcosystemSkillsApi:
    """ecosystem ecosystem.skills API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.categories = EcosystemSkillsCategoriesApi(client)
        self.package = EcosystemSkillsPackageApi(client)
        self.artifacts = EcosystemSkillsArtifactsApi(client)
        self.assets = EcosystemSkillsAssetsApi(client)
        self.review = EcosystemSkillsReviewApi(client)


    def list(self, q: Optional[str] = None, market_status: Optional[str] = None, review_status: Optional[str] = None, visibility: Optional[str] = None, enabled: Optional[bool] = None, category_id: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> SkillsListResult:
        """List skills"""
        query = build_query_string([
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'market_status', 'value': market_status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'review_status', 'value': review_status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'visibility', 'value': visibility, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'enabled', 'value': enabled, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'category_id', 'value': category_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/ecosystem/skills", query))

    def create(self, body: AdminSkillCreateRequest, x_request_id: Optional[str] = None) -> SkillsCreateResult:
        """Create skill"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills", json=body, headers=request_headers)

    def delete(self, skill_id: str) -> SkillsDeleteResult:
        """Delete skill"""
        return self._client.delete(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}")

    def retrieve(self, skill_id: str) -> SkillsRetrieveResult:
        """Get skill"""
        return self._client.get(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}")

    def update(self, skill_id: str, body: AdminSkillUpdateRequest, x_request_id: Optional[str] = None) -> SkillsUpdateResult:
        """Update skill"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

    def disable(self, skill_id: str, x_request_id: Optional[str] = None) -> SkillsDisableResult:
        """Disable skill"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/disable", headers=request_headers)

    def enable(self, skill_id: str, x_request_id: Optional[str] = None) -> SkillsEnableResult:
        """Enable skill"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/enable", headers=request_headers)

    def publish(self, skill_id: str, x_request_id: Optional[str] = None) -> SkillsPublishResult:
        """Publish skill"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/publish", headers=request_headers)

    def unpublish(self, skill_id: str, x_request_id: Optional[str] = None) -> SkillsUnpublishResult:
        """Offline skill"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/unpublish", headers=request_headers)

class EcosystemSkillsCategoriesApi:
    """ecosystem ecosystem.skills.categories API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> SkillsCategoriesListResult:
        """List skill categories"""
        return self._client.get(f"/backend/v3/api/ecosystem/skills/categories")

    def create(self, body: AdminSkillCategoryCreateRequest, x_request_id: Optional[str] = None) -> SkillsCategoriesCreateResult:
        """Create skill category"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/categories", json=body, headers=request_headers)

class EcosystemSkillsPackageApi:
    """ecosystem ecosystem.skills.package API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, q: Optional[str] = None, enabled: Optional[bool] = None, category_id: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> SkillsPackageListResult:
        """List skill packages"""
        query = build_query_string([
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'enabled', 'value': enabled, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'category_id', 'value': category_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/ecosystem/skills/package", query))

    def create(self, body: AdminSkillPackageCreateRequest, x_request_id: Optional[str] = None) -> SkillsPackageCreateResult:
        """Create skill package"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/package", json=body, headers=request_headers)

    def delete(self, package_id: str) -> SkillsPackageDeleteResult:
        """Delete skill package"""
        return self._client.delete(f"/backend/v3/api/ecosystem/skills/package/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}")

    def retrieve(self, package_id: str) -> SkillsPackageRetrieveResult:
        """Get skill package"""
        return self._client.get(f"/backend/v3/api/ecosystem/skills/package/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}")

    def update(self, package_id: str, body: AdminSkillPackageUpdateRequest, x_request_id: Optional[str] = None) -> SkillsPackageUpdateResult:
        """Update skill package"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/ecosystem/skills/package/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

    def disable(self, package_id: str, x_request_id: Optional[str] = None) -> SkillsPackageDisableResult:
        """Disable skill package"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/package/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}/disable", headers=request_headers)

    def enable(self, package_id: str, x_request_id: Optional[str] = None) -> SkillsPackageEnableResult:
        """Enable skill package"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/package/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}/enable", headers=request_headers)

class EcosystemSkillsArtifactsApi:
    """ecosystem ecosystem.skills.artifacts API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, skill_id: str) -> SkillsArtifactsListResult:
        """List skill artifacts"""
        return self._client.get(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/artifacts")

    def create(self, skill_id: str, body: AdminSkillArtifactCreateRequest, x_request_id: Optional[str] = None) -> SkillsArtifactsCreateResult:
        """Create skill artifact"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/artifacts", json=body, headers=request_headers)

    def delete(self, skill_id: str, artifact_id: str, x_request_id: Optional[str] = None) -> SkillsArtifactsDeleteResult:
        """Delete skill artifact"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.delete(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/artifacts/{serialize_path_parameter(artifact_id, {'name': 'artifactId', 'style': 'simple', 'explode': False})}", headers=request_headers)

    def retrieve(self, skill_id: str, artifact_id: str) -> SkillsArtifactsRetrieveResult:
        """Get skill artifact"""
        return self._client.get(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/artifacts/{serialize_path_parameter(artifact_id, {'name': 'artifactId', 'style': 'simple', 'explode': False})}")

    def update(self, skill_id: str, artifact_id: str, body: AdminSkillArtifactUpdateRequest, x_request_id: Optional[str] = None) -> SkillsArtifactsUpdateResult:
        """Update skill artifact"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/artifacts/{serialize_path_parameter(artifact_id, {'name': 'artifactId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class EcosystemSkillsAssetsApi:
    """ecosystem ecosystem.skills.assets API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, skill_id: str) -> SkillsAssetsListResult:
        """List skill assets"""
        return self._client.get(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/assets")

    def create(self, skill_id: str, body: AdminSkillAssetCreateRequest, x_request_id: Optional[str] = None) -> SkillsAssetsCreateResult:
        """Create skill asset"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/assets", json=body, headers=request_headers)

    def delete(self, skill_id: str, asset_id: str, x_request_id: Optional[str] = None) -> SkillsAssetsDeleteResult:
        """Delete skill asset"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.delete(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/assets/{serialize_path_parameter(asset_id, {'name': 'assetId', 'style': 'simple', 'explode': False})}", headers=request_headers)

    def retrieve(self, skill_id: str, asset_id: str) -> SkillsAssetsRetrieveResult:
        """Get skill asset"""
        return self._client.get(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/assets/{serialize_path_parameter(asset_id, {'name': 'assetId', 'style': 'simple', 'explode': False})}")

    def update(self, skill_id: str, asset_id: str, body: AdminSkillAssetUpdateRequest, x_request_id: Optional[str] = None) -> SkillsAssetsUpdateResult:
        """Update skill asset"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/assets/{serialize_path_parameter(asset_id, {'name': 'assetId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class EcosystemSkillsReviewApi:
    """ecosystem ecosystem.skills.review API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def approve(self, skill_id: str, body: AdminSkillReviewRequest, x_request_id: Optional[str] = None) -> SkillsReviewApproveResult:
        """Approve skill"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/review/approve", json=body, headers=request_headers)

    def reject(self, skill_id: str, body: AdminSkillReviewRequest, x_request_id: Optional[str] = None) -> SkillsReviewRejectResult:
        """Reject skill"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/ecosystem/skills/{serialize_path_parameter(skill_id, {'name': 'skillId', 'style': 'simple', 'explode': False})}/review/reject", json=body, headers=request_headers)
