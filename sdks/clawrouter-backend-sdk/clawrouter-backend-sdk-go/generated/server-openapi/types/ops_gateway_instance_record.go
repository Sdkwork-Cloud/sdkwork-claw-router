package types

// Ops gateway instance record schema exposed by Claw Router.
type OpsGatewayInstanceRecord struct {
	Cell string `json:"cell"`
	ConfigHash string `json:"config_hash"`
	ContainerIdHash string `json:"container_id_hash"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeploymentMode string `json:"deployment_mode"`
	DesktopDeviceHash string `json:"desktop_device_hash"`
	HealthStatus string `json:"health_status"`
	HostName string `json:"host_name"`
	Id string `json:"id"`
	InstanceCode string `json:"instance_code"`
	IpAddressHash string `json:"ip_address_hash"`
	IpAddressMasked string `json:"ip_address_masked"`
	LastHeartbeatAt string `json:"last_heartbeat_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	NodeName string `json:"node_name"`
	Orchestrator string `json:"orchestrator"`
	OrganizationId string `json:"organization_id"`
	PodName string `json:"pod_name"`
	Region string `json:"region"`
	RuntimeType string `json:"runtime_type"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	VersionName string `json:"version_name"`
}
