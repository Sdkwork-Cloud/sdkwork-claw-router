package types

// Commerce inventory reservation list response schema exposed by Claw Router.
type CommerceInventoryReservationListResponse struct {
	Items []CommerceInventoryReservationItem `json:"items"`
	Page string `json:"page"`
	PageSize string `json:"pageSize"`
	Total string `json:"total"`
}
