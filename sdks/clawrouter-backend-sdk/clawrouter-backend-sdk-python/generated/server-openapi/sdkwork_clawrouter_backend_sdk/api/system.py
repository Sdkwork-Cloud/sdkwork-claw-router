from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import AdminFirewallRuleCreateRequest, AdminIpLimitCreateRequest, AdminModelLimitCreateRequest, AdminTokenLimitCreateRequest, AdminUserCreateRequest, AdminUserUpdateRequest, DashboardAdminOverviewRetrieveResult, FirewallsRulesCreateResult, FirewallsRulesDeleteResult, FirewallsRulesListResult, InstallationStatusRetrieveResult, MonitorAlertsListResult, MonitorNodesListResult, MonitorPerformanceListResult, RateLimitsApiKeysCreateResult, RateLimitsApiKeysListResult, RateLimitsIpCreateResult, RateLimitsIpListResult, RateLimitsModelsCreateResult, RateLimitsModelsListResult, RecordsListResult, UsersCreateResult, UsersUpdateResult

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


class SystemApi:
    """system API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client

    def dashboard_admin_overview_retrieve(self) -> DashboardAdminOverviewRetrieveResult:
        """List dashboard data"""
        return self._client.get(f"/backend/v3/api/system/dashboard/admin/overview")

    def firewalls_rules_list(self) -> FirewallsRulesListResult:
        """List firewalls"""
        return self._client.get(f"/backend/v3/api/system/firewalls/rules")

    def firewalls_rules_create(self, body: AdminFirewallRuleCreateRequest, x_request_id: Optional[str] = None) -> FirewallsRulesCreateResult:
        """Create firewall"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/system/firewalls/rules", json=body, headers=request_headers)

    def firewalls_rules_delete(self, rule_id: str) -> FirewallsRulesDeleteResult:
        """Delete firewall"""
        return self._client.delete(f"/backend/v3/api/system/firewalls/rules/{serialize_path_parameter(rule_id, {'name': 'ruleId', 'style': 'simple', 'explode': False})}")

    def installation_status_retrieve(self) -> InstallationStatusRetrieveResult:
        """List installation status"""
        return self._client.get(f"/backend/v3/api/system/installation/status")

    def monitor_alerts_list(self) -> MonitorAlertsListResult:
        """List alerts"""
        return self._client.get(f"/backend/v3/api/system/monitor/alerts")

    def monitor_nodes_list(self) -> MonitorNodesListResult:
        """List nodes"""
        return self._client.get(f"/backend/v3/api/system/monitor/nodes")

    def monitor_performance_list(self) -> MonitorPerformanceListResult:
        """List performance data"""
        return self._client.get(f"/backend/v3/api/system/monitor/performance")

    def rate_limits_api_keys_list(self) -> RateLimitsApiKeysListResult:
        """List token limits"""
        return self._client.get(f"/backend/v3/api/system/rate_limits/api_keys")

    def rate_limits_api_keys_create(self, body: AdminTokenLimitCreateRequest, x_request_id: Optional[str] = None) -> RateLimitsApiKeysCreateResult:
        """Create token limit"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/system/rate_limits/api_keys", json=body, headers=request_headers)

    def rate_limits_ip_list(self) -> RateLimitsIpListResult:
        """List IP limits"""
        return self._client.get(f"/backend/v3/api/system/rate_limits/ip")

    def rate_limits_ip_create(self, body: AdminIpLimitCreateRequest, x_request_id: Optional[str] = None) -> RateLimitsIpCreateResult:
        """Create IP limit"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/system/rate_limits/ip", json=body, headers=request_headers)

    def rate_limits_models_list(self) -> RateLimitsModelsListResult:
        """List model limits"""
        return self._client.get(f"/backend/v3/api/system/rate_limits/models")

    def rate_limits_models_create(self, body: AdminModelLimitCreateRequest, x_request_id: Optional[str] = None) -> RateLimitsModelsCreateResult:
        """Create model limit"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/system/rate_limits/models", json=body, headers=request_headers)

    def records_list(self, page: Optional[int] = None, page_size: Optional[int] = None, user: Optional[str] = None, token: Optional[str] = None, model: Optional[str] = None) -> RecordsListResult:
        """List logs"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'user', 'value': user, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'token', 'value': token, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'model', 'value': model, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/system/records", query))

    def users_create(self, body: AdminUserCreateRequest, x_request_id: Optional[str] = None) -> UsersCreateResult:
        """Create user"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/system/users", json=body, headers=request_headers)

    def users_update(self, body: AdminUserUpdateRequest, x_request_id: Optional[str] = None) -> UsersUpdateResult:
        """Update user"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/system/users", json=body, headers=request_headers)
