package types

// Memory space item schema exposed by Claw Router.
type MemorySpaceItem struct {
	AutoExtractEnabled bool `json:"autoExtractEnabled"`
	AutoRecallEnabled bool `json:"autoRecallEnabled"`
	CreatedAt string `json:"createdAt"`
	EntryCount int `json:"entryCount"`
	Id string `json:"id"`
	MaxInjectedTokens int `json:"maxInjectedTokens"`
	MemoryEnabled bool `json:"memoryEnabled"`
	OwnerId string `json:"ownerId"`
	OwnerType string `json:"ownerType"`
	ReviewRequired bool `json:"reviewRequired"`
	SpaceType string `json:"spaceType"`
	Status string `json:"status"`
	Title string `json:"title"`
	UpdatedAt string `json:"updatedAt"`
}
