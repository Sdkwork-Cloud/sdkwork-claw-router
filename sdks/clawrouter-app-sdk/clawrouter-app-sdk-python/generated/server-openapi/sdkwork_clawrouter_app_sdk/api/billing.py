from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import AccountPointsExchangeRateRetrieveResult, AccountPointsExchangesCreateResult, AccountPointsExchangesRetrieveResult, AccountPointsExchangesRulesListResult, AccountPointsHistoryListResult, AccountPointsRechargesCreateResult, AccountPointsRechargesOrdersCancelResult, AccountPointsRechargesOrdersRetrieveResult, AccountPointsRechargesPackagesListResult, AccountPointsRechargesRecordsListResult, AccountPointsRetrieveResult, AccountPointsTransfersCreateResult, AccountSummaryRetrieveResult, AccountTokensDeductionsCreateResult, AccountTokensRetrieveResult, CommerceCouponClaimRequest, CommerceCouponUsageRequest, CommerceCouponUsageRollbackRequest, CommercePreflightRequest, CommerceRechargeOrderCancelRequest, CommerceWalletCommandRequest, CouponsCatalogListResult, CouponsCatalogRetrieveResult, CouponsClaimsCreateResult, CouponsRedeemCreateResult, CouponsUsageCreateResult, CouponsUsageReversalsCreateResult, PaymentsCheckoutRetrieveResult, PaymentsRecordsListResult, PaymentsRecordsRetrieveResult, PreflightEstimatesCreateResult, PreflightPrechecksCreateResult, PreflightPreholdsCreateResult, PreflightReleasesCreateResult, PreflightSettlementsCreateResult, RedeemCodeRequest, SettlementsDashboardListResult, SubmitRechargeRequest, UsersCurrentCouponsListResult, UsersCurrentCouponsRetrieveResult, WalletAccountsListResult, WalletExchangesCreateResult, WalletOperationsRetrieveResult, WalletOverviewRetrieveResult, WalletTopupsCreateResult, WalletTransactionsListResult, WalletTransactionsRetrieveResult, WalletTransfersCreateResult, WalletWithdrawalsCreateResult

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
        self.account = BillingAccountApi(client)
        self.coupons = BillingCouponsApi(client)
        self.payments = BillingPaymentsApi(client)
        self.preflight = BillingPreflightApi(client)
        self.settlements = BillingSettlementsApi(client)
        self.users = BillingUsersApi(client)
        self.wallet = BillingWalletApi(client)


class BillingAccountApi:
    """billing billing.account API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.points = BillingAccountPointsApi(client)
        self.summary = BillingAccountSummaryApi(client)
        self.tokens = BillingAccountTokensApi(client)


class BillingAccountPointsApi:
    """billing billing.account.points API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.exchange_rate = BillingAccountPointsExchangeRateApi(client)
        self.exchanges = BillingAccountPointsExchangesApi(client)
        self.history = BillingAccountPointsHistoryApi(client)
        self.recharges = BillingAccountPointsRechargesApi(client)
        self.transfers = BillingAccountPointsTransfersApi(client)


    def retrieve(self) -> AccountPointsRetrieveResult:
        """Retrieve account points"""
        return self._client.get(f"/app/v3/api/billing/account/points")

class BillingAccountPointsExchangeRateApi:
    """billing billing.account.points.exchange_rate API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> AccountPointsExchangeRateRetrieveResult:
        """Retrieve account points exchange rate"""
        return self._client.get(f"/app/v3/api/billing/account/points/exchange_rate")

class BillingAccountPointsExchangesApi:
    """billing billing.account.points.exchanges API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.rules = BillingAccountPointsExchangesRulesApi(client)


    def create(self, body: CommerceWalletCommandRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AccountPointsExchangesCreateResult:
        """Create account points exchange"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/account/points/exchanges", json=body, headers=request_headers)

    def retrieve(self, exchange_no: str) -> AccountPointsExchangesRetrieveResult:
        """Retrieve account points exchange"""
        return self._client.get(f"/app/v3/api/billing/account/points/exchanges/{serialize_path_parameter(exchange_no, {'name': 'exchangeNo', 'style': 'simple', 'explode': False})}")

class BillingAccountPointsExchangesRulesApi:
    """billing billing.account.points.exchanges.rules API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, source_asset_type: Optional[str] = None, target_asset_type: Optional[str] = None) -> AccountPointsExchangesRulesListResult:
        """List account points exchange rules"""
        query = build_query_string([
            {'name': 'source_asset_type', 'value': source_asset_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'target_asset_type', 'value': target_asset_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/billing/account/points/exchanges/rules", query))

class BillingAccountPointsHistoryApi:
    """billing billing.account.points.history API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> AccountPointsHistoryListResult:
        """List account points history"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/billing/account/points/history", query))

class BillingAccountPointsRechargesApi:
    """billing billing.account.points.recharges API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.orders = BillingAccountPointsRechargesOrdersApi(client)
        self.packages = BillingAccountPointsRechargesPackagesApi(client)
        self.records = BillingAccountPointsRechargesRecordsApi(client)


    def create(self, body: SubmitRechargeRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AccountPointsRechargesCreateResult:
        """Create recharge"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/account/points/recharges", json=body, headers=request_headers)

class BillingAccountPointsRechargesOrdersApi:
    """billing billing.account.points.recharges.orders API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, order_no: str) -> AccountPointsRechargesOrdersRetrieveResult:
        """Retrieve account points recharge order"""
        return self._client.get(f"/app/v3/api/billing/account/points/recharges/orders/{serialize_path_parameter(order_no, {'name': 'orderNo', 'style': 'simple', 'explode': False})}")

    def cancel(self, order_no: str, body: CommerceRechargeOrderCancelRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AccountPointsRechargesOrdersCancelResult:
        """Cancel account points recharge order"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/account/points/recharges/orders/{serialize_path_parameter(order_no, {'name': 'orderNo', 'style': 'simple', 'explode': False})}/cancel", json=body, headers=request_headers)

class BillingAccountPointsRechargesPackagesApi:
    """billing billing.account.points.recharges.packages API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> AccountPointsRechargesPackagesListResult:
        """List packages"""
        return self._client.get(f"/app/v3/api/billing/account/points/recharges/packages")

class BillingAccountPointsRechargesRecordsApi:
    """billing billing.account.points.recharges.records API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> AccountPointsRechargesRecordsListResult:
        """List account points recharge records"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/billing/account/points/recharges/records", query))

class BillingAccountPointsTransfersApi:
    """billing billing.account.points.transfers API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceWalletCommandRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AccountPointsTransfersCreateResult:
        """Create account points transfer"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/account/points/transfers", json=body, headers=request_headers)

class BillingAccountSummaryApi:
    """billing billing.account.summary API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> AccountSummaryRetrieveResult:
        """List account details"""
        return self._client.get(f"/app/v3/api/billing/account/summary")

class BillingAccountTokensApi:
    """billing billing.account.tokens API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.deductions = BillingAccountTokensDeductionsApi(client)


    def retrieve(self) -> AccountTokensRetrieveResult:
        """Retrieve account tokens"""
        return self._client.get(f"/app/v3/api/billing/account/tokens")

class BillingAccountTokensDeductionsApi:
    """billing billing.account.tokens.deductions API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceWalletCommandRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> AccountTokensDeductionsCreateResult:
        """Create account token deduction"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/account/tokens/deductions", json=body, headers=request_headers)

class BillingCouponsApi:
    """billing billing.coupons API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.catalog = BillingCouponsCatalogApi(client)
        self.claims = BillingCouponsClaimsApi(client)
        self.redeem = BillingCouponsRedeemApi(client)
        self.usage = BillingCouponsUsageApi(client)
        self.usage_reversals = BillingCouponsUsageReversalsApi(client)


class BillingCouponsCatalogApi:
    """billing billing.coupons.catalog API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, status: Optional[str] = None, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> CouponsCatalogListResult:
        """List coupon catalog"""
        query = build_query_string([
            {'name': 'status', 'value': status, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/billing/coupons/catalog", query))

    def retrieve(self, coupon_id: str) -> CouponsCatalogRetrieveResult:
        """Retrieve coupon catalog item"""
        return self._client.get(f"/app/v3/api/billing/coupons/catalog/{serialize_path_parameter(coupon_id, {'name': 'couponId', 'style': 'simple', 'explode': False})}")

class BillingCouponsClaimsApi:
    """billing billing.coupons.claims API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceCouponClaimRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CouponsClaimsCreateResult:
        """Create coupon claim"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/coupons/claims", json=body, headers=request_headers)

class BillingCouponsRedeemApi:
    """billing billing.coupons.redeem API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: RedeemCodeRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CouponsRedeemCreateResult:
        """Redeem code"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/coupons/redeem", json=body, headers=request_headers)

class BillingCouponsUsageApi:
    """billing billing.coupons.usage API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceCouponUsageRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CouponsUsageCreateResult:
        """Create coupon usage"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/coupons/usage", json=body, headers=request_headers)

class BillingCouponsUsageReversalsApi:
    """billing billing.coupons.usage_reversals API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceCouponUsageRollbackRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> CouponsUsageReversalsCreateResult:
        """Create coupon usage reversal"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/coupons/usage_reversals", json=body, headers=request_headers)

class BillingPaymentsApi:
    """billing billing.payments API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.checkout = BillingPaymentsCheckoutApi(client)
        self.records = BillingPaymentsRecordsApi(client)


class BillingPaymentsCheckoutApi:
    """billing billing.payments.checkout API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, order_no: str) -> PaymentsCheckoutRetrieveResult:
        """List checkout status"""
        return self._client.get(f"/app/v3/api/billing/payments/checkout/{serialize_path_parameter(order_no, {'name': 'orderNo', 'style': 'simple', 'explode': False})}")

class BillingPaymentsRecordsApi:
    """billing billing.payments.records API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> PaymentsRecordsListResult:
        """List recharge history"""
        return self._client.get(f"/app/v3/api/billing/payments/records")

    def retrieve(self, payment_id: str) -> PaymentsRecordsRetrieveResult:
        """Retrieve payment record"""
        return self._client.get(f"/app/v3/api/billing/payments/records/{serialize_path_parameter(payment_id, {'name': 'paymentId', 'style': 'simple', 'explode': False})}")

class BillingPreflightApi:
    """billing billing.preflight API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.estimates = BillingPreflightEstimatesApi(client)
        self.prechecks = BillingPreflightPrechecksApi(client)
        self.preholds = BillingPreflightPreholdsApi(client)
        self.releases = BillingPreflightReleasesApi(client)
        self.settlements = BillingPreflightSettlementsApi(client)


class BillingPreflightEstimatesApi:
    """billing billing.preflight.estimates API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommercePreflightRequest) -> PreflightEstimatesCreateResult:
        """Create preflight estimate"""
        return self._client.post(f"/app/v3/api/billing/preflight/estimates", json=body)

class BillingPreflightPrechecksApi:
    """billing billing.preflight.prechecks API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommercePreflightRequest) -> PreflightPrechecksCreateResult:
        """Create preflight precheck"""
        return self._client.post(f"/app/v3/api/billing/preflight/prechecks", json=body)

class BillingPreflightPreholdsApi:
    """billing billing.preflight.preholds API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommercePreflightRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> PreflightPreholdsCreateResult:
        """Create preflight prehold"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/preflight/preholds", json=body, headers=request_headers)

class BillingPreflightReleasesApi:
    """billing billing.preflight.releases API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommercePreflightRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> PreflightReleasesCreateResult:
        """Create preflight release"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/preflight/releases", json=body, headers=request_headers)

class BillingPreflightSettlementsApi:
    """billing billing.preflight.settlements API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommercePreflightRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> PreflightSettlementsCreateResult:
        """Create preflight settlement"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/preflight/settlements", json=body, headers=request_headers)

class BillingSettlementsApi:
    """billing billing.settlements API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.dashboard = BillingSettlementsDashboardApi(client)


class BillingSettlementsDashboardApi:
    """billing billing.settlements.dashboard API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, year: Optional[int] = None) -> SettlementsDashboardListResult:
        """List dashboard data"""
        query = build_query_string([
            {'name': 'year', 'value': year, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/billing/settlements/dashboard", query))

class BillingUsersApi:
    """billing billing.users API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.current = BillingUsersCurrentApi(client)


class BillingUsersCurrentApi:
    """billing billing.users.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.coupons = BillingUsersCurrentCouponsApi(client)


class BillingUsersCurrentCouponsApi:
    """billing billing.users.current.coupons API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> UsersCurrentCouponsListResult:
        """List redeem history"""
        return self._client.get(f"/app/v3/api/billing/users/current/coupons")

    def retrieve(self, user_coupon_id: str) -> UsersCurrentCouponsRetrieveResult:
        """Retrieve current user coupon"""
        return self._client.get(f"/app/v3/api/billing/users/current/coupons/{serialize_path_parameter(user_coupon_id, {'name': 'userCouponId', 'style': 'simple', 'explode': False})}")

class BillingWalletApi:
    """billing billing.wallet API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.accounts = BillingWalletAccountsApi(client)
        self.exchanges = BillingWalletExchangesApi(client)
        self.operations = BillingWalletOperationsApi(client)
        self.overview = BillingWalletOverviewApi(client)
        self.topups = BillingWalletTopupsApi(client)
        self.transactions = BillingWalletTransactionsApi(client)
        self.transfers = BillingWalletTransfersApi(client)
        self.withdrawals = BillingWalletWithdrawalsApi(client)


class BillingWalletAccountsApi:
    """billing billing.wallet.accounts API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, asset_type: Optional[str] = None) -> WalletAccountsListResult:
        """List wallet accounts"""
        query = build_query_string([
            {'name': 'asset_type', 'value': asset_type, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/billing/wallet/accounts", query))

class BillingWalletExchangesApi:
    """billing billing.wallet.exchanges API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceWalletCommandRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> WalletExchangesCreateResult:
        """Create wallet exchange"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/wallet/exchanges", json=body, headers=request_headers)

class BillingWalletOperationsApi:
    """billing billing.wallet.operations API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, request_no: str) -> WalletOperationsRetrieveResult:
        """Retrieve wallet operation"""
        return self._client.get(f"/app/v3/api/billing/wallet/operations/{serialize_path_parameter(request_no, {'name': 'requestNo', 'style': 'simple', 'explode': False})}")

class BillingWalletOverviewApi:
    """billing billing.wallet.overview API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> WalletOverviewRetrieveResult:
        """Retrieve wallet overview"""
        return self._client.get(f"/app/v3/api/billing/wallet/overview")

class BillingWalletTopupsApi:
    """billing billing.wallet.topups API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceWalletCommandRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> WalletTopupsCreateResult:
        """Create wallet topup"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/wallet/topups", json=body, headers=request_headers)

class BillingWalletTransactionsApi:
    """billing billing.wallet.transactions API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self, page: Optional[int] = None, page_size: Optional[int] = None, cursor: Optional[str] = None) -> WalletTransactionsListResult:
        """List wallet transactions"""
        query = build_query_string([
            {'name': 'page', 'value': page, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'page_size', 'value': page_size, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'cursor', 'value': cursor, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/billing/wallet/transactions", query))

    def retrieve(self, transaction_id: str) -> WalletTransactionsRetrieveResult:
        """Retrieve wallet transaction"""
        return self._client.get(f"/app/v3/api/billing/wallet/transactions/{serialize_path_parameter(transaction_id, {'name': 'transactionId', 'style': 'simple', 'explode': False})}")

class BillingWalletTransfersApi:
    """billing billing.wallet.transfers API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceWalletCommandRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> WalletTransfersCreateResult:
        """Create wallet transfer"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/wallet/transfers", json=body, headers=request_headers)

class BillingWalletWithdrawalsApi:
    """billing billing.wallet.withdrawals API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: CommerceWalletCommandRequest, idempotency_key: str, x_request_id: Optional[str] = None) -> WalletWithdrawalsCreateResult:
        """Create wallet withdrawal"""
        request_headers = build_request_headers(
            {
                'Idempotency-Key': {'value': idempotency_key, 'style': 'simple', 'explode': False},
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/billing/wallet/withdrawals", json=body, headers=request_headers)
