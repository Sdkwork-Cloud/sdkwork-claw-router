from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import ApiKeysCreateResult, ApiKeysDeleteResult, ApiKeysListResult, ApiKeysUpdateResult, CreateApiKeyRequest, DepartmentAssignmentsListResult, DepartmentsListResult, DepartmentsTreeRetrieveResult, OrganizationMembershipsListResult, OrganizationsListResult, OrganizationsTreeRetrieveResult, PositionAssignmentsListResult, PositionsListResult, RoleBindingsListResult, UpdateApiKeyRequest, UpdateSettingsRequest, UsersCurrentRetrieveResult, UsersSettingsRetrieveResult, UsersSettingsUpdateResult

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


class IamApi:
    """iam iam API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.api_keys = IamApiKeysApi(client)
        self.department_assignments = IamDepartmentAssignmentsApi(client)
        self.departments = IamDepartmentsApi(client)
        self.organization_memberships = IamOrganizationMembershipsApi(client)
        self.organizations = IamOrganizationsApi(client)
        self.position_assignments = IamPositionAssignmentsApi(client)
        self.positions = IamPositionsApi(client)
        self.role_bindings = IamRoleBindingsApi(client)
        self.users = IamUsersApi(client)


class IamApiKeysApi:
    """iam iam.api_keys API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> ApiKeysListResult:
        """List keys"""
        return self._client.get(f"/app/v3/api/iam/api_keys")

    def create(self, body: CreateApiKeyRequest, idempotency_key: str) -> ApiKeysCreateResult:
        """Create key"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/iam/api_keys", json=body, headers=request_headers)

    def delete(self, api_key_id: str) -> ApiKeysDeleteResult:
        """Delete key"""
        return self._client.delete(f"/app/v3/api/iam/api_keys/{serialize_path_parameter(api_key_id, {'name': 'apiKeyId', 'style': 'simple', 'explode': False})}")

    def update(self, api_key_id: str, body: UpdateApiKeyRequest) -> ApiKeysUpdateResult:
        """Update key"""
        return self._client.patch(f"/app/v3/api/iam/api_keys/{serialize_path_parameter(api_key_id, {'name': 'apiKeyId', 'style': 'simple', 'explode': False})}", json=body)

class IamDepartmentAssignmentsApi:
    """iam iam.department_assignments API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, organization_id: Optional[str] = None, department_id: Optional[str] = None, user_id: Optional[str] = None, scope_id: Optional[str] = None, status: Optional[str] = None, q: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> DepartmentAssignmentsListResult:
        """List current IAM department assignments"""
        query = build_query_string([
            {'name': 'organization_id', 'value': organization_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'department_id', 'value': department_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'scope_id', 'value': scope_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/iam/department_assignments", query))

class IamDepartmentsApi:
    """iam iam.departments API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.tree = IamDepartmentsTreeApi(client)


    def list(self, organization_id: Optional[str] = None, department_id: Optional[str] = None, user_id: Optional[str] = None, scope_id: Optional[str] = None, status: Optional[str] = None, q: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> DepartmentsListResult:
        """List current IAM departments"""
        query = build_query_string([
            {'name': 'organization_id', 'value': organization_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'department_id', 'value': department_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'scope_id', 'value': scope_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/iam/departments", query))

class IamDepartmentsTreeApi:
    """iam iam.departments.tree API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, organization_id: Optional[str] = None, department_id: Optional[str] = None, user_id: Optional[str] = None, scope_id: Optional[str] = None, status: Optional[str] = None, q: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> DepartmentsTreeRetrieveResult:
        """Retrieve current IAM department tree"""
        query = build_query_string([
            {'name': 'organization_id', 'value': organization_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'department_id', 'value': department_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'scope_id', 'value': scope_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/iam/departments/tree", query))

class IamOrganizationMembershipsApi:
    """iam iam.organization_memberships API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, organization_id: Optional[str] = None, department_id: Optional[str] = None, user_id: Optional[str] = None, scope_id: Optional[str] = None, status: Optional[str] = None, q: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> OrganizationMembershipsListResult:
        """List current IAM organization memberships"""
        query = build_query_string([
            {'name': 'organization_id', 'value': organization_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'department_id', 'value': department_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'scope_id', 'value': scope_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/iam/organization_memberships", query))

class IamOrganizationsApi:
    """iam iam.organizations API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.tree = IamOrganizationsTreeApi(client)


    def list(self, organization_id: Optional[str] = None, department_id: Optional[str] = None, user_id: Optional[str] = None, scope_id: Optional[str] = None, status: Optional[str] = None, q: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> OrganizationsListResult:
        """List current IAM organizations"""
        query = build_query_string([
            {'name': 'organization_id', 'value': organization_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'department_id', 'value': department_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'scope_id', 'value': scope_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/iam/organizations", query))

class IamOrganizationsTreeApi:
    """iam iam.organizations.tree API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, organization_id: Optional[str] = None, department_id: Optional[str] = None, user_id: Optional[str] = None, scope_id: Optional[str] = None, status: Optional[str] = None, q: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> OrganizationsTreeRetrieveResult:
        """Retrieve current IAM organization tree"""
        query = build_query_string([
            {'name': 'organization_id', 'value': organization_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'department_id', 'value': department_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'scope_id', 'value': scope_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/iam/organizations/tree", query))

class IamPositionAssignmentsApi:
    """iam iam.position_assignments API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, organization_id: Optional[str] = None, department_id: Optional[str] = None, user_id: Optional[str] = None, scope_id: Optional[str] = None, status: Optional[str] = None, q: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> PositionAssignmentsListResult:
        """List current IAM position assignments"""
        query = build_query_string([
            {'name': 'organization_id', 'value': organization_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'department_id', 'value': department_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'scope_id', 'value': scope_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/iam/position_assignments", query))

class IamPositionsApi:
    """iam iam.positions API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, organization_id: Optional[str] = None, department_id: Optional[str] = None, user_id: Optional[str] = None, scope_id: Optional[str] = None, status: Optional[str] = None, q: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> PositionsListResult:
        """List current IAM positions"""
        query = build_query_string([
            {'name': 'organization_id', 'value': organization_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'department_id', 'value': department_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'scope_id', 'value': scope_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/iam/positions", query))

class IamRoleBindingsApi:
    """iam iam.role_bindings API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, organization_id: Optional[str] = None, department_id: Optional[str] = None, user_id: Optional[str] = None, scope_id: Optional[str] = None, status: Optional[str] = None, q: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None) -> RoleBindingsListResult:
        """List current IAM role bindings"""
        query = build_query_string([
            {'name': 'organization_id', 'value': organization_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'department_id', 'value': department_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'scope_id', 'value': scope_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/iam/role_bindings", query))

class IamUsersApi:
    """iam iam.users API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.current = IamUsersCurrentApi(client)
        self.settings = IamUsersSettingsApi(client)


class IamUsersCurrentApi:
    """iam iam.users.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> UsersCurrentRetrieveResult:
        """Retrieve current IAM user"""
        return self._client.get(f"/app/v3/api/iam/users/current")

class IamUsersSettingsApi:
    """iam iam.users.settings API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> UsersSettingsRetrieveResult:
        """List settings"""
        return self._client.get(f"/app/v3/api/iam/users/settings")

    def update(self, body: UpdateSettingsRequest) -> UsersSettingsUpdateResult:
        """Update settings"""
        return self._client.put(f"/app/v3/api/iam/users/settings", json=body)
