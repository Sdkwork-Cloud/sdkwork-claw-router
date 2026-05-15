package types

// Admin promo codes response schema exposed by Claw Router.
type AdminPromoCodesResponse struct {
	Items []AdminPromoCodeItem `json:"items"`
}
