using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiMemorySpaceRecord
    {
        public bool? AutoExtractEnabled { get; set; }
        public bool? AutoRecallEnabled { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EntryCount { get; set; }
        public string? Id { get; set; }
        public string? MaxInjectedTokens { get; set; }
        public bool? MemoryEnabled { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public Dictionary<string, string>? RetentionPolicy { get; set; }
        public bool? ReviewRequired { get; set; }
        public Dictionary<string, string>? SensitivityPolicy { get; set; }
        public string? SpaceType { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
