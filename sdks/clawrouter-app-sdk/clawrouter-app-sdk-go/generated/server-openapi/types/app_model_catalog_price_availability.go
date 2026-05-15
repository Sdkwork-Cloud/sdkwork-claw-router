package types

// App model catalog price availability schema exposed by Claw Router.
type AppModelCatalogPriceAvailability struct {
	Reason string `json:"reason"`
	Status string `json:"status"`
}
