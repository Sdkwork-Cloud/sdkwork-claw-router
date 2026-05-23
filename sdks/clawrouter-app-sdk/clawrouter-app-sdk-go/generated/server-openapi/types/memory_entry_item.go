package types

// Memory entry item schema exposed by Claw Router.
type MemoryEntryItem struct {
	ConfidenceScore string `json:"confidenceScore"`
	Content string `json:"content"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	ImportanceScore string `json:"importanceScore"`
	MemoryType string `json:"memoryType"`
	RecallCount int `json:"recallCount"`
	SensitivityLevel string `json:"sensitivityLevel"`
	SourceConversationId string `json:"sourceConversationId"`
	SourceInvocationId string `json:"sourceInvocationId"`
	SourceItemId string `json:"sourceItemId"`
	SourceKind string `json:"sourceKind"`
	SourceTurnId string `json:"sourceTurnId"`
	SpaceId string `json:"spaceId"`
	Status string `json:"status"`
	SubjectKey string `json:"subjectKey"`
	SubjectType string `json:"subjectType"`
	TrustLevel string `json:"trustLevel"`
	UpdatedAt string `json:"updatedAt"`
}
