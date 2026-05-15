package types

// Admin redemption records response schema exposed by Claw Router.
type AdminRedemptionRecordsResponse struct {
	Items []AdminRedemptionRecordItem `json:"items"`
}
