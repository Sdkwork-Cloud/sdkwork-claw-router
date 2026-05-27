package types

// Billing history collection response schema exposed by Claw Router.
type BillingHistoryCollectionResponse struct {
	Items []map[string]interface{} `json:"items"`
}
