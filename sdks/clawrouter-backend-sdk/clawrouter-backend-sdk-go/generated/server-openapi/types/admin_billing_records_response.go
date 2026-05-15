package types

// Admin billing records response schema exposed by Claw Router.
type AdminBillingRecordsResponse struct {
	Items []AdminBillingRecordItem `json:"items"`
}
