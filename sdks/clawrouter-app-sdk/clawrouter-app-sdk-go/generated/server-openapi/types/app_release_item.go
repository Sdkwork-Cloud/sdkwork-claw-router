package types

// App release item schema exposed by Claw Router.
type AppReleaseItem struct {
	Artifact MediaResource `json:"artifact"`
	Id string `json:"id"`
	Os string `json:"os"`
	PlatformType string `json:"platformType"`
	ReleaseDate string `json:"releaseDate"`
	Size string `json:"size"`
	Version string `json:"version"`
	WhatsNew string `json:"whatsNew"`
}
