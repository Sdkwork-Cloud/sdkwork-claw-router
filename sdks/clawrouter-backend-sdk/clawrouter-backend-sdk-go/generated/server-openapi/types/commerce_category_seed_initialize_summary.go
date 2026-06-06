package types

// Commerce category seed initialize summary schema exposed by Claw Router.
type CommerceCategorySeedInitializeSummary struct {
	ConfigKey string `json:"configKey"`
	Dataset string `json:"dataset"`
	InstallDefaultEnabled bool `json:"installDefaultEnabled"`
	Requested string `json:"requested"`
	Skipped string `json:"skipped"`
	TargetTable string `json:"targetTable"`
	Upserted string `json:"upserted"`
}
