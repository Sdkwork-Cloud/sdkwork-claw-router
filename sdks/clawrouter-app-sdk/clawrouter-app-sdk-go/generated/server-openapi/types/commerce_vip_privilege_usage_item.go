package types

// Commerce vip privilege usage item schema exposed by Claw Router.
type CommerceVipPrivilegeUsageItem struct {
	PeriodKey string `json:"periodKey"`
	PrivilegeCode string `json:"privilegeCode"`
	QuotaCount int `json:"quotaCount"`
	UsedCount int `json:"usedCount"`
}
