package types

// Admin app config schema exposed by Claw Router.
type AdminAppConfig struct {
	Portal AdminAppPortalConfig `json:"portal"`
	Standard AdminAppConfigStandard `json:"standard"`
}
