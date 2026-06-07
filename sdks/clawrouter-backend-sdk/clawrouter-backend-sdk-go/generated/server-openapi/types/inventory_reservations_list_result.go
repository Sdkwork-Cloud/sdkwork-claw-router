package types

// Inventory reservations list result schema exposed by Claw Router.
type InventoryReservationsListResult struct {
	Code string `json:"code"`
	Data CommerceInventoryReservationListResponse `json:"data"`
	Msg string `json:"msg"`
}
