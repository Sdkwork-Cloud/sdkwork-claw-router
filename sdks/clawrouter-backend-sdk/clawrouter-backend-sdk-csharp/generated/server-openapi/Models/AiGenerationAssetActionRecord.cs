using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiGenerationAssetActionRecord
    {
        public Dictionary<string, string>? ActionParams { get; set; }
        public string? ActionType { get; set; }
        public string? AssetId { get; set; }
        public string? ClientIpHash { get; set; }
        public string? ClientIpRegion { get; set; }
        public string? CompletedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? FailureCode { get; set; }
        public string? Id { get; set; }
        public string? JobId { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? RequestId { get; set; }
        public string? ResultAssetId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserAgentHash { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
