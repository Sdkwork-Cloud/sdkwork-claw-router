using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiConfigChangeEventRecord
    {
        public string? ChangedObjectId { get; set; }
        public string? ChangedObjectType { get; set; }
        public string? ConfigScope { get; set; }
        public string? ConfigVersion { get; set; }
        public string? CreatedAt { get; set; }
        public Dictionary<string, string>? EventPayload { get; set; }
        public string? EventStatus { get; set; }
        public string? Id { get; set; }
        public string? LastErrorMessage { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public int? PublishAttempts { get; set; }
        public string? PublishedAt { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
