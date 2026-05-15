package types

// Admin billing record item schema exposed by Claw Router.
type AdminBillingRecordItem struct {
	DueDate string `json:"dueDate"`
	Id string `json:"id"`
	Period string `json:"period"`
	Status string `json:"status"`
	TotalCost string `json:"totalCost"`
	TotalTokens int `json:"totalTokens"`
	UserId string `json:"userId"`
}
