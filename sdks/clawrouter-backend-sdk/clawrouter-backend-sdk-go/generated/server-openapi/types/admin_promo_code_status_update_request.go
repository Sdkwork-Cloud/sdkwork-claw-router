package types

// Admin promo code status update request schema exposed by Claw Router.
type AdminPromoCodeStatusUpdateRequest struct {
	Status string `json:"status"`
}
