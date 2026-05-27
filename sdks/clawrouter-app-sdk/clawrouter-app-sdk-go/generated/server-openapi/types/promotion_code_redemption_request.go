package types

// Promotion code redemption request schema exposed by Claw Router.
type PromotionCodeRedemptionRequest struct {
	ClientRequestNo string `json:"clientRequestNo"`
	Code string `json:"code"`
	Note string `json:"note"`
	Scene string `json:"scene"`
	Source string `json:"source"`
}
