package types

// Memory space create request schema exposed by Claw Router.
type MemorySpaceCreateRequest struct {
	AutoExtractEnabled bool `json:"autoExtractEnabled"`
	AutoRecallEnabled bool `json:"autoRecallEnabled"`
	MaxInjectedTokens string `json:"maxInjectedTokens"`
	MemoryEnabled bool `json:"memoryEnabled"`
	Metadata map[string]JsonValue `json:"metadata"`
	OwnerId string `json:"ownerId"`
	OwnerType string `json:"ownerType"`
	RetentionPolicy map[string]JsonValue `json:"retentionPolicy"`
	ReviewRequired bool `json:"reviewRequired"`
	SensitivityPolicy map[string]JsonValue `json:"sensitivityPolicy"`
	SpaceType string `json:"spaceType"`
	Title string `json:"title"`
}
