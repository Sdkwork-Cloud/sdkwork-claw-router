package types

// Skills catalog response schema exposed by Claw Router.
type SkillsCatalogResponse struct {
	Items []SkillCatalogItem `json:"items"`
}
