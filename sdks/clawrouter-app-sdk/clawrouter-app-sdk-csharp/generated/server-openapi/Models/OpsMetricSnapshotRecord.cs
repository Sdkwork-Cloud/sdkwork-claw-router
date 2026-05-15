using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class OpsMetricSnapshotRecord
    {
        public string? CreatedAt { get; set; }
        public string? DimensionKey { get; set; }
        public string? DimensionValue { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MetricName { get; set; }
        public string? MetricPeriod { get; set; }
        public string? MetricScope { get; set; }
        public string? MetricUnit { get; set; }
        public string? MetricValue { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? Payload { get; set; }
        public string? PeriodEnd { get; set; }
        public string? PeriodStart { get; set; }
        public string? RebuildVersion { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
    }
}
