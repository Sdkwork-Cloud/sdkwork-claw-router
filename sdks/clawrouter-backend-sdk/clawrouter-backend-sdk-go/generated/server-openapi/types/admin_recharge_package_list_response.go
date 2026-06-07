package types

// Admin recharge package list response schema exposed by Claw Router.
type AdminRechargePackageListResponse struct {
	Items []AdminRechargePackageItem `json:"items"`
}
