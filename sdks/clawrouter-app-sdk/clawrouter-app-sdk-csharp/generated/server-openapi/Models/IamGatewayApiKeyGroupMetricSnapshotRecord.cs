using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IamGatewayApiKeyGroupMetricSnapshotRecord
    {
        public string? AccountAvailableCount { get; set; }
        public string? AccountTotalCount { get; set; }
        public string? CapacityLimit { get; set; }
        public string? CapacityUsed { get; set; }
        public string? CreatedAt { get; set; }
        public string? GroupCode { get; set; }
        public string? GroupId { get; set; }
        public string? HealthStatus { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderCode { get; set; }
        public string? RebuildVersion { get; set; }
        public string? RequestCountToday { get; set; }
        public string? RequestCountTotal { get; set; }
        public string? SnapshotAt { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UsageAmountToday { get; set; }
        public string? UsageAmountTotal { get; set; }
        public string? Uuid { get; set; }
    }
}
