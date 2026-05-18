from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import AdminCouponBatchGenerateRequest, AdminCouponCreateRequest, AdminPromoCodeStatusUpdateRequest, AdminUserBalanceAdjustmentRequest, CommerceExchangeRuleUpsertRequest, CommerceRechargePackageMutationRequest, CouponBatchesCreateResult, CouponBatchesListResult, CouponCodesListResult, CouponCodesStatusUpdateResult, CouponsCreateResult, CouponsDeleteResult, CouponsListResult, CouponsUpdateResult, ExchangeRulesListResult, ExchangeRulesUpdateResult, FinanceLedgerListResult, FinanceUsageStatementsListResult, PaymentsAttemptsListResult, RechargesPackagesCreateResult, RechargesPackagesDeleteResult, RechargesPackagesListResult, RechargesPackagesUpdateResult, RechargesRecordsListResult, RechargesRecordsRetrieveResult, ReferralsStatsListResult, UsersBalanceAdjustmentsCreateResult, UsersCouponsListResult

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


class BillingApi:
    """billing billing API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.coupon_batches = BillingCouponBatchesApi(client)
        self.coupon_codes = BillingCouponCodesApi(client)
        self.coupons = BillingCouponsApi(client)
        self.exchange_rules = BillingExchangeRulesApi(client)
        self.finance = BillingFinanceApi(client)
        self.payments = BillingPaymentsApi(client)
        self.recharges = BillingRechargesApi(client)
        self.referrals = BillingReferralsApi(client)
        self.users = BillingUsersApi(client)


class BillingCouponBatchesApi:
    """billing billing.coupon_batches API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, coupon_id: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> CouponBatchesListResult:
        """List batches"""
        query = build_query_string([
            {'name': 'coupon_id', 'value': coupon_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/billing/coupon_batches", query))

    def create(self, body: AdminCouponBatchGenerateRequest, x_request_id: Optional[str] = None) -> CouponBatchesCreateResult:
        """Generate batch"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/billing/coupon_batches", json=body, headers=request_headers)

class BillingCouponCodesApi:
    """billing billing.coupon_codes API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.status = BillingCouponCodesStatusApi(client)


    def list(self, coupon_id: Optional[str] = None, batch_id: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> CouponCodesListResult:
        """List promo codes"""
        query = build_query_string([
            {'name': 'coupon_id', 'value': coupon_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'batch_id', 'value': batch_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/billing/coupon_codes", query))

class BillingCouponCodesStatusApi:
    """billing billing.coupon_codes.status API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def update(self, code_id: str, body: AdminPromoCodeStatusUpdateRequest, x_request_id: Optional[str] = None) -> CouponCodesStatusUpdateResult:
        """Update promo code status"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.patch(f"/backend/v3/api/billing/coupon_codes/{serialize_path_parameter(code_id, {'name': 'codeId', 'style': 'simple', 'explode': False})}/status", json=body, headers=request_headers)

class BillingCouponsApi:
    """billing billing.coupons API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> CouponsListResult:
        """List coupons"""
        query = build_query_string([
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/billing/coupons", query))

    def create(self, body: AdminCouponCreateRequest, x_request_id: Optional[str] = None) -> CouponsCreateResult:
        """Create coupon"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/billing/coupons", json=body, headers=request_headers)

    def delete(self, coupon_id: str) -> CouponsDeleteResult:
        """Delete coupon"""
        return self._client.delete(f"/backend/v3/api/billing/coupons/{serialize_path_parameter(coupon_id, {'name': 'couponId', 'style': 'simple', 'explode': False})}")

    def update(self, coupon_id: str, body: AdminCouponCreateRequest, x_request_id: Optional[str] = None) -> CouponsUpdateResult:
        """Update coupon"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/billing/coupons/{serialize_path_parameter(coupon_id, {'name': 'couponId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class BillingExchangeRulesApi:
    """billing billing.exchange_rules API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, source_asset_type: Optional[str] = None, target_asset_type: Optional[str] = None, status: Optional[str] = None) -> ExchangeRulesListResult:
        """List exchange rules"""
        query = build_query_string([
            {'name': 'source_asset_type', 'value': source_asset_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'target_asset_type', 'value': target_asset_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/billing/exchange_rules", query))

    def update(self, body: CommerceExchangeRuleUpsertRequest, x_request_id: Optional[str] = None) -> ExchangeRulesUpdateResult:
        """Upsert exchange rule"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/billing/exchange_rules", json=body, headers=request_headers)

class BillingFinanceApi:
    """billing billing.finance API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.ledger = BillingFinanceLedgerApi(client)
        self.usage_statements = BillingFinanceUsageStatementsApi(client)


class BillingFinanceLedgerApi:
    """billing billing.finance.ledger API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None, status: Optional[str] = None, start_time: Optional[str] = None, end_time: Optional[str] = None) -> FinanceLedgerListResult:
        """List transactions"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'start_time', 'value': start_time, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'end_time', 'value': end_time, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/billing/finance/ledger", query))

class BillingFinanceUsageStatementsApi:
    """billing billing.finance.usage_statements API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, q: Optional[str] = None, status: Optional[str] = None, start_time: Optional[str] = None, end_time: Optional[str] = None) -> FinanceUsageStatementsListResult:
        """List billing"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'q', 'value': q, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'start_time', 'value': start_time, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'end_time', 'value': end_time, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/billing/finance/usage_statements", query))

class BillingPaymentsApi:
    """billing billing.payments API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.attempts = BillingPaymentsAttemptsApi(client)


class BillingPaymentsAttemptsApi:
    """billing billing.payments.attempts API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, provider: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> PaymentsAttemptsListResult:
        """List payment attempts"""
        query = build_query_string([
            {'name': 'provider', 'value': provider, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/billing/payments/attempts", query))

class BillingRechargesApi:
    """billing billing.recharges API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.packages = BillingRechargesPackagesApi(client)
        self.records = BillingRechargesRecordsApi(client)


class BillingRechargesPackagesApi:
    """billing billing.recharges.packages API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, status: Optional[str] = None) -> RechargesPackagesListResult:
        """List recharge packages"""
        query = build_query_string([
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/billing/recharges/packages", query))

    def create(self, body: CommerceRechargePackageMutationRequest, x_request_id: Optional[str] = None) -> RechargesPackagesCreateResult:
        """Create recharge package"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/billing/recharges/packages", json=body, headers=request_headers)

    def delete(self, package_id: str) -> RechargesPackagesDeleteResult:
        """Delete recharge package"""
        return self._client.delete(f"/backend/v3/api/billing/recharges/packages/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}")

    def update(self, package_id: str, body: CommerceRechargePackageMutationRequest, x_request_id: Optional[str] = None) -> RechargesPackagesUpdateResult:
        """Update recharge package"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.put(f"/backend/v3/api/billing/recharges/packages/{serialize_path_parameter(package_id, {'name': 'packageId', 'style': 'simple', 'explode': False})}", json=body, headers=request_headers)

class BillingRechargesRecordsApi:
    """billing billing.recharges.records API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, user_id: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> RechargesRecordsListResult:
        """List recharge records"""
        query = build_query_string([
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/billing/recharges/records", query))

    def retrieve(self, order_no: str) -> RechargesRecordsRetrieveResult:
        """Retrieve recharge record"""
        return self._client.get(f"/backend/v3/api/billing/recharges/records/{serialize_path_parameter(order_no, {'name': 'orderNo', 'style': 'simple', 'explode': False})}")

class BillingReferralsApi:
    """billing billing.referrals API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.stats = BillingReferralsStatsApi(client)


class BillingReferralsStatsApi:
    """billing billing.referrals.stats API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> ReferralsStatsListResult:
        """List referral stats"""
        return self._client.get(f"/backend/v3/api/billing/referrals/stats")

class BillingUsersApi:
    """billing billing.users API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.coupons = BillingUsersCouponsApi(client)
        self.balance_adjustments = BillingUsersBalanceAdjustmentsApi(client)


class BillingUsersCouponsApi:
    """billing billing.users.coupons API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, user_id: Optional[str] = None, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> UsersCouponsListResult:
        """List redemption records"""
        query = build_query_string([
            {'name': 'user_id', 'value': user_id, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/backend/v3/api/billing/users/coupons", query))

class BillingUsersBalanceAdjustmentsApi:
    """billing billing.users.balance_adjustments API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, user_id: str, body: AdminUserBalanceAdjustmentRequest, x_request_id: Optional[str] = None) -> UsersBalanceAdjustmentsCreateResult:
        """Update balance"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/backend/v3/api/billing/users/{serialize_path_parameter(user_id, {'name': 'userId', 'style': 'simple', 'explode': False})}/balance_adjustments", json=body, headers=request_headers)
