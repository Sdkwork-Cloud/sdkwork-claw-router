package types

// Update routing strategy request schema exposed by Claw Router.
type UpdateRoutingStrategyRequest struct {
	MappingRules []map[string]interface{} `json:"mappingRules"`
	Strategy string `json:"strategy"`
}
