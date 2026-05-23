package types

// Commerce payment reconciliation run item schema exposed by Claw Router.
type CommercePaymentReconciliationRunItem struct {
	BusinessDate string `json:"businessDate"`
	CreatedAt string `json:"createdAt"`
	FinishedAt string `json:"finishedAt"`
	Id string `json:"id"`
	ProviderCode string `json:"providerCode"`
	RunNo string `json:"runNo"`
	Status string `json:"status"`
}
