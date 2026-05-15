using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class StudioCatalogActionRecord
    {
        public string? ActionType { get; set; }
        public string? ClientIpHash { get; set; }
        public string? CreatedAt { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? RatingScore { get; set; }
        public string? ReleaseId { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? ReviewBody { get; set; }
        public string? ReviewTitle { get; set; }
        public string? Status { get; set; }
        public string? TargetId { get; set; }
        public string? TargetType { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserAgentHash { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
