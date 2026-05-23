package types

// Commerce inventory stock update request schema exposed by Claw Router.
type CommerceInventoryStockUpdateRequest struct {
	AvailableQuantity int `json:"availableQuantity"`
	ReasonCode string `json:"reasonCode"`
	ReservedQuantity int `json:"reservedQuantity"`
	Status string `json:"status"`
	Version int `json:"version"`
}
