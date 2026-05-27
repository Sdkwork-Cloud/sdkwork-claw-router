package types

// App model catalog group option schema exposed by Claw Router.
type AppModelCatalogGroupOption struct {
	Key string `json:"key"`
	Label string `json:"label"`
	ModelCount int `json:"modelCount"`
}
