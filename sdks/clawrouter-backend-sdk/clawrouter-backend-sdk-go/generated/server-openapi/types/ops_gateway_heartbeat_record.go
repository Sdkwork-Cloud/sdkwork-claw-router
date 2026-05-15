package types

// Ops gateway heartbeat record schema exposed by Claw Router.
type OpsGatewayHeartbeatRecord struct {
	ActiveConnections string `json:"active_connections"`
	CpuPercent string `json:"cpu_percent"`
	CreatedAt string `json:"created_at"`
	DiskPercent string `json:"disk_percent"`
	HeartbeatAt string `json:"heartbeat_at"`
	Id string `json:"id"`
	InstanceId string `json:"instance_id"`
	LegalHold bool `json:"legal_hold"`
	MemoryPercent string `json:"memory_percent"`
	Metadata map[string]JsonValue `json:"metadata"`
	NetworkInBytes string `json:"network_in_bytes"`
	NetworkOutBytes string `json:"network_out_bytes"`
	OpenFileCount string `json:"open_file_count"`
	OrganizationId string `json:"organization_id"`
	Payload map[string]JsonValue `json:"payload"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	ThreadCount string `json:"thread_count"`
	TraceId string `json:"trace_id"`
	UptimeSeconds string `json:"uptime_seconds"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
