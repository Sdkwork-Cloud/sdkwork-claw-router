package types

// Plus feeds record schema exposed by Claw Router.
type PlusFeedsRecord struct {
	Author map[string]JsonValue `json:"author"`
	CoverImages map[string]JsonValue `json:"cover_images"`
	PublishTime string `json:"publish_time"`
	ResourceList map[string]JsonValue `json:"resource_list"`
	Source string `json:"source"`
	SourceUrl string `json:"source_url"`
	Summary string `json:"summary"`
	Tags map[string]JsonValue `json:"tags"`
	UserId string `json:"user_id"`
}
