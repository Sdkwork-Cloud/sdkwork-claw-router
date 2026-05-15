package types

// Account consumption item schema exposed by Claw Router.
type AccountConsumptionItem struct {
	Color string `json:"color"`
	Name string `json:"name"`
	Percentage float64 `json:"percentage"`
	Value float64 `json:"value"`
}
