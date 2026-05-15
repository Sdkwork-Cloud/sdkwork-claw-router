package types

// Account summary response schema exposed by Claw Router.
type AccountSummaryResponse struct {
	AvailableCredits float64 `json:"availableCredits"`
	ConsumptionByService []AccountConsumptionItem `json:"consumptionByService"`
	Email string `json:"email"`
	EstDaysRemaining int `json:"estDaysRemaining"`
	Id string `json:"id"`
	InvoiceSettings AccountInvoiceSettings `json:"invoiceSettings"`
	IsVerified bool `json:"isVerified"`
	LoginLogs []AccountLoginLog `json:"loginLogs"`
	MonthlyConsumption float64 `json:"monthlyConsumption"`
	Name string `json:"name"`
	Organization string `json:"organization"`
	Security AccountSecuritySummary `json:"security"`
	Tier string `json:"tier"`
}
