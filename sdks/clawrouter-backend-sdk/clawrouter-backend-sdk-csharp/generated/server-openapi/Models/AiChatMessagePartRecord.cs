using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiChatMessagePartRecord
    {
        public string? AssetId { get; set; }
        public string? CreatedAt { get; set; }
        public string? FileName { get; set; }
        public string? FileSize { get; set; }
        public string? Id { get; set; }
        public string? ItemId { get; set; }
        public Dictionary<string, string>? JsonContent { get; set; }
        public bool? LegalHold { get; set; }
        public string? MessageId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MimeType { get; set; }
        public string? OrganizationId { get; set; }
        public int? PartNo { get; set; }
        public string? PartType { get; set; }
        public string? PayloadHash { get; set; }
        public string? ProviderPartId { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? Sha256 { get; set; }
        public string? Status { get; set; }
        public string? StorageUrl { get; set; }
        public string? TenantId { get; set; }
        public string? TextContent { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
