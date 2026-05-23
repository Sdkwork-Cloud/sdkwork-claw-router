from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import AgentCreateRequest, AgentDefinitionsCreateResult, AgentDefinitionsListResult, AgentDefinitionsRetrieveResult, AgentRunCompleteRequest, AgentRunCreateRequest, AgentRunsCreateResult, AgentRunsListResult, AgentRunsRetrieveResult, AgentRunsSubmitResult, AgentRunStepCompleteRequest, AgentRunStepCreateRequest, AgentRunStepsCreateResult, AgentRunStepsListResult, AgentRunStepsSubmitResult, AgentSessionCreateRequest, AgentSessionsCreateResult, AgentSessionsListResult, AgentSessionsRetrieveResult

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


class AgentsApi:
    """agents agents API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.agent_definitions = AgentsAgentDefinitionsApi(client)
        self.agent_runs = AgentsAgentRunsApi(client)
        self.agent_run_steps = AgentsAgentRunStepsApi(client)
        self.agent_sessions = AgentsAgentSessionsApi(client)


class AgentsAgentDefinitionsApi:
    """agents agents.agent_definitions API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None) -> AgentDefinitionsListResult:
        """List user agents"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/agents", query))

    def create(self, body: AgentCreateRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AgentDefinitionsCreateResult:
        """Create user agent"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/agents", json=body, headers=request_headers)

    def retrieve(self, agent_id: str) -> AgentDefinitionsRetrieveResult:
        """Retrieve user agent"""
        return self._client.get(f"/app/v3/api/agents/{serialize_path_parameter(agent_id, {'name': 'agentId', 'style': 'simple', 'explode': False})}")

class AgentsAgentRunsApi:
    """agents agents.agent_runs API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, run_id: str) -> AgentRunsRetrieveResult:
        """Retrieve agent run"""
        return self._client.get(f"/app/v3/api/agents/runs/{serialize_path_parameter(run_id, {'name': 'runId', 'style': 'simple', 'explode': False})}")

    def submit(self, run_id: str, body: AgentRunCompleteRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AgentRunsSubmitResult:
        """Complete agent run"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/agents/runs/{serialize_path_parameter(run_id, {'name': 'runId', 'style': 'simple', 'explode': False})}/complete", json=body, headers=request_headers)

    def list(self, session_id: str, page: Optional[int] = None, page_size: Optional[int] = None) -> AgentRunsListResult:
        """List agent session runs"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/agents/sessions/{serialize_path_parameter(session_id, {'name': 'sessionId', 'style': 'simple', 'explode': False})}/runs", query))

    def create(self, session_id: str, body: AgentRunCreateRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AgentRunsCreateResult:
        """Create agent run"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/agents/sessions/{serialize_path_parameter(session_id, {'name': 'sessionId', 'style': 'simple', 'explode': False})}/runs", json=body, headers=request_headers)

class AgentsAgentRunStepsApi:
    """agents agents.agent_run_steps API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, run_id: str, page: Optional[int] = None, page_size: Optional[int] = None) -> AgentRunStepsListResult:
        """List agent run steps"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/agents/runs/{serialize_path_parameter(run_id, {'name': 'runId', 'style': 'simple', 'explode': False})}/steps", query))

    def create(self, run_id: str, body: AgentRunStepCreateRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AgentRunStepsCreateResult:
        """Create agent run step"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/agents/runs/{serialize_path_parameter(run_id, {'name': 'runId', 'style': 'simple', 'explode': False})}/steps", json=body, headers=request_headers)

    def submit(self, run_id: str, step_id: str, body: AgentRunStepCompleteRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AgentRunStepsSubmitResult:
        """Complete agent run step"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/agents/runs/{serialize_path_parameter(run_id, {'name': 'runId', 'style': 'simple', 'explode': False})}/steps/{serialize_path_parameter(step_id, {'name': 'stepId', 'style': 'simple', 'explode': False})}/complete", json=body, headers=request_headers)

class AgentsAgentSessionsApi:
    """agents agents.agent_sessions API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, session_id: str) -> AgentSessionsRetrieveResult:
        """Retrieve agent session"""
        return self._client.get(f"/app/v3/api/agents/sessions/{serialize_path_parameter(session_id, {'name': 'sessionId', 'style': 'simple', 'explode': False})}")

    def list(self, agent_id: str, page: Optional[int] = None, page_size: Optional[int] = None) -> AgentSessionsListResult:
        """List agent sessions"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/agents/{serialize_path_parameter(agent_id, {'name': 'agentId', 'style': 'simple', 'explode': False})}/sessions", query))

    def create(self, agent_id: str, body: AgentSessionCreateRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AgentSessionsCreateResult:
        """Create agent session"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/agents/{serialize_path_parameter(agent_id, {'name': 'agentId', 'style': 'simple', 'explode': False})}/sessions", json=body, headers=request_headers)
