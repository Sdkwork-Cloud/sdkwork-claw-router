package types

// Commerce payment route rule list response schema exposed by Claw Router.
type CommercePaymentRouteRuleListResponse struct {
	Items []CommercePaymentRouteRuleItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}
