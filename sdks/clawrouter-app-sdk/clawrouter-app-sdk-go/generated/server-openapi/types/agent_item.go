package types

// Agent item schema exposed by Claw Router.
type AgentItem struct {
	AvatarUrl string `json:"avatarUrl"`
	Capabilities AgentCapabilities `json:"capabilities"`
	Code string `json:"code"`
	CreatedAt string `json:"createdAt"`
	DefaultVersion AgentVersionItem `json:"defaultVersion"`
	Description string `json:"description"`
	Id string `json:"id"`
	Name string `json:"name"`
	OwnerUserId int `json:"ownerUserId"`
	Status string `json:"status"`
	TemplateSource string `json:"templateSource"`
	UpdatedAt string `json:"updatedAt"`
	Visibility string `json:"visibility"`
}
