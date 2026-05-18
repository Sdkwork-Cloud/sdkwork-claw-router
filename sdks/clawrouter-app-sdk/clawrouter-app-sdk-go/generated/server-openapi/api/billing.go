package api

import (
    "encoding/json"
    "fmt"
    "net/url"
    "strings"
    sdktypes "github.com/sdkwork/clawrouter-app-sdk/types"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type BillingApi struct {
    client *sdkhttp.Client
}

func NewBillingApi(client *sdkhttp.Client) *BillingApi {
    return &BillingApi{client: client}
}

// Retrieve account points
func (a *BillingApi) AccountPointsRetrieve() (sdktypes.AccountPointsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/account/points"), nil, nil)
    if err != nil {
        var zero sdktypes.AccountPointsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsRetrieveResult](raw)
}

// Retrieve account points exchange rate
func (a *BillingApi) AccountPointsExchangeRateRetrieve() (sdktypes.AccountPointsExchangeRateRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/account/points/exchange_rate"), nil, nil)
    if err != nil {
        var zero sdktypes.AccountPointsExchangeRateRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsExchangeRateRetrieveResult](raw)
}

// Create account points exchange
func (a *BillingApi) AccountPointsExchangesCreate(body sdktypes.CommerceWalletCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.AccountPointsExchangesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/account/points/exchanges"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.AccountPointsExchangesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsExchangesCreateResult](raw)
}

// List account points exchange rules
func (a *BillingApi) AccountPointsExchangesRulesList(sourceAssetType *string, targetAssetType *string) (sdktypes.AccountPointsExchangesRulesListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "source_asset_type", Value: func() interface{} { if sourceAssetType == nil { return nil }; return *sourceAssetType }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "target_asset_type", Value: func() interface{} { if targetAssetType == nil { return nil }; return *targetAssetType }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/billing/account/points/exchanges/rules"), query), nil, nil)
    if err != nil {
        var zero sdktypes.AccountPointsExchangesRulesListResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsExchangesRulesListResult](raw)
}

// Retrieve account points exchange
func (a *BillingApi) AccountPointsExchangesRetrieve(exchangeNo string) (sdktypes.AccountPointsExchangesRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/account/points/exchanges/%s", SerializePathParameter(exchangeNo, PathParameterSpec{Name: "exchangeNo", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AccountPointsExchangesRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsExchangesRetrieveResult](raw)
}

// List account points history
func (a *BillingApi) AccountPointsHistoryList(page *int, pageSize *int, cursor *string) (sdktypes.AccountPointsHistoryListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/billing/account/points/history"), query), nil, nil)
    if err != nil {
        var zero sdktypes.AccountPointsHistoryListResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsHistoryListResult](raw)
}

// Create recharge
func (a *BillingApi) AccountPointsRechargesCreate(body sdktypes.SubmitRechargeRequest, idempotencyKey string, xRequestId *string) (sdktypes.AccountPointsRechargesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/account/points/recharges"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.AccountPointsRechargesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsRechargesCreateResult](raw)
}

// Retrieve account points recharge order
func (a *BillingApi) AccountPointsRechargesOrdersRetrieve(orderNo string) (sdktypes.AccountPointsRechargesOrdersRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/account/points/recharges/orders/%s", SerializePathParameter(orderNo, PathParameterSpec{Name: "orderNo", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.AccountPointsRechargesOrdersRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsRechargesOrdersRetrieveResult](raw)
}

// Cancel account points recharge order
func (a *BillingApi) AccountPointsRechargesOrdersCancel(orderNo string, body sdktypes.CommerceRechargeOrderCancelRequest, idempotencyKey string, xRequestId *string) (sdktypes.AccountPointsRechargesOrdersCancelResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath(fmt.Sprintf("/billing/account/points/recharges/orders/%s/cancel", SerializePathParameter(orderNo, PathParameterSpec{Name: "orderNo", Style: "simple", Explode: false}))), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.AccountPointsRechargesOrdersCancelResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsRechargesOrdersCancelResult](raw)
}

// List packages
func (a *BillingApi) AccountPointsRechargesPackagesList() (sdktypes.AccountPointsRechargesPackagesListResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/account/points/recharges/packages"), nil, nil)
    if err != nil {
        var zero sdktypes.AccountPointsRechargesPackagesListResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsRechargesPackagesListResult](raw)
}

// List account points recharge records
func (a *BillingApi) AccountPointsRechargesRecordsList(page *int, pageSize *int, cursor *string) (sdktypes.AccountPointsRechargesRecordsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/billing/account/points/recharges/records"), query), nil, nil)
    if err != nil {
        var zero sdktypes.AccountPointsRechargesRecordsListResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsRechargesRecordsListResult](raw)
}

// Create account points transfer
func (a *BillingApi) AccountPointsTransfersCreate(body sdktypes.CommerceWalletCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.AccountPointsTransfersCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/account/points/transfers"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.AccountPointsTransfersCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountPointsTransfersCreateResult](raw)
}

// List account details
func (a *BillingApi) AccountSummaryRetrieve() (sdktypes.AccountSummaryRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/account/summary"), nil, nil)
    if err != nil {
        var zero sdktypes.AccountSummaryRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountSummaryRetrieveResult](raw)
}

// Retrieve account tokens
func (a *BillingApi) AccountTokensRetrieve() (sdktypes.AccountTokensRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/account/tokens"), nil, nil)
    if err != nil {
        var zero sdktypes.AccountTokensRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountTokensRetrieveResult](raw)
}

// Create account token deduction
func (a *BillingApi) AccountTokensDeductionsCreate(body sdktypes.CommerceWalletCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.AccountTokensDeductionsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/account/tokens/deductions"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.AccountTokensDeductionsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.AccountTokensDeductionsCreateResult](raw)
}

// List coupon catalog
func (a *BillingApi) CouponsCatalogList(status *string, page *int, pageSize *int, cursor *string) (sdktypes.CouponsCatalogListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "status", Value: func() interface{} { if status == nil { return nil }; return *status }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/billing/coupons/catalog"), query), nil, nil)
    if err != nil {
        var zero sdktypes.CouponsCatalogListResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponsCatalogListResult](raw)
}

// Retrieve coupon catalog item
func (a *BillingApi) CouponsCatalogRetrieve(couponId string) (sdktypes.CouponsCatalogRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/coupons/catalog/%s", SerializePathParameter(couponId, PathParameterSpec{Name: "couponId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.CouponsCatalogRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponsCatalogRetrieveResult](raw)
}

// Create coupon claim
func (a *BillingApi) CouponsClaimsCreate(body sdktypes.CommerceCouponClaimRequest, idempotencyKey string, xRequestId *string) (sdktypes.CouponsClaimsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/coupons/claims"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CouponsClaimsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponsClaimsCreateResult](raw)
}

// Redeem code
func (a *BillingApi) CouponsRedeemCreate(body sdktypes.RedeemCodeRequest, idempotencyKey string, xRequestId *string) (sdktypes.CouponsRedeemCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/coupons/redeem"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CouponsRedeemCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponsRedeemCreateResult](raw)
}

// Create coupon usage
func (a *BillingApi) CouponsUsageCreate(body sdktypes.CommerceCouponUsageRequest, idempotencyKey string, xRequestId *string) (sdktypes.CouponsUsageCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/coupons/usage"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CouponsUsageCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponsUsageCreateResult](raw)
}

// Create coupon usage reversal
func (a *BillingApi) CouponsUsageReversalsCreate(body sdktypes.CommerceCouponUsageRollbackRequest, idempotencyKey string, xRequestId *string) (sdktypes.CouponsUsageReversalsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/coupons/usage_reversals"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.CouponsUsageReversalsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.CouponsUsageReversalsCreateResult](raw)
}

// List checkout status
func (a *BillingApi) PaymentsCheckoutRetrieve(orderNo string) (sdktypes.PaymentsCheckoutRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/payments/checkout/%s", SerializePathParameter(orderNo, PathParameterSpec{Name: "orderNo", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsCheckoutRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsCheckoutRetrieveResult](raw)
}

// List recharge history
func (a *BillingApi) PaymentsRecordsList() (sdktypes.PaymentsRecordsListResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/payments/records"), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsRecordsListResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsRecordsListResult](raw)
}

// Retrieve payment record
func (a *BillingApi) PaymentsRecordsRetrieve(paymentId string) (sdktypes.PaymentsRecordsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/payments/records/%s", SerializePathParameter(paymentId, PathParameterSpec{Name: "paymentId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.PaymentsRecordsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.PaymentsRecordsRetrieveResult](raw)
}

// Create preflight estimate
func (a *BillingApi) PreflightEstimatesCreate(body sdktypes.CommercePreflightRequest) (sdktypes.PreflightEstimatesCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/billing/preflight/estimates"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.PreflightEstimatesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.PreflightEstimatesCreateResult](raw)
}

// Create preflight precheck
func (a *BillingApi) PreflightPrechecksCreate(body sdktypes.CommercePreflightRequest) (sdktypes.PreflightPrechecksCreateResult, error) {
    raw, err := a.client.Post(AppApiPath("/billing/preflight/prechecks"), body, nil, nil, "application/json")
    if err != nil {
        var zero sdktypes.PreflightPrechecksCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.PreflightPrechecksCreateResult](raw)
}

// Create preflight prehold
func (a *BillingApi) PreflightPreholdsCreate(body sdktypes.CommercePreflightRequest, idempotencyKey string, xRequestId *string) (sdktypes.PreflightPreholdsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/preflight/preholds"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.PreflightPreholdsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.PreflightPreholdsCreateResult](raw)
}

// Create preflight release
func (a *BillingApi) PreflightReleasesCreate(body sdktypes.CommercePreflightRequest, idempotencyKey string, xRequestId *string) (sdktypes.PreflightReleasesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/preflight/releases"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.PreflightReleasesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.PreflightReleasesCreateResult](raw)
}

// Create preflight settlement
func (a *BillingApi) PreflightSettlementsCreate(body sdktypes.CommercePreflightRequest, idempotencyKey string, xRequestId *string) (sdktypes.PreflightSettlementsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/preflight/settlements"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.PreflightSettlementsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.PreflightSettlementsCreateResult](raw)
}

// List dashboard data
func (a *BillingApi) SettlementsDashboardList(year *int) (sdktypes.SettlementsDashboardListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "year", Value: func() interface{} { if year == nil { return nil }; return *year }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/billing/settlements/dashboard"), query), nil, nil)
    if err != nil {
        var zero sdktypes.SettlementsDashboardListResult
        return zero, err
    }
    return decodeResult[sdktypes.SettlementsDashboardListResult](raw)
}

// List redeem history
func (a *BillingApi) UsersCurrentCouponsList() (sdktypes.UsersCurrentCouponsListResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/users/current/coupons"), nil, nil)
    if err != nil {
        var zero sdktypes.UsersCurrentCouponsListResult
        return zero, err
    }
    return decodeResult[sdktypes.UsersCurrentCouponsListResult](raw)
}

// Retrieve current user coupon
func (a *BillingApi) UsersCurrentCouponsRetrieve(userCouponId string) (sdktypes.UsersCurrentCouponsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/users/current/coupons/%s", SerializePathParameter(userCouponId, PathParameterSpec{Name: "userCouponId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.UsersCurrentCouponsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.UsersCurrentCouponsRetrieveResult](raw)
}

// List VIP benefits
func (a *BillingApi) VipBenefitsList() (sdktypes.VipBenefitsListResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/vip/benefits"), nil, nil)
    if err != nil {
        var zero sdktypes.VipBenefitsListResult
        return zero, err
    }
    return decodeResult[sdktypes.VipBenefitsListResult](raw)
}

// Retrieve VIP info
func (a *BillingApi) VipInfoRetrieve() (sdktypes.VipInfoRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/vip/info"), nil, nil)
    if err != nil {
        var zero sdktypes.VipInfoRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.VipInfoRetrieveResult](raw)
}

// List VIP levels
func (a *BillingApi) VipLevelsList() (sdktypes.VipLevelsListResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/vip/levels"), nil, nil)
    if err != nil {
        var zero sdktypes.VipLevelsListResult
        return zero, err
    }
    return decodeResult[sdktypes.VipLevelsListResult](raw)
}

// List VIP pack groups
func (a *BillingApi) GetVipPackGroupsList() (sdktypes.VipPackGroupsListResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/vip/pack_groups"), nil, nil)
    if err != nil {
        var zero sdktypes.VipPackGroupsListResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPackGroupsListResult](raw)
}

// Retrieve VIP pack group
func (a *BillingApi) VipPackGroupsRetrieve(packGroupId string) (sdktypes.VipPackGroupsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/vip/pack_groups/%s", SerializePathParameter(packGroupId, PathParameterSpec{Name: "packGroupId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.VipPackGroupsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPackGroupsRetrieveResult](raw)
}

// List VIP pack group packs
func (a *BillingApi) GetVipPackGroupsListPackGroups(packGroupId string) (sdktypes.VipPackGroupsPacksListResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/vip/pack_groups/%s/packs", SerializePathParameter(packGroupId, PathParameterSpec{Name: "packGroupId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.VipPackGroupsPacksListResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPackGroupsPacksListResult](raw)
}

// List VIP packs
func (a *BillingApi) VipPacksList() (sdktypes.VipPacksListResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/vip/packs"), nil, nil)
    if err != nil {
        var zero sdktypes.VipPacksListResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPacksListResult](raw)
}

// Retrieve VIP pack
func (a *BillingApi) VipPacksRetrieve(packId string) (sdktypes.VipPacksRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/vip/packs/%s", SerializePathParameter(packId, PathParameterSpec{Name: "packId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.VipPacksRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPacksRetrieveResult](raw)
}

// Retrieve VIP points balance
func (a *BillingApi) VipPointsBalanceRetrieve() (sdktypes.VipPointsBalanceRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/vip/points/balance"), nil, nil)
    if err != nil {
        var zero sdktypes.VipPointsBalanceRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPointsBalanceRetrieveResult](raw)
}

// Create VIP daily reward
func (a *BillingApi) VipPointsDailyRewardsCreate(body sdktypes.CommerceEmptyCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.VipPointsDailyRewardsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/vip/points/daily_rewards"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.VipPointsDailyRewardsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPointsDailyRewardsCreateResult](raw)
}

// Retrieve VIP daily reward status
func (a *BillingApi) VipPointsDailyRewardsStatusRetrieve() (sdktypes.VipPointsDailyRewardsStatusRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/vip/points/daily_rewards/status"), nil, nil)
    if err != nil {
        var zero sdktypes.VipPointsDailyRewardsStatusRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPointsDailyRewardsStatusRetrieveResult](raw)
}

// List VIP points history
func (a *BillingApi) VipPointsHistoryList(page *int, pageSize *int, cursor *string) (sdktypes.VipPointsHistoryListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/billing/vip/points/history"), query), nil, nil)
    if err != nil {
        var zero sdktypes.VipPointsHistoryListResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPointsHistoryListResult](raw)
}

// Create VIP privilege speed up
func (a *BillingApi) VipPrivilegesSpeedUpsCreate(body sdktypes.CommerceVipPrivilegeSpeedUpRequest, idempotencyKey string, xRequestId *string) (sdktypes.VipPrivilegesSpeedUpsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/vip/privileges/speed_ups"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.VipPrivilegesSpeedUpsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPrivilegesSpeedUpsCreateResult](raw)
}

// Retrieve VIP privilege usage
func (a *BillingApi) VipPrivilegesUsageRetrieve() (sdktypes.VipPrivilegesUsageRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/vip/privileges/usage"), nil, nil)
    if err != nil {
        var zero sdktypes.VipPrivilegesUsageRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPrivilegesUsageRetrieveResult](raw)
}

// Create VIP purchase
func (a *BillingApi) VipPurchaseCreate(body sdktypes.CommerceVipPurchaseRequest, idempotencyKey string, xRequestId *string) (sdktypes.VipPurchaseCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/vip/purchase"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.VipPurchaseCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPurchaseCreateResult](raw)
}

// Renew VIP purchase
func (a *BillingApi) VipPurchaseRenew(body sdktypes.CommerceVipPurchaseRequest, idempotencyKey string, xRequestId *string) (sdktypes.VipPurchaseRenewResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/vip/purchase/renew"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.VipPurchaseRenewResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPurchaseRenewResult](raw)
}

// Upgrade VIP purchase
func (a *BillingApi) VipPurchaseUpgrade(body sdktypes.CommerceVipPurchaseRequest, idempotencyKey string, xRequestId *string) (sdktypes.VipPurchaseUpgradeResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/vip/purchase/upgrade"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.VipPurchaseUpgradeResult
        return zero, err
    }
    return decodeResult[sdktypes.VipPurchaseUpgradeResult](raw)
}

// Retrieve VIP status
func (a *BillingApi) VipStatusRetrieve() (sdktypes.VipStatusRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/vip/status"), nil, nil)
    if err != nil {
        var zero sdktypes.VipStatusRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.VipStatusRetrieveResult](raw)
}

// List wallet accounts
func (a *BillingApi) WalletAccountsList(assetType *string) (sdktypes.WalletAccountsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "asset_type", Value: func() interface{} { if assetType == nil { return nil }; return *assetType }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/billing/wallet/accounts"), query), nil, nil)
    if err != nil {
        var zero sdktypes.WalletAccountsListResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletAccountsListResult](raw)
}

// Create wallet exchange
func (a *BillingApi) WalletExchangesCreate(body sdktypes.CommerceWalletCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.WalletExchangesCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/wallet/exchanges"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.WalletExchangesCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletExchangesCreateResult](raw)
}

// Retrieve wallet operation
func (a *BillingApi) WalletOperationsRetrieve(requestNo string) (sdktypes.WalletOperationsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/wallet/operations/%s", SerializePathParameter(requestNo, PathParameterSpec{Name: "requestNo", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.WalletOperationsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletOperationsRetrieveResult](raw)
}

// Retrieve wallet overview
func (a *BillingApi) WalletOverviewRetrieve() (sdktypes.WalletOverviewRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath("/billing/wallet/overview"), nil, nil)
    if err != nil {
        var zero sdktypes.WalletOverviewRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletOverviewRetrieveResult](raw)
}

// Create wallet topup
func (a *BillingApi) WalletTopupsCreate(body sdktypes.CommerceWalletCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.WalletTopupsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/wallet/topups"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.WalletTopupsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletTopupsCreateResult](raw)
}

// List wallet transactions
func (a *BillingApi) WalletTransactionsList(page *int, pageSize *int, cursor *string) (sdktypes.WalletTransactionsListResult, error) {
    query := BuildQueryString([]QueryParameterSpec{
        {Name: "page", Value: func() interface{} { if page == nil { return nil }; return *page }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "page_size", Value: func() interface{} { if pageSize == nil { return nil }; return *pageSize }(), Style: "form", Explode: true, AllowReserved: false},
        {Name: "cursor", Value: func() interface{} { if cursor == nil { return nil }; return *cursor }(), Style: "form", Explode: true, AllowReserved: false},
    })
    raw, err := a.client.Get(AppendQueryString(AppApiPath("/billing/wallet/transactions"), query), nil, nil)
    if err != nil {
        var zero sdktypes.WalletTransactionsListResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletTransactionsListResult](raw)
}

// Retrieve wallet transaction
func (a *BillingApi) WalletTransactionsRetrieve(transactionId string) (sdktypes.WalletTransactionsRetrieveResult, error) {
    raw, err := a.client.Get(AppApiPath(fmt.Sprintf("/billing/wallet/transactions/%s", SerializePathParameter(transactionId, PathParameterSpec{Name: "transactionId", Style: "simple", Explode: false}))), nil, nil)
    if err != nil {
        var zero sdktypes.WalletTransactionsRetrieveResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletTransactionsRetrieveResult](raw)
}

// Create wallet transfer
func (a *BillingApi) WalletTransfersCreate(body sdktypes.CommerceWalletCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.WalletTransfersCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/wallet/transfers"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.WalletTransfersCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletTransfersCreateResult](raw)
}

// Create wallet withdrawal
func (a *BillingApi) WalletWithdrawalsCreate(body sdktypes.CommerceWalletCommandRequest, idempotencyKey string, xRequestId *string) (sdktypes.WalletWithdrawalsCreateResult, error) {
    headers := BuildRequestHeaders(
        map[string]ParameterSpec{
            "Idempotency-Key": ParameterSpec{Value: idempotencyKey, Style: "simple", Explode: false},
            "X-Request-Id": ParameterSpec{Value: func() interface{} { if xRequestId == nil { return nil }; return *xRequestId }(), Style: "simple", Explode: false},
        },
        map[string]ParameterSpec{},
    )
    raw, err := a.client.Post(AppApiPath("/billing/wallet/withdrawals"), body, nil, headers, "application/json")
    if err != nil {
        var zero sdktypes.WalletWithdrawalsCreateResult
        return zero, err
    }
    return decodeResult[sdktypes.WalletWithdrawalsCreateResult](raw)
}

type PathParameterSpec struct {
    Name    string
    Style   string
    Explode bool
}

func SerializePathParameter(value interface{}, spec PathParameterSpec) string {
    if value == nil {
        return ""
    }
    style := spec.Style
    if style == "" {
        style = "simple"
    }

    switch typed := value.(type) {
    case []string:
        return SerializePathArray(spec.Name, stringSliceToInterface(typed), style, spec.Explode)
    case []int:
        return SerializePathArray(spec.Name, intSliceToInterface(typed), style, spec.Explode)
    case []interface{}:
        return SerializePathArray(spec.Name, typed, style, spec.Explode)
    case map[string]string:
        return SerializePathObject(spec.Name, stringMapToInterface(typed), style, spec.Explode)
    case map[string]int:
        return SerializePathObject(spec.Name, intMapToInterface(typed), style, spec.Explode)
    case map[string]interface{}:
        return SerializePathObject(spec.Name, typed, style, spec.Explode)
    default:
        return PathPrefix(spec.Name, style) + url.PathEscape(fmt.Sprint(value))
    }
}

func SerializePathArray(name string, values []interface{}, style string, explode bool) string {
    serialized := make([]string, 0, len(values))
    for _, item := range values {
        if item != nil {
            serialized = append(serialized, url.PathEscape(fmt.Sprint(item)))
        }
    }
    if len(serialized) == 0 {
        return PathPrefix(name, style)
    }
    if style == "matrix" {
        if explode {
            parts := make([]string, 0, len(serialized))
            for _, item := range serialized {
                parts = append(parts, ";"+name+"="+item)
            }
            return strings.Join(parts, "")
        }
        return ";" + name + "=" + strings.Join(serialized, ",")
    }
    separator := ","
    if explode {
        separator = "."
    }
    return PathPrefix(name, style) + strings.Join(serialized, separator)
}

func SerializePathObject(name string, values map[string]interface{}, style string, explode bool) string {
    entries := make([]string, 0, len(values)*2)
    exploded := make([]string, 0, len(values))
    for key, value := range values {
        if value == nil {
            continue
        }
        escapedKey := url.PathEscape(key)
        escapedValue := url.PathEscape(fmt.Sprint(value))
        if explode {
            if style == "matrix" {
                exploded = append(exploded, ";"+escapedKey+"="+escapedValue)
            } else {
                exploded = append(exploded, escapedKey+"="+escapedValue)
            }
        } else {
            entries = append(entries, escapedKey, escapedValue)
        }
    }
    if style == "matrix" {
        if explode {
            return strings.Join(exploded, "")
        }
        return ";" + name + "=" + strings.Join(entries, ",")
    }
    if explode {
        separator := ","
        if style == "label" {
            separator = "."
        }
        return PathPrefix(name, style) + strings.Join(exploded, separator)
    }
    return PathPrefix(name, style) + strings.Join(entries, ",")
}

func PathPrefix(name string, style string) string {
    if style == "label" {
        return "."
    }
    if style == "matrix" {
        return ";" + name
    }
    return ""
}
type QueryParameterSpec struct {
    Name          string
    Value         interface{}
    Style         string
    Explode       bool
    AllowReserved bool
    ContentType   string
}

func BuildQueryString(parameters []QueryParameterSpec) string {
    pairs := make([]string, 0)
    for _, parameter := range parameters {
        AppendSerializedParameter(&pairs, parameter)
    }
    return strings.Join(pairs, "&")
}

func AppendSerializedParameter(pairs *[]string, parameter QueryParameterSpec) {
    if parameter.Value == nil {
        return
    }

    if parameter.ContentType != "" {
        encoded, _ := json.Marshal(parameter.Value)
        *pairs = append(*pairs, url.QueryEscape(parameter.Name)+"="+EncodeQueryValue(string(encoded), parameter.AllowReserved))
        return
    }

    style := parameter.Style
    if style == "" {
        style = "form"
    }

    switch value := parameter.Value.(type) {
    case []string:
        AppendArrayParameter(pairs, parameter.Name, stringSliceToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case []int:
        AppendArrayParameter(pairs, parameter.Name, intSliceToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case []interface{}:
        AppendArrayParameter(pairs, parameter.Name, value, style, parameter.Explode, parameter.AllowReserved)
    case map[string]int:
        AppendObjectParameter(pairs, parameter.Name, intMapToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case map[string]string:
        AppendObjectParameter(pairs, parameter.Name, stringMapToInterface(value), style, parameter.Explode, parameter.AllowReserved)
    case map[string]interface{}:
        if style == "deepObject" {
            AppendDeepObjectParameter(pairs, parameter.Name, value, parameter.AllowReserved)
        } else {
            AppendObjectParameter(pairs, parameter.Name, value, style, parameter.Explode, parameter.AllowReserved)
        }
    default:
        *pairs = append(*pairs, url.QueryEscape(parameter.Name)+"="+EncodeQueryValue(fmt.Sprint(value), parameter.AllowReserved))
    }
}

func AppendArrayParameter(pairs *[]string, name string, value []interface{}, style string, explode bool, allowReserved bool) {
    values := make([]string, 0, len(value))
    for _, item := range value {
        if item != nil {
            values = append(values, fmt.Sprint(item))
        }
    }
    if len(values) == 0 {
        return
    }
    if style == "form" && explode {
        for _, item := range values {
            *pairs = append(*pairs, url.QueryEscape(name)+"="+EncodeQueryValue(item, allowReserved))
        }
        return
    }
    *pairs = append(*pairs, url.QueryEscape(name)+"="+EncodeQueryValue(strings.Join(values, ","), allowReserved))
}

func AppendObjectParameter(pairs *[]string, name string, value map[string]interface{}, style string, explode bool, allowReserved bool) {
    entries := make([]string, 0, len(value)*2)
    for key, item := range value {
        if item == nil {
            continue
        }
        if style == "form" && explode {
            *pairs = append(*pairs, url.QueryEscape(key)+"="+EncodeQueryValue(fmt.Sprint(item), allowReserved))
            continue
        }
        entries = append(entries, key, fmt.Sprint(item))
    }
    if len(entries) == 0 {
        return
    }
    if !(style == "form" && explode) {
        *pairs = append(*pairs, url.QueryEscape(name)+"="+EncodeQueryValue(strings.Join(entries, ","), allowReserved))
    }
}

func AppendDeepObjectParameter(pairs *[]string, name string, value map[string]interface{}, allowReserved bool) {
    for key, item := range value {
        if item == nil {
            continue
        }
        *pairs = append(*pairs, url.QueryEscape(fmt.Sprintf("%s[%s]", name, key))+"="+EncodeQueryValue(fmt.Sprint(item), allowReserved))
    }
}

func EncodeQueryValue(value string, allowReserved bool) string {
    encoded := url.QueryEscape(value)
    if !allowReserved {
        return encoded
    }
    replacements := map[string]string{
        "%3A": ":", "%2F": "/", "%3F": "?", "%23": "#",
        "%5B": "[", "%5D": "]", "%40": "@", "%21": "!",
        "%24": "$", "%26": "&", "%27": "'", "%28": "(",
        "%29": ")", "%2A": "*", "%2B": "+", "%2C": ",",
        "%3B": ";", "%3D": "=",
    }
    for escaped, reserved := range replacements {
        encoded = strings.ReplaceAll(encoded, escaped, reserved)
    }
    return encoded
}


type ParameterSpec struct {
    Value       interface{}
    Style       string
    Explode     bool
    ContentType string
}

func BuildRequestHeaders(headers map[string]ParameterSpec, cookies map[string]ParameterSpec) map[string]string {
    requestHeaders := map[string]string{}
    for name, parameter := range headers {
        if serialized, ok := SerializeParameterValue(parameter); ok {
            requestHeaders[name] = serialized
        }
    }

    if cookieHeader := BuildCookieHeader(cookies); cookieHeader != "" {
        if existing, ok := requestHeaders["Cookie"]; ok && existing != "" {
            requestHeaders["Cookie"] = existing + "; " + cookieHeader
        } else {
            requestHeaders["Cookie"] = cookieHeader
        }
    }

    if len(requestHeaders) == 0 {
        return nil
    }
    return requestHeaders
}

func BuildCookieHeader(cookies map[string]ParameterSpec) string {
    pairs := make([]string, 0, len(cookies))
    for name, parameter := range cookies {
        if serialized, ok := SerializeParameterValue(parameter); ok {
            pairs = append(pairs, url.QueryEscape(name)+"="+url.QueryEscape(serialized))
        }
    }
    return strings.Join(pairs, "; ")
}

func SerializeParameterValue(parameter ParameterSpec) (string, bool) {
    value := parameter.Value
    if value == nil {
        return "", false
    }
    if parameter.ContentType != "" {
        encoded, _ := json.Marshal(value)
        return string(encoded), true
    }
    switch typed := value.(type) {
    case string:
        return typed, true
    case fmt.Stringer:
        return typed.String(), true
    case []string:
        return strings.Join(typed, ","), true
    case []int:
        values := make([]string, 0, len(typed))
        for _, item := range typed {
            values = append(values, fmt.Sprint(item))
        }
        return strings.Join(values, ","), true
    case map[string]string:
        return SerializeHeaderObject(stringMapToInterface(typed), parameter.Explode), true
    case map[string]int:
        return SerializeHeaderObject(intMapToInterface(typed), parameter.Explode), true
    case map[string]interface{}:
        return SerializeHeaderObject(typed, parameter.Explode), true
    default:
        return fmt.Sprint(value), true
    }
}

func SerializeHeaderObject(values map[string]interface{}, explode bool) string {
    serialized := make([]string, 0, len(values)*2)
    for key, value := range values {
        if value == nil {
            continue
        }
        if explode {
            serialized = append(serialized, key+"="+fmt.Sprint(value))
        } else {
            serialized = append(serialized, key, fmt.Sprint(value))
        }
    }
    return strings.Join(serialized, ",")
}
func stringSliceToInterface(values []string) []interface{} {
    result := make([]interface{}, 0, len(values))
    for _, value := range values {
        result = append(result, value)
    }
    return result
}

func intSliceToInterface(values []int) []interface{} {
    result := make([]interface{}, 0, len(values))
    for _, value := range values {
        result = append(result, value)
    }
    return result
}

func stringMapToInterface(values map[string]string) map[string]interface{} {
    result := make(map[string]interface{}, len(values))
    for key, value := range values {
        result[key] = value
    }
    return result
}

func intMapToInterface(values map[string]int) map[string]interface{} {
    result := make(map[string]interface{}, len(values))
    for key, value := range values {
        result[key] = value
    }
    return result
}
