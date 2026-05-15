using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpsGatewayInstanceRecord
    {
        public string? Cell { get; set; }
        public string? ConfigHash { get; set; }
        public string? ContainerIdHash { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeploymentMode { get; set; }
        public string? DesktopDeviceHash { get; set; }
        public string? HealthStatus { get; set; }
        public string? HostName { get; set; }
        public string? Id { get; set; }
        public string? InstanceCode { get; set; }
        public string? IpAddressHash { get; set; }
        public string? IpAddressMasked { get; set; }
        public string? LastHeartbeatAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? NodeName { get; set; }
        public string? Orchestrator { get; set; }
        public string? OrganizationId { get; set; }
        public string? PodName { get; set; }
        public string? Region { get; set; }
        public string? RuntimeType { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? VersionName { get; set; }
    }
}
