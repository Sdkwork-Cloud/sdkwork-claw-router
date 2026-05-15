from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import CreateRoutingChannelRequest, DashboardOverviewRetrieveResult, GatewayTracesListResult, GenerationsListResult, ModelRankingsListResult, ModelsListResult, ModelVendorsListResult, ProvidersListResult, RoutingApiKeysListResult, RoutingChannelsCreateResult, RoutingChannelsDeleteResult, RoutingChannelsListResult, RoutingChannelsStatusUpdateResult, RoutingChannelsUpdateResult, RoutingChannelsVerifyResult, RoutingRequestTracesListResult, RoutingStrategyListResult, RoutingStrategyUpdateResult, RoutingUsageListResult, SetRoutingChannelStatusRequest, UpdateRoutingChannelRequest, UpdateRoutingStrategyRequest, UsageLogsListResult

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


class AiApi:
    """ai ai API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client
        self.dashboard = AiDashboardApi(client)
        self.gateway = AiGatewayApi(client)
        self.generations = AiGenerationsApi(client)
        self.model_rankings = AiModelRankingsApi(client)
        self.model_vendors = AiModelVendorsApi(client)
        self.models = AiModelsApi(client)
        self.providers = AiProvidersApi(client)
        self.routing = AiRoutingApi(client)
        self.usage = AiUsageApi(client)


class AiDashboardApi:
    """ai ai.dashboard API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client
        self.overview = AiDashboardOverviewApi(client)


class AiDashboardOverviewApi:
    """ai ai.dashboard.overview API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, time_range: Optional[str] = None, start_time: Optional[str] = None, end_time: Optional[str] = None) -> DashboardOverviewRetrieveResult:
        """List dashboard overview"""
        query = build_query_string([
            {'name': 'time_range', 'value': time_range, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'start_time', 'value': start_time, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'end_time', 'value': end_time, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/ai/dashboard/overview", query))

class AiGatewayApi:
    """ai ai.gateway API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client
        self.traces = AiGatewayTracesApi(client)


class AiGatewayTracesApi:
    """ai ai.gateway.traces API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> GatewayTracesListResult:
        """List traces"""
        return self._client.get(f"/app/v3/api/ai/gateway/traces")

class AiGenerationsApi:
    """ai ai.generations API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> GenerationsListResult:
        """List generation history"""
        return self._client.get(f"/app/v3/api/ai/generations")

class AiModelRankingsApi:
    """ai ai.model_rankings API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, rank_scope: Optional[str] = None, vendor_code: Optional[str] = None, modality: Optional[str] = None, q: Optional[str] = None, limit: Optional[int] = None) -> ModelRankingsListResult:
        """List model rankings"""
        query = build_query_string([
            {'name': 'rank_scope', 'value': rank_scope, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'vendor_code', 'value': vendor_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'modality', 'value': modality, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'limit', 'value': limit, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/ai/model_rankings", query))

class AiModelVendorsApi:
    """ai ai.model_vendors API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> ModelVendorsListResult:
        """List ranking vendor filters"""
        return self._client.get(f"/app/v3/api/ai/model_vendors")

class AiModelsApi:
    """ai ai.models API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, billing_meter: Optional[str] = None, vendor_code: Optional[str] = None, vendor_codes: Optional[List[str]] = None, modalities: Optional[List[str]] = None, capabilities: Optional[List[str]] = None, categories: Optional[List[str]] = None, groups: Optional[List[str]] = None, q: Optional[str] = None, limit: Optional[int] = None) -> ModelsListResult:
        """List models"""
        query = build_query_string([
            {'name': 'billing_meter', 'value': billing_meter, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'vendor_code', 'value': vendor_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'vendor_codes', 'value': vendor_codes, 'style': 'form', 'explode': False, 'allow_reserved': False},
            {'name': 'modalities', 'value': modalities, 'style': 'form', 'explode': False, 'allow_reserved': False},
            {'name': 'capabilities', 'value': capabilities, 'style': 'form', 'explode': False, 'allow_reserved': False},
            {'name': 'categories', 'value': categories, 'style': 'form', 'explode': False, 'allow_reserved': False},
            {'name': 'groups', 'value': groups, 'style': 'form', 'explode': False, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'limit', 'value': limit, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/ai/models", query))

class AiProvidersApi:
    """ai ai.providers API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> ProvidersListResult:
        """List providers"""
        return self._client.get(f"/app/v3/api/ai/providers")

class AiRoutingApi:
    """ai ai.routing API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client
        self.api_keys = AiRoutingApiKeysApi(client)
        self.channels = AiRoutingChannelsApi(client)
        self.request_traces = AiRoutingRequestTracesApi(client)
        self.strategy = AiRoutingStrategyApi(client)
        self.usage = AiRoutingUsageApi(client)


class AiRoutingApiKeysApi:
    """ai ai.routing.api_keys API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> RoutingApiKeysListResult:
        """List API keys"""
        return self._client.get(f"/app/v3/api/ai/routing/api_keys")

class AiRoutingChannelsApi:
    """ai ai.routing.channels API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client
        self.status = AiRoutingChannelsStatusApi(client)


    def list(self) -> RoutingChannelsListResult:
        """List channels"""
        return self._client.get(f"/app/v3/api/ai/routing/channels")

    def create(self, body: CreateRoutingChannelRequest, x_request_id: Optional[str] = None) -> RoutingChannelsCreateResult:
        """Create channel"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/ai/routing/channels", json=body, headers=request_headers)

    def delete(self, channel_id: str) -> RoutingChannelsDeleteResult:
        """Delete channel"""
        return self._client.delete(f"/app/v3/api/ai/routing/channels/{serialize_path_parameter(channel_id, {'name': 'channelId', 'style': 'simple', 'explode': False})}")

    def update(self, channel_id: str, body: UpdateRoutingChannelRequest, x_request_id: Optional[str] = None) -> RoutingChannelsUpdateResult:
        """Update channel"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/app/v3/api/ai/routing/channels/{serialize_path_parameter(channel_id, {'name': 'channelId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

    def verify(self, channel_id: str, x_request_id: Optional[str] = None) -> RoutingChannelsVerifyResult:
        """Test channel"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/ai/routing/channels/{serialize_path_parameter(channel_id, {'name': 'channelId', 'style': 'simple', 'explode': False})}/verify", headers=request_headers)

class AiRoutingChannelsStatusApi:
    """ai ai.routing.channels.status API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def update(self, channel_id: str, body: SetRoutingChannelStatusRequest, x_request_id: Optional[str] = None) -> RoutingChannelsStatusUpdateResult:
        """Set channel status"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/app/v3/api/ai/routing/channels/{serialize_path_parameter(channel_id, {'name': 'channelId', 'style': 'simple', 'explode': False})}/status", json=body, headers=request_headers)

class AiRoutingRequestTracesApi:
    """ai ai.routing.request_traces API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> RoutingRequestTracesListResult:
        """List request traces"""
        return self._client.get(f"/app/v3/api/ai/routing/request_traces")

class AiRoutingStrategyApi:
    """ai ai.routing.strategy API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> RoutingStrategyListResult:
        """List strategy"""
        return self._client.get(f"/app/v3/api/ai/routing/strategy")

    def update(self, body: UpdateRoutingStrategyRequest) -> RoutingStrategyUpdateResult:
        """Update strategy"""
        return self._client.put(f"/app/v3/api/ai/routing/strategy", json=body)

class AiRoutingUsageApi:
    """ai ai.routing.usage API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> RoutingUsageListResult:
        """List usage data"""
        return self._client.get(f"/app/v3/api/ai/routing/usage")

class AiUsageApi:
    """ai ai.usage API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client
        self.logs = AiUsageLogsApi(client)


class AiUsageLogsApi:
    """ai ai.usage.logs API client."""
    
    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None, status: Optional[str] = None, start_time: Optional[str] = None, end_time: Optional[str] = None) -> UsageLogsListResult:
        """List logs"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'start_time', 'value': start_time, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'end_time', 'value': end_time, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/ai/usage/logs", query))
