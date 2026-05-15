package types

// Routing strategy snapshot schema exposed by Claw Router.
type RoutingStrategySnapshot struct {
	MappingRules []map[string]interface{} `json:"mappingRules"`
	Strategy string `json:"strategy"`
}
