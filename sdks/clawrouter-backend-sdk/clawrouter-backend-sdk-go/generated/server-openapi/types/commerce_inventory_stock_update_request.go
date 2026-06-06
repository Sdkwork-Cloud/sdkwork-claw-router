package types

// Commerce inventory stock update request schema exposed by Claw Router.
type CommerceInventoryStockUpdateRequest struct {
	AvailableQuantity string `json:"availableQuantity"`
	ReasonCode string `json:"reasonCode"`
	ReservedQuantity string `json:"reservedQuantity"`
	Status string `json:"status"`
	Version string `json:"version"`
}
