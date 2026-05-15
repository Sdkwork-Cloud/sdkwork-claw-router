using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiGenerationJobRecord
    {
        public string? ChannelId { get; set; }
        public string? CompletedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? FailureCode { get; set; }
        public string? FailureMessageMasked { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? InputAssetIds { get; set; }
        public string? JobType { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Modality { get; set; }
        public string? Model { get; set; }
        public string? NegativePrompt { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? ParameterSnapshot { get; set; }
        public string? PayloadHash { get; set; }
        public int? ProgressPercent { get; set; }
        public string? Prompt { get; set; }
        public string? ProviderId { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? SessionId { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UsageFactId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
