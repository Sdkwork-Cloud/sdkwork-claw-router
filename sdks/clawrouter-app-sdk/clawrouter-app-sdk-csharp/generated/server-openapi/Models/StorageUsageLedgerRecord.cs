using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class StorageUsageLedgerRecord
    {
        public string? AppId { get; set; }
        public string? BusinessDomain { get; set; }
        public string? CreatedAt { get; set; }
        public string? DeltaFileCount { get; set; }
        public string? DeltaLogicalBytes { get; set; }
        public string? DeltaPhysicalBytes { get; set; }
        public string? DeltaReservedBytes { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OccurredAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? Reason { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? ScopeId { get; set; }
        public string? ScopeType { get; set; }
        public string? SpaceId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UsageEventType { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
