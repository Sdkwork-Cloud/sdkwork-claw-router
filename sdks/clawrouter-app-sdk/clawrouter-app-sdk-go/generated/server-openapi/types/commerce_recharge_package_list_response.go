package types

// Commerce recharge package list response schema exposed by Claw Router.
type CommerceRechargePackageListResponse struct {
	Items []CommerceRechargePackageItem `json:"items"`
}
