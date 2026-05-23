package types

// Commerce inventory reservation list response schema exposed by Claw Router.
type CommerceInventoryReservationListResponse struct {
	Items []CommerceInventoryReservationItem `json:"items"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
