from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import AdminAppCategoryCreateRequest, AdminAppCategoryUpdateRequest, AdminAppCreateRequest, AdminAppTemplateCreateRequest, AdminAppTemplateUpdateRequest, AdminAppUpdateRequest, AppsCategoriesCreateResult, AppsCategoriesDeleteResult, AppsCategoriesListResult, AppsCategoriesUpdateResult, AppsCreateResult, AppsDeleteResult, AppsDisableResult, AppsEnableResult, AppsListResult, AppsPublishResult, AppsRetrieveResult, AppsTemplatesCreateResult, AppsTemplatesDeleteResult, AppsTemplatesListResult, AppsTemplatesPublishResult, AppsTemplatesRetrieveResult, AppsTemplatesUnpublishResult, AppsTemplatesUpdateResult, AppsUnpublishResult, AppsUpdateResult

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



class PlatformApi:
    """platform platform API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.apps = PlatformAppsApi(client)


class PlatformAppsApi:
    """platform platform.apps API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.categories = PlatformAppsCategoriesApi(client)
        self.templates = PlatformAppsTemplatesApi(client)


    def list(self, q: Optional[str] = None, status: Optional[str] = None, market_status: Optional[str] = None, app_type: Optional[str] = None, category_id: Optional[str] = None, page: Optional[str] = None, page_size: Optional[str] = None) -> AppsListResult:
        """List apps"""
        query = build_query_string([
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'market_status', 'value': market_status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'app_type', 'value': app_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'category_id', 'value': category_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/platform/apps", query))

    def create(self, body: AdminAppCreateRequest) -> AppsCreateResult:
        """Create app"""
        return self._client.post(f"/backend/v3/api/platform/apps", json=body)

    def delete(self, app_id: str) -> AppsDeleteResult:
        """Delete app"""
        return self._client.delete(f"/backend/v3/api/platform/apps/{serialize_path_parameter(app_id, {'name': 'appId', 'style': 'simple', 'explode': False})}")

    def retrieve(self, app_id: str) -> AppsRetrieveResult:
        """List app"""
        return self._client.get(f"/backend/v3/api/platform/apps/{serialize_path_parameter(app_id, {'name': 'appId', 'style': 'simple', 'explode': False})}")

    def update(self, app_id: str, body: AdminAppUpdateRequest) -> AppsUpdateResult:
        """Update app"""
        return self._client.put(f"/backend/v3/api/platform/apps/{serialize_path_parameter(app_id, {'name': 'appId', 'style': 'simple', 'explode': False})}", json=body)

    def disable(self, app_id: str) -> AppsDisableResult:
        """Disable app"""
        return self._client.post(f"/backend/v3/api/platform/apps/{serialize_path_parameter(app_id, {'name': 'appId', 'style': 'simple', 'explode': False})}/disable")

    def enable(self, app_id: str) -> AppsEnableResult:
        """Enable app"""
        return self._client.post(f"/backend/v3/api/platform/apps/{serialize_path_parameter(app_id, {'name': 'appId', 'style': 'simple', 'explode': False})}/enable")

    def publish(self, app_id: str) -> AppsPublishResult:
        """Publish app"""
        return self._client.post(f"/backend/v3/api/platform/apps/{serialize_path_parameter(app_id, {'name': 'appId', 'style': 'simple', 'explode': False})}/publish")

    def unpublish(self, app_id: str) -> AppsUnpublishResult:
        """Offline app"""
        return self._client.post(f"/backend/v3/api/platform/apps/{serialize_path_parameter(app_id, {'name': 'appId', 'style': 'simple', 'explode': False})}/unpublish")

class PlatformAppsCategoriesApi:
    """platform platform.apps.categories API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> AppsCategoriesListResult:
        """List app categories"""
        return self._client.get(f"/backend/v3/api/platform/apps/categories")

    def create(self, body: AdminAppCategoryCreateRequest) -> AppsCategoriesCreateResult:
        """Create app category"""
        return self._client.post(f"/backend/v3/api/platform/apps/categories", json=body)

    def delete(self, category_id: str) -> AppsCategoriesDeleteResult:
        """Delete app category"""
        return self._client.delete(f"/backend/v3/api/platform/apps/categories/{serialize_path_parameter(category_id, {'name': 'categoryId', 'style': 'simple', 'explode': False})}")

    def update(self, category_id: str, body: AdminAppCategoryUpdateRequest) -> AppsCategoriesUpdateResult:
        """Update app category"""
        return self._client.put(f"/backend/v3/api/platform/apps/categories/{serialize_path_parameter(category_id, {'name': 'categoryId', 'style': 'simple', 'explode': False})}", json=body)

class PlatformAppsTemplatesApi:
    """platform platform.apps.templates API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, q: Optional[str] = None, publish_status: Optional[str] = None, template_type: Optional[str] = None, runtime: Optional[str] = None, category_id: Optional[str] = None, page: Optional[str] = None, page_size: Optional[str] = None) -> AppsTemplatesListResult:
        """List app templates"""
        query = build_query_string([
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'publish_status', 'value': publish_status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'template_type', 'value': template_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'runtime', 'value': runtime, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'category_id', 'value': category_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/platform/apps/templates", query))

    def create(self, body: AdminAppTemplateCreateRequest) -> AppsTemplatesCreateResult:
        """Create app template"""
        return self._client.post(f"/backend/v3/api/platform/apps/templates", json=body)

    def delete(self, template_id: str) -> AppsTemplatesDeleteResult:
        """Delete app template"""
        return self._client.delete(f"/backend/v3/api/platform/apps/templates/{serialize_path_parameter(template_id, {'name': 'templateId', 'style': 'simple', 'explode': False})}")

    def retrieve(self, template_id: str) -> AppsTemplatesRetrieveResult:
        """List app template"""
        return self._client.get(f"/backend/v3/api/platform/apps/templates/{serialize_path_parameter(template_id, {'name': 'templateId', 'style': 'simple', 'explode': False})}")

    def update(self, template_id: str, body: AdminAppTemplateUpdateRequest) -> AppsTemplatesUpdateResult:
        """Update app template"""
        return self._client.put(f"/backend/v3/api/platform/apps/templates/{serialize_path_parameter(template_id, {'name': 'templateId', 'style': 'simple', 'explode': False})}", json=body)

    def publish(self, template_id: str) -> AppsTemplatesPublishResult:
        """Publish app template"""
        return self._client.post(f"/backend/v3/api/platform/apps/templates/{serialize_path_parameter(template_id, {'name': 'templateId', 'style': 'simple', 'explode': False})}/publish")

    def unpublish(self, template_id: str) -> AppsTemplatesUnpublishResult:
        """Offline app template"""
        return self._client.post(f"/backend/v3/api/platform/apps/templates/{serialize_path_parameter(template_id, {'name': 'templateId', 'style': 'simple', 'explode': False})}/unpublish")
