using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AnalyticsServiceProviderDailyRecord
    {
        public string? AncestorProviderId { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? ExpenseAmount { get; set; }
        public string? FailureCount { get; set; }
        public string? Id { get; set; }
        public string? IncomeAmount { get; set; }
        public string? MarginAmount { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderId { get; set; }
        public string? RebuildVersion { get; set; }
        public string? ReportDate { get; set; }
        public string? RequestCount { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public string? SuccessCount { get; set; }
        public string? TenantId { get; set; }
        public string? TokenCount { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UpstreamCostAmount { get; set; }
        public string? Uuid { get; set; }
    }
}
