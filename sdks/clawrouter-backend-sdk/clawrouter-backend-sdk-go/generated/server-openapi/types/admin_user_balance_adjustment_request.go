package types

// Admin user balance adjustment request schema exposed by Claw Router.
type AdminUserBalanceAdjustmentRequest struct {
	Amount float64 `json:"amount"`
	Type string `json:"type"`
}
