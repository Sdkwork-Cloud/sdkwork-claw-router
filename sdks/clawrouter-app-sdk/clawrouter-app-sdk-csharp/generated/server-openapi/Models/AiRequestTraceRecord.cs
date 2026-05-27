using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiRequestTraceRecord
    {
        public string? ApiKeyGroupId { get; set; }
        public string? ApiKeyGroupSnapshot { get; set; }
        public string? ApiKeyId { get; set; }
        public string? ApiKeyNameSnapshot { get; set; }
        public int? AttemptNo { get; set; }
        public string? CachedTokens { get; set; }
        public string? ChannelId { get; set; }
        public string? ChannelNameSnapshot { get; set; }
        public string? ClientIpHash { get; set; }
        public string? ClientIpMasked { get; set; }
        public string? ClientIpRegion { get; set; }
        public string? CompletionTokens { get; set; }
        public string? CreatedAt { get; set; }
        public string? DecisionLogId { get; set; }
        public string? EndedAt { get; set; }
        public string? Endpoint { get; set; }
        public string? ErrorMessageMasked { get; set; }
        public string? ErrorType { get; set; }
        public string? HttpMethod { get; set; }
        public int? HttpStatus { get; set; }
        public string? Id { get; set; }
        public int? LatencyMs { get; set; }
        public string? LegacyApiKeyId { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerNameSnapshot { get; set; }
        public string? OwnerType { get; set; }
        public string? PayloadHash { get; set; }
        public string? PromptTokens { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderErrorCode { get; set; }
        public string? ProviderId { get; set; }
        public string? ProviderModel { get; set; }
        public string? ProviderNativeModel { get; set; }
        public string? ReasoningEffort { get; set; }
        public string? RequestBytes { get; set; }
        public string? RequestId { get; set; }
        public string? RequestPath { get; set; }
        public string? RequestPayloadHash { get; set; }
        public string? RequestedModel { get; set; }
        public string? RequestedModelCatalogKey { get; set; }
        public string? ResponseBytes { get; set; }
        public string? ResponsePayloadHash { get; set; }
        public string? RetentionUntil { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public bool? Streaming { get; set; }
        public string? TenantId { get; set; }
        public string? TotalTokens { get; set; }
        public string? TraceId { get; set; }
        public int? TtftMs { get; set; }
        public string? UserAgentHash { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
