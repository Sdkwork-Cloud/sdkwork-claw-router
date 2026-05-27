package types

// Persisted app template snapshot returned by the backend.
type AdminAppTemplateItemResponse struct {
	AppConfigSchema map[string]JsonValue `json:"appConfigSchema"`
	CapabilityManifest []map[string]JsonValue `json:"capabilityManifest"`
	CategoryCode string `json:"categoryCode"`
	CategoryId string `json:"categoryId"`
	CoverUrl string `json:"coverUrl"`
	CreatedAt string `json:"createdAt"`
	CurrentVersionId string `json:"currentVersionId"`
	DefaultAppConfig map[string]JsonValue `json:"defaultAppConfig"`
	DependencyManifest []map[string]JsonValue `json:"dependencyManifest"`
	Description string `json:"description"`
	Featured bool `json:"featured"`
	Framework string `json:"framework"`
	GitRef string `json:"gitRef"`
	GitRepoUrl string `json:"gitRepoUrl"`
	GitSubPath string `json:"gitSubPath"`
	IconUrl string `json:"iconUrl"`
	Id string `json:"id"`
	Language string `json:"language"`
	PublishStatus string `json:"publishStatus"`
	Runtime string `json:"runtime"`
	SortWeight int `json:"sortWeight"`
	SourceAppId string `json:"sourceAppId"`
	TemplateCode string `json:"templateCode"`
	TemplateName string `json:"templateName"`
	TemplateNo string `json:"templateNo"`
	TemplateType string `json:"templateType"`
	UpdatedAt string `json:"updatedAt"`
	Uuid string `json:"uuid"`
	VariableSchema map[string]JsonValue `json:"variableSchema"`
	Visibility string `json:"visibility"`
}
