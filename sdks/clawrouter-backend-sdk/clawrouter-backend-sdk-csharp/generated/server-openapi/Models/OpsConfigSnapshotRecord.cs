using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpsConfigSnapshotRecord
    {
        public string? ConfigHash { get; set; }
        public Dictionary<string, string>? ConfigPayload { get; set; }
        public string? ConfigScope { get; set; }
        public string? ConfigType { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? PublishedAt { get; set; }
        public string? PublishedBy { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RollbackFromSnapshotId { get; set; }
        public string? SnapshotNo { get; set; }
        public Dictionary<string, string>? SourceIds { get; set; }
        public string? SourceTable { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
