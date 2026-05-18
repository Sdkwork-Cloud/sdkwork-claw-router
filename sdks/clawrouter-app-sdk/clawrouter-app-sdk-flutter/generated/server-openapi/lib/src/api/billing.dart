import 'dart:convert';
import '../http/client.dart';
import '../models.dart';

import 'paths.dart';
import 'response_helpers.dart';


class BillingApi {
  final HttpClient _client;

  BillingApi(this._client);

  /// Retrieve account points
  Future<AccountPointsRetrieveResult?> accountPointsRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/billing/account/points'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsRetrieveResult.fromJson(map);
    })();
  }

  /// Retrieve account points exchange rate
  Future<AccountPointsExchangeRateRetrieveResult?> accountPointsExchangeRateRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/billing/account/points/exchange_rate'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsExchangeRateRetrieveResult.fromJson(map);
    })();
  }

  /// Create account points exchange
  Future<AccountPointsExchangesCreateResult?> accountPointsExchangesCreate(CommerceWalletCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/account/points/exchanges'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsExchangesCreateResult.fromJson(map);
    })();
  }

  /// List account points exchange rules
  Future<AccountPointsExchangesRulesListResult?> accountPointsExchangesRulesList([String? sourceAssetType, String? targetAssetType]) async {
    final query = buildQueryString([
      QueryParameterSpec('source_asset_type', sourceAssetType, 'form', true, false, null),
      QueryParameterSpec('target_asset_type', targetAssetType, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/billing/account/points/exchanges/rules'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsExchangesRulesListResult.fromJson(map);
    })();
  }

  /// Retrieve account points exchange
  Future<AccountPointsExchangesRetrieveResult?> accountPointsExchangesRetrieve(String exchangeNo) async {
    final response = await _client.get(ApiPaths.appPath('/billing/account/points/exchanges/${serializePathParameter(exchangeNo, const PathParameterSpec('exchangeNo', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsExchangesRetrieveResult.fromJson(map);
    })();
  }

  /// List account points history
  Future<AccountPointsHistoryListResult?> accountPointsHistoryList([int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/billing/account/points/history'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsHistoryListResult.fromJson(map);
    })();
  }

  /// Create recharge
  Future<AccountPointsRechargesCreateResult?> accountPointsRechargesCreate(SubmitRechargeRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/account/points/recharges'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsRechargesCreateResult.fromJson(map);
    })();
  }

  /// Retrieve account points recharge order
  Future<AccountPointsRechargesOrdersRetrieveResult?> accountPointsRechargesOrdersRetrieve(String orderNo) async {
    final response = await _client.get(ApiPaths.appPath('/billing/account/points/recharges/orders/${serializePathParameter(orderNo, const PathParameterSpec('orderNo', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsRechargesOrdersRetrieveResult.fromJson(map);
    })();
  }

  /// Cancel account points recharge order
  Future<AccountPointsRechargesOrdersCancelResult?> accountPointsRechargesOrdersCancel(String orderNo, CommerceRechargeOrderCancelRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/account/points/recharges/orders/${serializePathParameter(orderNo, const PathParameterSpec('orderNo', 'simple', false))}/cancel'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsRechargesOrdersCancelResult.fromJson(map);
    })();
  }

  /// List packages
  Future<AccountPointsRechargesPackagesListResult?> accountPointsRechargesPackagesList() async {
    final response = await _client.get(ApiPaths.appPath('/billing/account/points/recharges/packages'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsRechargesPackagesListResult.fromJson(map);
    })();
  }

  /// List account points recharge records
  Future<AccountPointsRechargesRecordsListResult?> accountPointsRechargesRecordsList([int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/billing/account/points/recharges/records'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsRechargesRecordsListResult.fromJson(map);
    })();
  }

  /// Create account points transfer
  Future<AccountPointsTransfersCreateResult?> accountPointsTransfersCreate(CommerceWalletCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/account/points/transfers'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountPointsTransfersCreateResult.fromJson(map);
    })();
  }

  /// List account details
  Future<AccountSummaryRetrieveResult?> accountSummaryRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/billing/account/summary'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountSummaryRetrieveResult.fromJson(map);
    })();
  }

  /// Retrieve account tokens
  Future<AccountTokensRetrieveResult?> accountTokensRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/billing/account/tokens'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountTokensRetrieveResult.fromJson(map);
    })();
  }

  /// Create account token deduction
  Future<AccountTokensDeductionsCreateResult?> accountTokensDeductionsCreate(CommerceWalletCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/account/tokens/deductions'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : AccountTokensDeductionsCreateResult.fromJson(map);
    })();
  }

  /// List coupon catalog
  Future<CouponsCatalogListResult?> couponsCatalogList([String? status, int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('status', status, 'form', true, false, null),
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/billing/coupons/catalog'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponsCatalogListResult.fromJson(map);
    })();
  }

  /// Retrieve coupon catalog item
  Future<CouponsCatalogRetrieveResult?> couponsCatalogRetrieve(String couponId) async {
    final response = await _client.get(ApiPaths.appPath('/billing/coupons/catalog/${serializePathParameter(couponId, const PathParameterSpec('couponId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponsCatalogRetrieveResult.fromJson(map);
    })();
  }

  /// Create coupon claim
  Future<CouponsClaimsCreateResult?> couponsClaimsCreate(CommerceCouponClaimRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/coupons/claims'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponsClaimsCreateResult.fromJson(map);
    })();
  }

  /// Redeem code
  Future<CouponsRedeemCreateResult?> couponsRedeemCreate(RedeemCodeRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/coupons/redeem'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponsRedeemCreateResult.fromJson(map);
    })();
  }

  /// Create coupon usage
  Future<CouponsUsageCreateResult?> couponsUsageCreate(CommerceCouponUsageRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/coupons/usage'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponsUsageCreateResult.fromJson(map);
    })();
  }

  /// Create coupon usage reversal
  Future<CouponsUsageReversalsCreateResult?> couponsUsageReversalsCreate(CommerceCouponUsageRollbackRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/coupons/usage_reversals'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : CouponsUsageReversalsCreateResult.fromJson(map);
    })();
  }

  /// List checkout status
  Future<PaymentsCheckoutRetrieveResult?> paymentsCheckoutRetrieve(String orderNo) async {
    final response = await _client.get(ApiPaths.appPath('/billing/payments/checkout/${serializePathParameter(orderNo, const PathParameterSpec('orderNo', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsCheckoutRetrieveResult.fromJson(map);
    })();
  }

  /// List recharge history
  Future<PaymentsRecordsListResult?> paymentsRecordsList() async {
    final response = await _client.get(ApiPaths.appPath('/billing/payments/records'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsRecordsListResult.fromJson(map);
    })();
  }

  /// Retrieve payment record
  Future<PaymentsRecordsRetrieveResult?> paymentsRecordsRetrieve(String paymentId) async {
    final response = await _client.get(ApiPaths.appPath('/billing/payments/records/${serializePathParameter(paymentId, const PathParameterSpec('paymentId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PaymentsRecordsRetrieveResult.fromJson(map);
    })();
  }

  /// Create preflight estimate
  Future<PreflightEstimatesCreateResult?> preflightEstimatesCreate(CommercePreflightRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/preflight/estimates'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PreflightEstimatesCreateResult.fromJson(map);
    })();
  }

  /// Create preflight precheck
  Future<PreflightPrechecksCreateResult?> preflightPrechecksCreate(CommercePreflightRequest body) async {
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/preflight/prechecks'), body: payload, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PreflightPrechecksCreateResult.fromJson(map);
    })();
  }

  /// Create preflight prehold
  Future<PreflightPreholdsCreateResult?> preflightPreholdsCreate(CommercePreflightRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/preflight/preholds'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PreflightPreholdsCreateResult.fromJson(map);
    })();
  }

  /// Create preflight release
  Future<PreflightReleasesCreateResult?> preflightReleasesCreate(CommercePreflightRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/preflight/releases'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PreflightReleasesCreateResult.fromJson(map);
    })();
  }

  /// Create preflight settlement
  Future<PreflightSettlementsCreateResult?> preflightSettlementsCreate(CommercePreflightRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/preflight/settlements'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : PreflightSettlementsCreateResult.fromJson(map);
    })();
  }

  /// List dashboard data
  Future<SettlementsDashboardListResult?> settlementsDashboardList([int? year]) async {
    final query = buildQueryString([
      QueryParameterSpec('year', year, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/billing/settlements/dashboard'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : SettlementsDashboardListResult.fromJson(map);
    })();
  }

  /// List redeem history
  Future<UsersCurrentCouponsListResult?> usersCurrentCouponsList() async {
    final response = await _client.get(ApiPaths.appPath('/billing/users/current/coupons'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : UsersCurrentCouponsListResult.fromJson(map);
    })();
  }

  /// Retrieve current user coupon
  Future<UsersCurrentCouponsRetrieveResult?> usersCurrentCouponsRetrieve(String userCouponId) async {
    final response = await _client.get(ApiPaths.appPath('/billing/users/current/coupons/${serializePathParameter(userCouponId, const PathParameterSpec('userCouponId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : UsersCurrentCouponsRetrieveResult.fromJson(map);
    })();
  }

  /// List VIP benefits
  Future<VipBenefitsListResult?> vipBenefitsList() async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/benefits'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipBenefitsListResult.fromJson(map);
    })();
  }

  /// Retrieve VIP info
  Future<VipInfoRetrieveResult?> vipInfoRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/info'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipInfoRetrieveResult.fromJson(map);
    })();
  }

  /// List VIP levels
  Future<VipLevelsListResult?> vipLevelsList() async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/levels'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipLevelsListResult.fromJson(map);
    })();
  }

  /// List VIP pack groups
  Future<VipPackGroupsListResult?> getVipPackGroupsList() async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/pack_groups'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPackGroupsListResult.fromJson(map);
    })();
  }

  /// Retrieve VIP pack group
  Future<VipPackGroupsRetrieveResult?> vipPackGroupsRetrieve(String packGroupId) async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/pack_groups/${serializePathParameter(packGroupId, const PathParameterSpec('packGroupId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPackGroupsRetrieveResult.fromJson(map);
    })();
  }

  /// List VIP pack group packs
  Future<VipPackGroupsPacksListResult?> getVipPackGroupsListPackGroups(String packGroupId) async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/pack_groups/${serializePathParameter(packGroupId, const PathParameterSpec('packGroupId', 'simple', false))}/packs'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPackGroupsPacksListResult.fromJson(map);
    })();
  }

  /// List VIP packs
  Future<VipPacksListResult?> vipPacksList() async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/packs'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPacksListResult.fromJson(map);
    })();
  }

  /// Retrieve VIP pack
  Future<VipPacksRetrieveResult?> vipPacksRetrieve(String packId) async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/packs/${serializePathParameter(packId, const PathParameterSpec('packId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPacksRetrieveResult.fromJson(map);
    })();
  }

  /// Retrieve VIP points balance
  Future<VipPointsBalanceRetrieveResult?> vipPointsBalanceRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/points/balance'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPointsBalanceRetrieveResult.fromJson(map);
    })();
  }

  /// Create VIP daily reward
  Future<VipPointsDailyRewardsCreateResult?> vipPointsDailyRewardsCreate(CommerceEmptyCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/vip/points/daily_rewards'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPointsDailyRewardsCreateResult.fromJson(map);
    })();
  }

  /// Retrieve VIP daily reward status
  Future<VipPointsDailyRewardsStatusRetrieveResult?> vipPointsDailyRewardsStatusRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/points/daily_rewards/status'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPointsDailyRewardsStatusRetrieveResult.fromJson(map);
    })();
  }

  /// List VIP points history
  Future<VipPointsHistoryListResult?> vipPointsHistoryList([int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/billing/vip/points/history'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPointsHistoryListResult.fromJson(map);
    })();
  }

  /// Create VIP privilege speed up
  Future<VipPrivilegesSpeedUpsCreateResult?> vipPrivilegesSpeedUpsCreate(CommerceVipPrivilegeSpeedUpRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/vip/privileges/speed_ups'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPrivilegesSpeedUpsCreateResult.fromJson(map);
    })();
  }

  /// Retrieve VIP privilege usage
  Future<VipPrivilegesUsageRetrieveResult?> vipPrivilegesUsageRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/privileges/usage'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPrivilegesUsageRetrieveResult.fromJson(map);
    })();
  }

  /// Create VIP purchase
  Future<VipPurchaseCreateResult?> vipPurchaseCreate(CommerceVipPurchaseRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/vip/purchase'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPurchaseCreateResult.fromJson(map);
    })();
  }

  /// Renew VIP purchase
  Future<VipPurchaseRenewResult?> vipPurchaseRenew(CommerceVipPurchaseRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/vip/purchase/renew'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPurchaseRenewResult.fromJson(map);
    })();
  }

  /// Upgrade VIP purchase
  Future<VipPurchaseUpgradeResult?> vipPurchaseUpgrade(CommerceVipPurchaseRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/vip/purchase/upgrade'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipPurchaseUpgradeResult.fromJson(map);
    })();
  }

  /// Retrieve VIP status
  Future<VipStatusRetrieveResult?> vipStatusRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/billing/vip/status'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : VipStatusRetrieveResult.fromJson(map);
    })();
  }

  /// List wallet accounts
  Future<WalletAccountsListResult?> walletAccountsList([String? assetType]) async {
    final query = buildQueryString([
      QueryParameterSpec('asset_type', assetType, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/billing/wallet/accounts'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletAccountsListResult.fromJson(map);
    })();
  }

  /// Create wallet exchange
  Future<WalletExchangesCreateResult?> walletExchangesCreate(CommerceWalletCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/wallet/exchanges'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletExchangesCreateResult.fromJson(map);
    })();
  }

  /// Retrieve wallet operation
  Future<WalletOperationsRetrieveResult?> walletOperationsRetrieve(String requestNo) async {
    final response = await _client.get(ApiPaths.appPath('/billing/wallet/operations/${serializePathParameter(requestNo, const PathParameterSpec('requestNo', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletOperationsRetrieveResult.fromJson(map);
    })();
  }

  /// Retrieve wallet overview
  Future<WalletOverviewRetrieveResult?> walletOverviewRetrieve() async {
    final response = await _client.get(ApiPaths.appPath('/billing/wallet/overview'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletOverviewRetrieveResult.fromJson(map);
    })();
  }

  /// Create wallet topup
  Future<WalletTopupsCreateResult?> walletTopupsCreate(CommerceWalletCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/wallet/topups'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletTopupsCreateResult.fromJson(map);
    })();
  }

  /// List wallet transactions
  Future<WalletTransactionsListResult?> walletTransactionsList([int? page, int? pageSize, String? cursor]) async {
    final query = buildQueryString([
      QueryParameterSpec('page', page, 'form', true, false, null),
      QueryParameterSpec('page_size', pageSize, 'form', true, false, null),
      QueryParameterSpec('cursor', cursor, 'form', true, false, null)
    ]);
    final response = await _client.get(ApiPaths.appendQueryString(ApiPaths.appPath('/billing/wallet/transactions'), query));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletTransactionsListResult.fromJson(map);
    })();
  }

  /// Retrieve wallet transaction
  Future<WalletTransactionsRetrieveResult?> walletTransactionsRetrieve(String transactionId) async {
    final response = await _client.get(ApiPaths.appPath('/billing/wallet/transactions/${serializePathParameter(transactionId, const PathParameterSpec('transactionId', 'simple', false))}'));
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletTransactionsRetrieveResult.fromJson(map);
    })();
  }

  /// Create wallet transfer
  Future<WalletTransfersCreateResult?> walletTransfersCreate(CommerceWalletCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/wallet/transfers'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletTransfersCreateResult.fromJson(map);
    })();
  }

  /// Create wallet withdrawal
  Future<WalletWithdrawalsCreateResult?> walletWithdrawalsCreate(CommerceWalletCommandRequest body, String idempotencyKey, [String? xRequestId]) async {
    final requestHeaders = buildRequestHeaders(
      <String, HeaderParameterSpec>{
        'Idempotency-Key': HeaderParameterSpec(idempotencyKey, 'simple', false, null),
        'X-Request-Id': HeaderParameterSpec(xRequestId, 'simple', false, null),
      },
      <String, HeaderParameterSpec>{},
    );
    final payload = body.toJson();
    final response = await _client.post(ApiPaths.appPath('/billing/wallet/withdrawals'), body: payload, headers: requestHeaders, contentType: 'application/json');
    return (() {
      final map = sdkworkResponseAsMap(response);
      return map == null ? null : WalletWithdrawalsCreateResult.fromJson(map);
    })();
  }
}

class PathParameterSpec {
  final String name;
  final String style;
  final bool explode;

  const PathParameterSpec(this.name, this.style, this.explode);
}

String serializePathParameter(dynamic value, PathParameterSpec spec) {
  if (value == null) return '';
  final style = spec.style.trim().isEmpty ? 'simple' : spec.style;
  if (value is Iterable) {
    return serializePathArray(spec.name, value, style, spec.explode);
  }
  if (value is Map) {
    return serializePathObject(spec.name, value, style, spec.explode);
  }
  return pathPrimitivePrefix(spec.name, style) + Uri.encodeComponent(value.toString());
}

String serializePathArray(String name, Iterable values, String style, bool explode) {
  final serialized = values.where((item) => item != null).map((item) => Uri.encodeComponent(item.toString())).toList();
  if (serialized.isEmpty) return pathPrefix(name, style);
  if (style == 'matrix') {
    if (explode) {
      return serialized.map((item) => ';$name=$item').join();
    }
    return ';$name=${serialized.join(',')}';
  }
  final separator = explode ? '.' : ',';
  return pathPrefix(name, style) + serialized.join(separator);
}

String serializePathObject(String name, Map values, String style, bool explode) {
  final entries = <String>[];
  final exploded = <String>[];
  values.forEach((key, value) {
    if (value == null) return;
    final escapedKey = Uri.encodeComponent(key.toString());
    final escapedValue = Uri.encodeComponent(value.toString());
    if (explode) {
      if (style == 'matrix') {
        exploded.add(';$escapedKey=$escapedValue');
      } else {
        exploded.add('$escapedKey=$escapedValue');
      }
    } else {
      entries.add(escapedKey);
      entries.add(escapedValue);
    }
  });
  if (style == 'matrix') {
    if (explode) return exploded.join();
    return ';$name=${entries.join(',')}';
  }
  if (explode) {
    final separator = style == 'label' ? '.' : ',';
    return pathPrefix(name, style) + exploded.join(separator);
  }
  return pathPrefix(name, style) + entries.join(',');
}

String pathPrefix(String name, String style) {
  if (style == 'label') return '.';
  if (style == 'matrix') return ';$name';
  return '';
}

String pathPrimitivePrefix(String name, String style) {
  return style == 'matrix' ? ';$name=' : pathPrefix(name, style);
}
class QueryParameterSpec {
  final String name;
  final dynamic value;
  final String style;
  final bool explode;
  final bool allowReserved;
  final String? contentType;

  const QueryParameterSpec(
    this.name,
    this.value,
    this.style,
    this.explode,
    this.allowReserved,
    this.contentType,
  );
}

String buildQueryString(List<QueryParameterSpec> parameters) {
  final pairs = <String>[];
  for (final parameter in parameters) {
    appendSerializedParameter(pairs, parameter);
  }
  return pairs.join('&');
}

void appendSerializedParameter(List<String> pairs, QueryParameterSpec parameter) {
  final value = parameter.value;
  if (value == null) return;

  final contentType = parameter.contentType;
  if (contentType != null && contentType.trim().isNotEmpty) {
    pairs.add('${urlEncode(parameter.name)}=${encodeQueryValue(jsonEncode(value), parameter.allowReserved)}');
    return;
  }

  final style = parameter.style.trim().isEmpty ? 'form' : parameter.style;
  if (style == 'deepObject' && value is Map) {
    appendDeepObjectParameter(pairs, parameter.name, value, parameter.allowReserved);
    return;
  }
  if (value is Iterable) {
    appendArrayParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  if (value is Map) {
    appendObjectParameter(pairs, parameter.name, value, style, parameter.explode, parameter.allowReserved);
    return;
  }
  pairs.add('${urlEncode(parameter.name)}=${encodeQueryValue(value.toString(), parameter.allowReserved)}');
}

void appendArrayParameter(
  List<String> pairs,
  String name,
  Iterable values,
  String style,
  bool explode,
  bool allowReserved,
) {
  final serialized = values.where((item) => item != null).map((item) => item.toString()).toList();
  if (serialized.isEmpty) return;
  if (style == 'form' && explode) {
    for (final item in serialized) {
      pairs.add('${urlEncode(name)}=${encodeQueryValue(item, allowReserved)}');
    }
    return;
  }
  pairs.add('${urlEncode(name)}=${encodeQueryValue(serialized.join(','), allowReserved)}');
}

void appendObjectParameter(
  List<String> pairs,
  String name,
  Map values,
  String style,
  bool explode,
  bool allowReserved,
) {
  final serialized = <String>[];
  values.forEach((key, value) {
    if (value == null) return;
    if (style == 'form' && explode) {
      pairs.add('${urlEncode(key.toString())}=${encodeQueryValue(value.toString(), allowReserved)}');
      return;
    }
    serialized.add(key.toString());
    serialized.add(value.toString());
  });
  if (serialized.isNotEmpty) {
    pairs.add('${urlEncode(name)}=${encodeQueryValue(serialized.join(','), allowReserved)}');
  }
}

void appendDeepObjectParameter(List<String> pairs, String name, Map values, bool allowReserved) {
  values.forEach((key, value) {
    if (value != null) {
      pairs.add('${urlEncode('$name[$key]')}=${encodeQueryValue(value.toString(), allowReserved)}');
    }
  });
}

String encodeQueryValue(String value, bool allowReserved) {
  var encoded = urlEncode(value);
  if (!allowReserved) return encoded;
  const replacements = <String, String>{
    '%3A': ':',
    '%2F': '/',
    '%3F': '?',
    '%23': '#',
    '%5B': '[',
    '%5D': ']',
    '%40': '@',
    '%21': '!',
    '%24': r'$',
    '%26': '&',
    '%27': "'",
    '%28': '(',
    '%29': ')',
    '%2A': '*',
    '%2B': '+',
    '%2C': ',',
    '%3B': ';',
    '%3D': '=',
  };
  replacements.forEach((escaped, reserved) {
    encoded = encoded.replaceAll(escaped, reserved);
  });
  return encoded;
}

String urlEncode(String value) => Uri.encodeQueryComponent(value);
class HeaderParameterSpec {
  final dynamic value;
  final String style;
  final bool explode;
  final String? contentType;

  HeaderParameterSpec(this.value, this.style, this.explode, this.contentType);
}

Map<String, String>? buildRequestHeaders(
  Map<String, HeaderParameterSpec> headers, [
  Map<String, HeaderParameterSpec> cookies = const {},
]) {
  final requestHeaders = <String, String>{};

  headers.forEach((name, parameter) {
    final serialized = serializeParameterValue(parameter);
    if (serialized != null) {
      requestHeaders[name] = serialized;
    }
  });

  final cookieHeader = buildCookieHeader(cookies);
  if (cookieHeader != null && cookieHeader.isNotEmpty) {
    requestHeaders['Cookie'] = requestHeaders.containsKey('Cookie')
        ? '${requestHeaders['Cookie']}; $cookieHeader'
        : cookieHeader;
  }

  return requestHeaders.isEmpty ? null : requestHeaders;
}

String? buildCookieHeader(Map<String, HeaderParameterSpec> cookies) {
  final pairs = <String>[];
  cookies.forEach((name, parameter) {
    final serialized = serializeParameterValue(parameter);
    if (serialized != null) {
      pairs.add('${Uri.encodeComponent(name)}=${Uri.encodeComponent(serialized)}');
    }
  });
  return pairs.isEmpty ? null : pairs.join('; ');
}

String? serializeParameterValue(HeaderParameterSpec? parameter) {
  final value = parameter?.value;
  if (value == null) return null;
  if (parameter!.contentType != null && parameter.contentType!.trim().isNotEmpty) {
    return jsonEncode(value);
  }
  if (value is DateTime) return value.toIso8601String();
  if (value is Iterable) {
    return value
        .where((item) => item != null)
        .map((item) => item.toString())
        .whereType<String>()
        .join(',');
  }
  if (value is Map) {
    final serialized = <String>[];
    value.forEach((key, item) {
      if (item == null) return;
      if (parameter.explode) {
        serialized.add('$key=$item');
      } else {
        serialized.add(key.toString());
        serialized.add(item.toString());
      }
    });
    return serialized.join(',');
  }
  return value.toString();
}
