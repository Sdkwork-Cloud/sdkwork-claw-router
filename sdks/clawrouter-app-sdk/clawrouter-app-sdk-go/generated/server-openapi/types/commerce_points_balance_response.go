package types

// Commerce points balance response schema exposed by Claw Router.
type CommercePointsBalanceResponse struct {
	AvailablePoints int `json:"availablePoints"`
	FrozenPoints int `json:"frozenPoints"`
}
