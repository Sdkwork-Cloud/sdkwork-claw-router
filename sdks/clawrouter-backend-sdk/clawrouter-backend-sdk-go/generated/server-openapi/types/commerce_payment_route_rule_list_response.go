package types

// Commerce payment route rule list response schema exposed by Claw Router.
type CommercePaymentRouteRuleListResponse struct {
	Items []CommercePaymentRouteRuleItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
