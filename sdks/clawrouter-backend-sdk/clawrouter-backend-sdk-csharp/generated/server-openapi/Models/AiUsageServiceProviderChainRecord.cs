using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiUsageServiceProviderChainRecord
    {
        public int? ChainDepth { get; set; }
        public string? ChainHash { get; set; }
        public Dictionary<string, string>? ChainPathSnapshot { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public string? LeafProviderId { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OccurredAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? RequestId { get; set; }
        public string? ResolvedSubjectId { get; set; }
        public string? ResolvedSubjectType { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RootProviderId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UsageFactId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
