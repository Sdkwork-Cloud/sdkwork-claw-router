package types

// Admin promo code item schema exposed by Claw Router.
type AdminPromoCodeItem struct {
	BatchId string `json:"batchId"`
	Code string `json:"code"`
	Id string `json:"id"`
	Status string `json:"status"`
	UsedAt string `json:"usedAt"`
	UsedBy string `json:"usedBy"`
}
