package types

// Coupons catalog retrieve result schema exposed by Claw Router.
type CouponsCatalogRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceCouponCatalogItem `json:"data"`
	Msg string `json:"msg"`
}
