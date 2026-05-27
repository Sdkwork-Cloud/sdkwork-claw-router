package types

// Admin app template create request schema exposed by Claw Router.
type AdminAppTemplateCreateRequest struct {
	AppConfigSchema map[string]JsonValue `json:"appConfigSchema"`
	CapabilityManifest []map[string]JsonValue `json:"capabilityManifest"`
	CategoryCode string `json:"categoryCode"`
	CategoryId string `json:"categoryId"`
	CoverUrl string `json:"coverUrl"`
	DefaultAppConfig map[string]JsonValue `json:"defaultAppConfig"`
	DependencyManifest []map[string]JsonValue `json:"dependencyManifest"`
	Description string `json:"description"`
	Featured bool `json:"featured"`
	Framework string `json:"framework"`
	GitRef string `json:"gitRef"`
	GitRepoUrl string `json:"gitRepoUrl"`
	GitSubPath string `json:"gitSubPath"`
	IconUrl string `json:"iconUrl"`
	Language string `json:"language"`
	PublishStatus string `json:"publishStatus"`
	Runtime string `json:"runtime"`
	SortWeight int `json:"sortWeight"`
	SourceAppId string `json:"sourceAppId"`
	TemplateCode string `json:"templateCode"`
	TemplateName string `json:"templateName"`
	TemplateNo string `json:"templateNo"`
	TemplateType string `json:"templateType"`
	VariableSchema map[string]JsonValue `json:"variableSchema"`
	Visibility string `json:"visibility"`
}
