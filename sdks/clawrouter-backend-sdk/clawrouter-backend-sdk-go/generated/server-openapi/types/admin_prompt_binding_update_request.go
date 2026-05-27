package types

// Admin prompt binding update request schema exposed by Claw Router.
type AdminPromptBindingUpdateRequest struct {
	BindingRole string `json:"bindingRole"`
	Enabled bool `json:"enabled"`
	OwnerId int `json:"ownerId"`
	OwnerType string `json:"ownerType"`
	PolicyJson map[string]JsonValue `json:"policyJson"`
	Priority int `json:"priority"`
	PromptVersionId int `json:"promptVersionId"`
}
