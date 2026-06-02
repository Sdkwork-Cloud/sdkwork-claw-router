using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiGenerationAssetRecord
    {
        public int? ActiveIndex { get; set; }
        public MediaResource? Asset { get; set; }
        public string? AssetType { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DownloadCount { get; set; }
        public string? DurationSeconds { get; set; }
        public string? ExpireAt { get; set; }
        public bool? Favorite { get; set; }
        public string? FileSize { get; set; }
        public int? Height { get; set; }
        public string? Id { get; set; }
        public string? JobId { get; set; }
        public string? LastAccessedAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MimeType { get; set; }
        public string? ModelSnapshot { get; set; }
        public string? ObjectKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public Dictionary<string, string>? ParameterSnapshot { get; set; }
        public string? PromptSnapshot { get; set; }
        public string? ShareTokenHash { get; set; }
        public bool? Shared { get; set; }
        public string? Status { get; set; }
        public string? StorageProvider { get; set; }
        public string? TenantId { get; set; }
        public MediaResource? Thumbnail { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? Visibility { get; set; }
        public int? Width { get; set; }
    }
}
