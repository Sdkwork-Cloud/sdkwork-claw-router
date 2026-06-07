package types

// Commerce inventory reservation item schema exposed by Claw Router.
type CommerceInventoryReservationItem struct {
	CheckoutSessionId string `json:"checkoutSessionId"`
	CreatedAt string `json:"createdAt"`
	ExpiresAt string `json:"expiresAt"`
	Id string `json:"id"`
	OrderId string `json:"orderId"`
	Quantity string `json:"quantity"`
	ReservationNo string `json:"reservationNo"`
	SkuId string `json:"skuId"`
	Status string `json:"status"`
}
