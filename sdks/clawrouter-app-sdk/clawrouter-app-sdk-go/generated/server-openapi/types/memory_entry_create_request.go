package types

// Memory entry create request schema exposed by Claw Router.
type MemoryEntryCreateRequest struct {
	ConfidenceScore string `json:"confidenceScore"`
	Content string `json:"content"`
	ContentJson map[string]JsonValue `json:"contentJson"`
	ImportanceScore string `json:"importanceScore"`
	MemoryType string `json:"memoryType"`
	Metadata map[string]JsonValue `json:"metadata"`
	SensitivityLevel string `json:"sensitivityLevel"`
	SourceConversationId string `json:"sourceConversationId"`
	SourceInvocationId string `json:"sourceInvocationId"`
	SourceItemId string `json:"sourceItemId"`
	SourceKind string `json:"sourceKind"`
	SourceTurnId string `json:"sourceTurnId"`
	Status string `json:"status"`
	SubjectKey string `json:"subjectKey"`
	SubjectType string `json:"subjectType"`
	TrustLevel string `json:"trustLevel"`
}
