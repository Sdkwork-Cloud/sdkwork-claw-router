package types

// App model catalog reference price schema exposed by Claw Router.
type AppModelCatalogReferencePrice struct {
	BillingMeter string `json:"billingMeter"`
	Currency string `json:"currency"`
	UnitPrice string `json:"unitPrice"`
}
