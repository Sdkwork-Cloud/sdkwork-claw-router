package types

// Iam device record schema exposed by Claw Router.
type IamDeviceRecord struct {
	CreatedAt string `json:"created_at"`
	DeviceFingerprint string `json:"device_fingerprint"`
	Id string `json:"id"`
	LastSeenAt string `json:"last_seen_at"`
	Name string `json:"name"`
	TenantId string `json:"tenant_id"`
	Trusted bool `json:"trusted"`
	UserId string `json:"user_id"`
}
