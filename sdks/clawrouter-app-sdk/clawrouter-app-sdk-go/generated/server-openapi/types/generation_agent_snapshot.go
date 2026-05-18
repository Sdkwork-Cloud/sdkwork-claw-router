package types

// Generation agent snapshot schema exposed by Claw Router.
type GenerationAgentSnapshot struct {
	Id string `json:"id"`
	Model string `json:"model"`
	Name string `json:"name"`
	VersionId string `json:"versionId"`
}
