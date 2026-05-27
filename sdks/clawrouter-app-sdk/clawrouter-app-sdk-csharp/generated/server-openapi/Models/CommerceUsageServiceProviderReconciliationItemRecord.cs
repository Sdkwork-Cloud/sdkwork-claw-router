using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CommerceUsageServiceProviderReconciliationItemRecord
    {
        public string? CreatedAt { get; set; }
        public string? DifferenceAmount { get; set; }
        public string? ExternalAmount { get; set; }
        public string? Id { get; set; }
        public string? InternalAmount { get; set; }
        public bool? LegalHold { get; set; }
        public string? MatchStatus { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? ProviderInvoiceItemId { get; set; }
        public string? ReasonCode { get; set; }
        public string? RequestId { get; set; }
        public string? ResolutionStatus { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RunId { get; set; }
        public string? StatementItemId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UsageEdgeId { get; set; }
        public string? UsageFactId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
