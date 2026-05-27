package types

// Promotions user coupons management list result schema exposed by Claw Router.
type PromotionsUserCouponsManagementListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
