package types

// App catalog item schema exposed by Claw Router.
type AppCatalogItem struct {
	Category string `json:"category"`
	Description string `json:"description"`
	Developer string `json:"developer"`
	Downloads string `json:"downloads"`
	Features []string `json:"features"`
	Id string `json:"id"`
	Image string `json:"image"`
	Name string `json:"name"`
	Rating float64 `json:"rating"`
	Releases []AppReleaseItem `json:"releases"`
	Screenshots []string `json:"screenshots"`
}
