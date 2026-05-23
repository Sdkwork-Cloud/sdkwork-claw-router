using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiMemoryEmbeddingRecord
    {
        public string? ContentHash { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public int? EmbeddingDimensions { get; set; }
        public string? EmbeddingModel { get; set; }
        public string? EmbeddingProvider { get; set; }
        public string? Id { get; set; }
        public string? IndexedAt { get; set; }
        public string? MemoryId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public Dictionary<string, string>? VectorJson { get; set; }
        public string? VectorStorageKey { get; set; }
        public string? Version { get; set; }
    }
}
