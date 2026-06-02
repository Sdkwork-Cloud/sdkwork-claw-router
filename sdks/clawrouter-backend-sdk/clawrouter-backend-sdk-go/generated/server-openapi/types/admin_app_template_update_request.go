package types

// Admin app template update request schema exposed by Claw Router.
type AdminAppTemplateUpdateRequest struct {
	AppConfigSchema map[string]JsonValue `json:"appConfigSchema"`
	CapabilityManifest []map[string]JsonValue `json:"capabilityManifest"`
	CategoryCode string `json:"categoryCode"`
	CategoryId string `json:"categoryId"`
	Cover MediaResource `json:"cover"`
	DefaultAppConfig map[string]JsonValue `json:"defaultAppConfig"`
	DependencyManifest []map[string]JsonValue `json:"dependencyManifest"`
	Description string `json:"description"`
	Featured bool `json:"featured"`
	Framework string `json:"framework"`
	GitRef string `json:"gitRef"`
	GitRepoUrl string `json:"gitRepoUrl"`
	GitSubPath string `json:"gitSubPath"`
	Icon MediaResource `json:"icon"`
	Language string `json:"language"`
	PublishStatus string `json:"publishStatus"`
	Runtime string `json:"runtime"`
	SortWeight int `json:"sortWeight"`
	SourceAppId string `json:"sourceAppId"`
	TemplateName string `json:"templateName"`
	TemplateType string `json:"templateType"`
	VariableSchema map[string]JsonValue `json:"variableSchema"`
	Visibility string `json:"visibility"`
}
