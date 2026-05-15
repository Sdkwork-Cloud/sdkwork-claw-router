package types

// Account security summary schema exposed by Claw Router.
type AccountSecuritySummary struct {
	IpWhitelistCount int `json:"ipWhitelistCount"`
	MfaEnabled bool `json:"mfaEnabled"`
	QpsLimit int `json:"qpsLimit"`
}
