package types

// Commerce category seed initialize response schema exposed by Claw Router.
type CommerceCategorySeedInitializeResponse struct {
	Items []CommerceCategorySeedInitializeSummary `json:"items"`
}
