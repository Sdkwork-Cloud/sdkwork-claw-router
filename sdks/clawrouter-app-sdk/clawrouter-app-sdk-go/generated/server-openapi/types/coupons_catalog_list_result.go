package types

// Coupons catalog list result schema exposed by Claw Router.
type CouponsCatalogListResult struct {
	Code string `json:"code"`
	Data CommerceCouponCatalogResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
