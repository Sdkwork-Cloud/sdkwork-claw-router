package types

// Promotions coupon ledger entries list result schema exposed by Claw Router.
type PromotionsCouponLedgerEntriesListResult struct {
	Code string `json:"code"`
	Data PromotionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
