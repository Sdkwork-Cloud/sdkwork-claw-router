package types

// Firewalls rules delete result schema exposed by Claw Router.
type FirewallsRulesDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
