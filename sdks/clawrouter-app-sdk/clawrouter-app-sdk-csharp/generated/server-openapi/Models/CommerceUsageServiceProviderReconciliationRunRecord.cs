using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceUsageServiceProviderReconciliationRunRecord
    {
        public string? CreatedAt { get; set; }
        public string? DifferenceAmount { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public string? MatchedCount { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MismatchCount { get; set; }
        public string? MissingExternalCount { get; set; }
        public string? MissingInternalCount { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? PeriodEnd { get; set; }
        public string? PeriodStart { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RunNo { get; set; }
        public string? ScopeId { get; set; }
        public string? ScopeType { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TotalExternalAmount { get; set; }
        public string? TotalInternalAmount { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
