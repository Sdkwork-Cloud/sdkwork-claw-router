using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OpsGatewayHeartbeatRecord
    {
        public string? ActiveConnections { get; set; }
        public string? CpuPercent { get; set; }
        public string? CreatedAt { get; set; }
        public string? DiskPercent { get; set; }
        public string? HeartbeatAt { get; set; }
        public string? Id { get; set; }
        public string? InstanceId { get; set; }
        public bool? LegalHold { get; set; }
        public string? MemoryPercent { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? NetworkInBytes { get; set; }
        public string? NetworkOutBytes { get; set; }
        public string? OpenFileCount { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? Payload { get; set; }
        public string? PayloadHash { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? ThreadCount { get; set; }
        public string? TraceId { get; set; }
        public string? UptimeSeconds { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
