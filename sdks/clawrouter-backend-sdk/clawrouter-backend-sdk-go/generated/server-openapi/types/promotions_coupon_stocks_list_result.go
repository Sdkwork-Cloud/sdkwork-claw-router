package types

// Promotions coupon stocks list result schema exposed by Claw Router.
type PromotionsCouponStocksListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
