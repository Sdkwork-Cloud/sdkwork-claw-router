package types

// Agent item schema exposed by Claw Router.
type AgentItem struct {
	Avatar MediaResource `json:"avatar"`
	Capabilities AgentCapabilities `json:"capabilities"`
	Code string `json:"code"`
	CreatedAt string `json:"createdAt"`
	DefaultVersion AgentVersionItem `json:"defaultVersion"`
	Description string `json:"description"`
	Id string `json:"id"`
	Name string `json:"name"`
	OwnerUserId string `json:"ownerUserId"`
	Status string `json:"status"`
	TemplateSource string `json:"templateSource"`
	UpdatedAt string `json:"updatedAt"`
	Visibility string `json:"visibility"`
}
