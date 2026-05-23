package types

// Coupons catalog list result schema exposed by Claw Router.
type CouponsCatalogListResult struct {
	Code string `json:"code"`
	Data CommerceCouponCatalogResponse `json:"data"`
	Msg string `json:"msg"`
}
