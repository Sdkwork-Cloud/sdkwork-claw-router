package types

// Commerce coupon catalog item schema exposed by Claw Router.
type CommerceCouponCatalogItem struct {
	Id string `json:"id"`
	Name string `json:"name"`
	Status string `json:"status"`
	Type string `json:"type"`
	Value string `json:"value"`
}
