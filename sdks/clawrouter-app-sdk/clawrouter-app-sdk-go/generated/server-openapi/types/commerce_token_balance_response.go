package types

// Commerce token balance response schema exposed by Claw Router.
type CommerceTokenBalanceResponse struct {
	AvailableTokens int `json:"availableTokens"`
	FrozenTokens int `json:"frozenTokens"`
}
