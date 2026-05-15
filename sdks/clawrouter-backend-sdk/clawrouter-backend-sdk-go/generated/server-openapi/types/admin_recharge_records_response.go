package types

// Admin recharge records response schema exposed by Claw Router.
type AdminRechargeRecordsResponse struct {
	Items []AdminRechargeRecordItem `json:"items"`
}
